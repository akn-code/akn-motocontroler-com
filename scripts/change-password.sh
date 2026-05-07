#!/bin/bash
set -euo pipefail

STACK_NAME="motocontroler"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[+]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[x]${NC} $*"; exit 1; }

# Check node is available for bcrypt hashing
if ! command -v node &>/dev/null; then
  error "node is required but not found. Install Node.js first."
fi

# Get email
printf "E-mail użytkownika: "
read -r EMAIL

if [ -z "$EMAIL" ]; then
  error "E-mail nie może być pusty."
fi

# Check user exists in DB
DB_CONTAINER=$(docker ps --filter "name=${STACK_NAME}_db" --format "{{.ID}}" | head -1)
if [ -z "$DB_CONTAINER" ]; then
  error "Nie znaleziono kontenera bazy danych (${STACK_NAME}_db). Czy stack jest uruchomiony?"
fi

FOUND=$(docker exec "$DB_CONTAINER" psql -U motocontroler -d motocontroler -tAc \
  "SELECT COUNT(*) FROM users WHERE email = '${EMAIL}';")

if [ "$FOUND" = "0" ]; then
  error "Użytkownik '${EMAIL}' nie istnieje w bazie."
fi

# Get new password (twice)
printf "Nowe hasło: "
read -rs PASSWORD1
echo
printf "Powtórz hasło: "
read -rs PASSWORD2
echo

if [ -z "$PASSWORD1" ]; then
  error "Hasło nie może być puste."
fi

if [ "$PASSWORD1" != "$PASSWORD2" ]; then
  error "Hasła nie są zgodne."
fi

# Hash password with bcrypt (cost 12) using Node.js
info "Generowanie hasha bcrypt..."
HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('${PASSWORD1}', 12).then(h => process.stdout.write(h));
" 2>/dev/null)

if [ -z "$HASH" ]; then
  error "Nie udało się wygenerować hasha. Sprawdź czy bcryptjs jest zainstalowany (npm install)."
fi

# Update in DB
docker exec "$DB_CONTAINER" psql -U motocontroler -d motocontroler -c \
  "UPDATE users SET password_hash = '${HASH}' WHERE email = '${EMAIL}';" >/dev/null

info "Hasło dla '${EMAIL}' zostało zmienione."
