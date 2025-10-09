#!/usr/bin/env bash
set -euo pipefail

cd /workspaces/super-octo-happiness || { echo "Workspace not found: /workspaces/super-octo-happiness"; exit 1; }

echo "Detecting project type in $(pwd)..."

if [ -f package.json ]; then
  echo "Node.js project (package.json)"
  if command -v pnpm >/dev/null && [ -f pnpm-lock.yaml ]; then
    pnpm install
    pnpm run build || pnpm test
  elif command -v yarn >/dev/null && [ -f yarn.lock ]; then
    yarn install
    yarn build || yarn test
  else
    npm install
    npm run build || npm test
  fi
elif [ -f Makefile ]; then
  echo "Makefile detected"
  make
elif [ -f pom.xml ]; then
  echo "Maven project (pom.xml)"
  mvn -B package
elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then
  echo "Gradle project"
  if [ -x ./gradlew ]; then ./gradlew build; else gradle build; fi
elif [ -f go.mod ]; then
  echo "Go project"
  go test ./... && go build ./...
elif [ -f Cargo.toml ]; then
  echo "Rust (Cargo.toml)"
  cargo test && cargo build --release
elif [ -f pyproject.toml ] || [ -f setup.py ]; then
  echo "Python project"
  [ -f requirements.txt ] && python -m pip install -r requirements.txt || true
  pytest -q || true
else
  echo "No recognized build file found. Listing root files:"
  ls -la
  exit 2
fi

echo "Build script finished."
