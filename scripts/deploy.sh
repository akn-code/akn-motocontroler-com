#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
STACK_NAME="motocontroler"
IMAGE_NAME="motocontroler"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${GREEN}[+]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[x]${NC} $*"; exit 1; }

# Check Docker Swarm is active
if ! docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
  error "Docker Swarm is not active. Run: docker swarm init"
fi

# Create secrets interactively if missing
create_secret() {
  local name="$1"
  local prompt="$2"
  local generate="$3"

  if docker secret inspect "$name" &>/dev/null; then
    info "Secret '$name' already exists — skipping."
    return
  fi

  if [ "$generate" = "true" ]; then
    warn "Secret '$name' not found. Generating random value..."
    openssl rand -base64 32 | docker secret create "$name" -
    info "Secret '$name' created."
  else
    warn "Secret '$name' not found."
    printf "%s: " "$prompt"
    read -rs value
    echo
    if [ -z "$value" ]; then
      error "Value cannot be empty."
    fi
    echo "$value" | docker secret create "$name" -
    info "Secret '$name' created."
  fi
}

create_secret "auth_secret" "" "true"
create_secret "db_password" "Enter database password" "false"

# Build image
info "Building image ${FULL_IMAGE}..."
docker build -t "${FULL_IMAGE}" "${PROJECT_DIR}"

# Deploy or update stack
if docker stack ps "${STACK_NAME}" &>/dev/null 2>&1; then
  info "Stack '${STACK_NAME}' already running — updating app service..."
  docker service update \
    --image "${FULL_IMAGE}" \
    --with-registry-auth \
    "${STACK_NAME}_app"
else
  info "Deploying stack '${STACK_NAME}'..."
  cd "${PROJECT_DIR}"
  APP_IMAGE="${FULL_IMAGE}" docker stack deploy \
    --compose-file docker/docker-stack.yml \
    --with-registry-auth \
    "${STACK_NAME}"
fi

# Wait for service to stabilize
info "Waiting for services to stabilize..."
sleep 5

# Show status
echo ""
docker stack services "${STACK_NAME}"
echo ""

info "Done. App available at http://localhost:4321"
info "Logs: docker service logs -f ${STACK_NAME}_app"
