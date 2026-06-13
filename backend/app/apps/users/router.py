from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import uuid
import secrets

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    decode_token,
    get_current_user
)
from app.apps.users.models import User
from app.apps.users.schemas import (
    UserCreate, 
    UserRead, 
    UserUpdate, 
    Token, 
    LoginRequest, 
    RefreshRequest,
    SupabaseAuthRequest,
    SupabaseAuthResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


async def _verify_supabase_access_token(access_token: str) -> dict:
    """Validate a Supabase user JWT via the Auth API."""
    if not settings.SUPABASE_URL.strip() or not settings.SUPABASE_ANON_KEY.strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured on the server",
        )

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "apikey": settings.SUPABASE_ANON_KEY,
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase session",
        )

    return response.json()


async def _upsert_user_from_supabase(sb_user: dict, db: AsyncSession) -> User:
    metadata = sb_user.get("user_metadata") or {}
    email = sb_user.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Supabase user is missing an email address",
        )

    role = metadata.get("role", "beneficiary")
    if role not in {"beneficiary", "asha_worker", "partner", "admin"}:
        role = "beneficiary"

    user_id = uuid.UUID(sb_user["id"])
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if user:
        user.full_name = metadata.get("full_name") or user.full_name
        user.role = role
        user.phone_number = metadata.get("phone_number") or user.phone_number
        user.language = metadata.get("language") or user.language
        user.avatar_url = metadata.get("avatar_url") or user.avatar_url
    else:
        user = User(
            id=user_id,
            email=email,
            password_hash=get_password_hash(secrets.token_urlsafe(32)),
            full_name=metadata.get("full_name"),
            role=role,
            phone_number=metadata.get("phone_number"),
            language=metadata.get("language") or "hi",
            avatar_url=metadata.get("avatar_url"),
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)
    return user


@router.post("/supabase", response_model=SupabaseAuthResponse)
async def supabase_auth(
    body: SupabaseAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify Supabase login and issue backend API tokens."""
    sb_user = await _verify_supabase_access_token(body.access_token)
    user = await _upsert_user_from_supabase(sb_user, db)

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return SupabaseAuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user,
    )


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
        phone_number=user_data.phone_number,
        language=user_data.language,
        avatar_url=user_data.avatar_url
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login and get access tokens"""
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token"""
    payload = decode_token(refresh_data.refresh_token)
    
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(access_token=access_token, refresh_token=new_refresh_token)


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


@router.put("/me", response_model=UserRead)
async def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user
