import axios from 'axios';
import apiClient, { tokenManager } from './api';
import { getApiBaseUrl } from './config';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { User } from '../types';
import { DEMO_USER_BY_ROLE } from '../store/mockData';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name?: string;
    role?: 'beneficiary' | 'asha_worker' | 'partner' | 'admin';
    phone_number?: string;
    language?: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginOptions {
    role?: User['role'];
    name?: string;
}

interface BackendUser {
    id: string;
    full_name?: string | null;
    role: User['role'];
    avatar_url?: string | null;
}

const API_BASE_URL = getApiBaseUrl();
const BYPASS_USER_KEY = 'asha_bypass_user';
export const BYPASS_TOKEN = 'dev_bypass_token';

const isBypassSession = () => tokenManager.getAccessToken() === BYPASS_TOKEN;

/** Demo mode: bypass all auth — any credentials are accepted for now. */
export const isAuthBypassEnabled = (): boolean => true;

const mapBackendUser = (user: BackendUser): User => ({
    id: String(user.id),
    name: user.full_name || 'Guest',
    role: user.role,
    avatar: user.avatar_url || undefined,
});

let authStateListener: { subscription: { unsubscribe: () => void } } | null = null;

const bypassLogin = (
    credentials: LoginCredentials,
    options?: LoginOptions,
): { user: User; tokens: AuthTokens } => {
    const role = options?.role ?? 'beneficiary';
    const demoUser = DEMO_USER_BY_ROLE[role];
    const emailName = credentials.email?.trim().split('@')[0];
    const displayName =
        options?.name?.trim() ||
        (emailName && emailName.length > 0 ? emailName : '') ||
        demoUser.name;
    const user: User = {
        ...demoUser,
        name: displayName,
    };
    const tokens: AuthTokens = {
        access_token: BYPASS_TOKEN,
        refresh_token: BYPASS_TOKEN,
        token_type: 'bearer',
    };
    tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
    localStorage.setItem(BYPASS_USER_KEY, JSON.stringify(user));
    return { user, tokens };
};

const exchangeSupabaseSession = async (
    accessToken: string,
): Promise<{ user: User; tokens: AuthTokens }> => {
    const { data } = await axios.post<AuthTokens & { user: BackendUser }>(
        `${API_BASE_URL}/auth/supabase`,
        { access_token: accessToken },
    );

    tokenManager.setTokens(data.access_token, data.refresh_token);

    return {
        user: mapBackendUser(data.user),
        tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_type: data.token_type,
        },
    };
};

const loginViaBackend = async (
    credentials: LoginCredentials,
): Promise<{ user: User; tokens: AuthTokens }> => {
    const { data: tokens } = await axios.post<AuthTokens>(
        `${API_BASE_URL}/auth/login`,
        credentials,
    );

    tokenManager.setTokens(tokens.access_token, tokens.refresh_token);

    const { data: user } = await apiClient.get<BackendUser>('/auth/me');

    return {
        user: mapBackendUser(user),
        tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
        },
    };
};

const registerViaBackend = async (data: RegisterData): Promise<User> => {
    const { data: user } = await axios.post<BackendUser>(
        `${API_BASE_URL}/auth/register`,
        {
            email: data.email,
            password: data.password,
            full_name: data.full_name,
            role: data.role ?? 'beneficiary',
            phone_number: data.phone_number,
            language: data.language ?? 'hi',
        },
    );
    return mapBackendUser(user);
};

const shouldFallbackToBackendAuth = (message: string): boolean => {
    const msg = message.toLowerCase();
    return (
        msg.includes('invalid login credentials') ||
        msg.includes('invalid email or password') ||
        msg.includes('incorrect email or password') ||
        msg.includes('user not found') ||
        msg.includes('email rate limit') ||
        msg.includes('over_email_send_rate_limit')
    );
};

export const authService = {
    initialize: async (): Promise<User | null> => {
        try {
            if (isAuthBypassEnabled()) {
                if (isBypassSession()) {
                    const stored = localStorage.getItem(BYPASS_USER_KEY);
                    if (stored) {
                        try {
                            return JSON.parse(stored) as User;
                        } catch {
                            tokenManager.clearTokens();
                        }
                    }
                }
                return null;
            }

            if (!isSupabaseConfigured()) {
                return null;
            }

            if (tokenManager.getAccessToken() === BYPASS_TOKEN) {
                tokenManager.clearTokens();
                localStorage.removeItem(BYPASS_USER_KEY);
            }

            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();

        if (!authStateListener) {
            const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    tokenManager.clearTokens();
                    localStorage.removeItem(BYPASS_USER_KEY);
                    return;
                }
                if (
                    (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
                    session?.access_token
                ) {
                    try {
                        await exchangeSupabaseSession(session.access_token);
                    } catch {
                        tokenManager.clearTokens();
                    }
                }
            });
            authStateListener = data;
        }

        if (!session?.access_token) {
            if (tokenManager.isAuthenticated()) {
                return authService.getCurrentUser();
            }
            return null;
        }

            try {
                const { user } = await exchangeSupabaseSession(session.access_token);
                return user;
            } catch {
                tokenManager.clearTokens();
                await supabase.auth.signOut();
                return null;
            }
        } catch {
            tokenManager.clearTokens();
            localStorage.removeItem(BYPASS_USER_KEY);
            return null;
        }
    },

    register: async (data: RegisterData): Promise<User> => {
        if (isAuthBypassEnabled()) {
            const { user } = bypassLogin(
                { email: data.email, password: data.password },
                { role: (data.role as User['role']) ?? 'beneficiary', name: data.full_name },
            );
            return user;
        }

        const supabase = getSupabase();
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.full_name,
                    role: data.role ?? 'beneficiary',
                    phone_number: data.phone_number,
                    language: data.language ?? 'hi',
                },
            },
        });

        if (error) {
            if (shouldFallbackToBackendAuth(error.message)) {
                try {
                    await registerViaBackend(data);
                } catch {
                    // User may already exist in backend — proceed to login.
                }
                const { user } = await loginViaBackend({
                    email: data.email,
                    password: data.password,
                });
                return user;
            }
            throw new Error(error.message);
        }
        if (!authData.user) throw new Error('Registration failed');

        if (!authData.session?.access_token) {
            try {
                await registerViaBackend(data);
            } catch {
                // User may already exist in backend — proceed to login.
            }
            const { user } = await loginViaBackend({
                email: data.email,
                password: data.password,
            });
            return user;
        }

        const { user } = await exchangeSupabaseSession(authData.session.access_token);
        return user;
    },

    login: async (
        credentials: LoginCredentials,
        options?: LoginOptions,
    ): Promise<{ user: User; tokens: AuthTokens }> => {
        if (isAuthBypassEnabled()) {
            return bypassLogin(credentials, options);
        }

        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            if (shouldFallbackToBackendAuth(error.message)) {
                return loginViaBackend(credentials);
            }
            throw new Error(error.message);
        }
        if (!data.session?.access_token || !data.user) throw new Error('Login failed');

        if (options?.role && !data.user.user_metadata?.role) {
            await supabase.auth.updateUser({
                data: {
                    role: options.role,
                    full_name: options.name ?? data.user.user_metadata?.full_name,
                },
            });
        }

        return exchangeSupabaseSession(data.session.access_token);
    },

    logout: async () => {
        if (isSupabaseConfigured()) {
            await getSupabase().auth.signOut();
        }
        tokenManager.clearTokens();
        localStorage.removeItem(BYPASS_USER_KEY);
    },

    getCurrentUser: async (): Promise<User | null> => {
        if (isBypassSession()) {
            const stored = localStorage.getItem(BYPASS_USER_KEY);
            if (stored) {
                try {
                    return JSON.parse(stored) as User;
                } catch {
                    return null;
                }
            }
        }

        if (!tokenManager.isAuthenticated()) {
            return null;
        }

        try {
            const response = await apiClient.get<BackendUser>('/auth/me');
            return mapBackendUser(response.data);
        } catch {
            tokenManager.clearTokens();
            return null;
        }
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        if (isBypassSession()) {
            const stored = localStorage.getItem(BYPASS_USER_KEY);
            const user = stored ? (JSON.parse(stored) as User) : null;
            if (!user) throw new Error('No bypass user');
            const updated = { ...user, ...data };
            localStorage.setItem(BYPASS_USER_KEY, JSON.stringify(updated));
            return updated;
        }

        if (isSupabaseConfigured()) {
            const supabase = getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.auth.updateUser({
                    data: {
                        full_name: data.name ?? user.user_metadata?.full_name,
                        role: data.role ?? user.user_metadata?.role,
                        avatar_url: data.avatar ?? user.user_metadata?.avatar_url,
                    },
                });
            }
        }

        const response = await apiClient.put<BackendUser>('/auth/me', {
            full_name: data.name,
            avatar_url: data.avatar,
        });
        return mapBackendUser(response.data);
    },

    isAuthenticated: () => tokenManager.isAuthenticated(),

    refreshToken: async (): Promise<AuthTokens | null> => {
        if (isBypassSession()) {
            return {
                access_token: BYPASS_TOKEN,
                refresh_token: BYPASS_TOKEN,
                token_type: 'bearer',
            };
        }

        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await apiClient.post<AuthTokens>('/auth/refresh', {
                refresh_token: refreshToken,
            });
            tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
            return response.data;
        } catch {
            tokenManager.clearTokens();
            if (isSupabaseConfigured()) {
                await getSupabase().auth.signOut();
            }
            return null;
        }
    },
};

export default authService;
