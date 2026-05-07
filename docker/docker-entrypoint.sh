#!/bin/sh
set -e

# Load Docker secrets into environment variables.
# Swarm mounts secrets as files under /run/secrets/<name>.
# Next.js reads env vars, not files, so we export them here.

if [ -f /run/secrets/auth_secret ] && [ -z "$AUTH_SECRET" ]; then
  export AUTH_SECRET=$(cat /run/secrets/auth_secret)
fi

if [ -f /run/secrets/db_password ] && [ -n "$DATABASE_URL" ]; then
  # Replace the placeholder password in the connection string with the secret value
  DB_PASS=$(cat /run/secrets/db_password)
  export DATABASE_URL=$(echo "$DATABASE_URL" | sed "s|motocontroler@|motocontroler:${DB_PASS}@|")
fi

exec "$@"
