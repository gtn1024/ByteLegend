# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ByteLegend is a free, opensource MMORPG game for learning programming skills. Built with Kotlin Multiplatform using:
- **Frontend**: Kotlin/JS with React wrappers (`kotlin-wrappers`)
- **Backend**: Vert.x (reactive toolkit on JVM) - see `server` submodule
- **Build**: Gradle (Kotlin DSL) with Kotlin 1.7.10, JDK 11 required

## Build Commands

```bash
# Start local development server (opensource version)
./gradlew server-opensource:bootRun

# Run all checks (lint + tests)
./gradlew check

# Kotlin linting
./gradlew ktlint           # Check
./gradlew ktlintFormat     # Auto-format

# Run tests for specific modules
./gradlew server-opensource:check
./gradlew server:app:test
./gradlew server:app:integTest
./gradlew server:app:browserTest
```

## Architecture

```
ByteLegend/
├── build.gradle.kts      # Root build config
├── settings.gradle.kts   # Module definitions
├── buildSrc/             # Custom Gradle plugins (ktlint, resource building)
├── shared/               # Kotlin Multiplatform shared code (JVM + JS)
├── server-shared/        # Server-side common code
├── client/               # Frontend (Kotlin/JS + React)
│   ├── game-page/        # Main UI entry point (GamePage.kt)
│   ├── game-api/         # Client game API
│   └── game-*/           # Per-island game logic
├── server-opensource/    # Open-source Spring Boot backend
├── server/               # Private git submodule (not opensource)
└── game-data/            # Game content (separate git submodule)
```

## Key Entry Points

- **Frontend**: `client/game-page/src/main/kotlin/com/bytelegend/client/app/page/GamePage.kt` - Main React component and navigation hub
- **Backend** (in `server` submodule): `com.bytelegend.app.backend.GameServerKt` - Vert.x server entry point

## Development Notes

- Initialize game-data submodule: `git submodule update --init -- game-data`
- First build takes minutes (generates game resources); subsequent builds are fast
- `server` directory is a private git submodule containing sensitive configurations
- Tests use JUnit 5, located alongside source code in each module
