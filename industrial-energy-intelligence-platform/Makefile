# ============================================================
# IEIP — Makefile
# Common development commands
# ============================================================

.PHONY: help up down build logs backend-shell db-shell test lint format migrate seed

help:  ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---- Docker ----
up:  ## Start all services
	docker compose up --build

up-dev:  ## Start services in dev mode (hot reload)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

down:  ## Stop all services
	docker compose down

down-clean:  ## Stop and remove volumes
	docker compose down -v

build:  ## Build images without starting
	docker compose build

logs:  ## Follow logs from all services
	docker compose logs -f

logs-backend:  ## Follow backend logs
	docker compose logs -f backend

# ---- Shells ----
backend-shell:  ## Open shell in backend container
	docker compose exec backend bash

db-shell:  ## Open psql in database container
	docker compose exec db psql -U ieip_user -d ieip_db

# ---- Backend Development ----
install-backend:  ## Install backend dependencies locally
	cd backend && pip install -e ".[dev]"

test:  ## Run all backend tests
	docker compose exec backend pytest tests/ -v --cov=app --cov-report=term-missing

test-unit:  ## Run unit tests only
	docker compose exec backend pytest tests/unit/ -v

test-integration:  ## Run integration tests only
	docker compose exec backend pytest tests/integration/ -v

test-scenarios:  ## Run scenario tests
	docker compose exec backend pytest tests/scenarios/ -v

lint:  ## Run ruff linter
	docker compose exec backend ruff check app/ tests/

format:  ## Run ruff formatter
	docker compose exec backend ruff format app/ tests/

typecheck:  ## Run mypy type checking
	docker compose exec backend mypy app/

# ---- Database ----
migrate:  ## Run Alembic migrations
	docker compose exec backend alembic upgrade head

migrate-new:  ## Create new migration (usage: make migrate-new MSG="description")
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"

seed:  ## Seed demo data (Planta Demo Caribe)
	docker compose exec backend python -m app.core.seeder

# ---- Frontend ----
frontend-install:  ## Install frontend dependencies
	cd frontend && npm install

frontend-dev:  ## Start frontend dev server
	cd frontend && npm run dev

frontend-build:  ## Build frontend for production
	cd frontend && npm run build

# ---- Security ----
generate-secret:  ## Generate a secure SECRET_KEY
	python -c "import secrets; print(secrets.token_hex(32))"
