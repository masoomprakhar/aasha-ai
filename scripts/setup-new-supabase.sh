#!/usr/bin/env bash
# Link a new Supabase project and push the ASHA AI schema.
# Prerequisites: npm i -g supabase (or brew install supabase/tap/supabase)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Install Supabase CLI first: https://supabase.com/docs/guides/cli"
  exit 1
fi

if [ -z "${1:-}" ]; then
  echo "Usage: ./scripts/setup-new-supabase.sh YOUR_PROJECT_REF"
  echo "Find project ref in Supabase Dashboard → Project Settings → General"
  exit 1
fi

PROJECT_REF="$1"

echo "Linking Supabase project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF"

echo "Pushing migrations to remote database..."
supabase db push

echo ""
echo "Done. Add these to frontend/.env (Dashboard → Project Settings → API):"
echo "  VITE_SUPABASE_URL=https://${PROJECT_REF}.supabase.co"
echo "  VITE_SUPABASE_ANON_KEY=<anon public key>"
echo ""
echo "Add database URL to backend/.env (Dashboard → Database → Connection string → URI, pooler port 6543)."
