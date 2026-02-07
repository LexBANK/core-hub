# Package Lock Analysis Report

## Project Overview
- **Project Name**: `chanfana-openapi-template` (lockfile) / `core-hub` (package.json)
- **Lockfile Version**: 3
- **Node Package Manager**: npm (based on lockfile structure)

> **Note**: The lockfile name (`chanfana-openapi-template`) differs from `package.json` (`core-hub`).
> The lockfile was likely generated from the original template before the project was renamed.
> Running `npm install` would synchronize the names.

## Direct Dependencies

### Production Dependencies (3):
1. **chanfana**: `2.8.3` - OpenAPI documentation generator
2. **hono**: `4.11.1` - Lightweight web framework for Cloudflare Workers
3. **zod**: `3.25.67` - TypeScript-first schema validation

### Development Dependencies (5):
1. **@cloudflare/vitest-pool-workers**: `0.10.11` - Testing framework for Cloudflare Workers
2. **@types/node**: `24.10.1` - TypeScript definitions for Node.js
3. **typescript**: `5.9.3` - TypeScript compiler
4. **vitest**: `3.2.4` - Testing framework
5. **wrangler**: `4.56.0` - Cloudflare Workers CLI tool

## Dependency Statistics

- **Total Packages**: **242** (including transitive dependencies)
- **Direct Dependencies**: 8 packages (3 production + 5 development)
- **Transitive Dependencies**: 234 packages
- **Production Packages**: 9 (direct deps + their transitive deps)
- **Dev-Only Packages**: 233
- **Optional Packages**: 131 (mostly platform-specific native binaries)
- **Platform-Specific Packages**: 129 (53.3% — binaries for specific OS/CPU combos)

### Unique Scopes/Namespaces (13):

| Scope | Count |
|---|---|
| @esbuild | 52 |
| @cloudflare | 41 |
| @rollup | 22 |
| @img | 19 |
| @vitest | 7 |
| @types | 4 |
| @jridgewell | 3 |
| @poppinss | 3 |
| @asteasolutions | 1 |
| @cspotcode | 1 |
| @emnapi | 1 |
| @sindresorhus | 1 |
| @speed-highlight | 1 |

The @esbuild and @cloudflare scopes dominate because they ship platform-specific native binaries for each OS/CPU combination.

### Key Dependency Categories:
1. **Cloudflare Ecosystem** (@cloudflare/*, wrangler, workerd, miniflare)
2. **Testing Tools** (vitest, chai, related testing utilities)
3. **Build Tools** (esbuild, rollup, typescript, vite)
4. **Web Framework** (hono)
5. **Schema/Validation** (zod, openapi3-ts, @asteasolutions/zod-to-openapi)
6. **Utility Libraries** (pathe, color, debug, nanoid, etc.)

## License Analysis

The project includes dependencies with **12 unique licenses**:

| License | Count | Percentage |
|---|---|---|
| MIT | 192 | 79.3% |
| Apache-2.0 | 24 | 9.9% |
| LGPL-3.0-or-later | 8 | 3.3% |
| ISC | 5 | 2.1% |
| MIT OR Apache-2.0 | 5 | 2.1% |
| Apache-2.0 AND LGPL-3.0-or-later | 2 | 0.8% |
| 0BSD | 1 | 0.4% |
| Apache-2.0 AND LGPL-3.0-or-later AND MIT | 1 | 0.4% |
| BSD-2-Clause | 1 | 0.4% |
| BSD-3-Clause | 1 | 0.4% |
| CC0-1.0 | 1 | 0.4% |
| Python-2.0 | 1 | 0.4% |

The vast majority of dependencies (79.3%) use the permissive MIT license, which is typical for the JavaScript/TypeScript ecosystem. All licenses present are permissive or weak-copyleft.

**LGPL-3.0 Note**: The 8 LGPL-licensed packages are all `@img/sharp-*` platform binaries and the `sharp` package itself. These are **transitive dev dependencies** pulled in by `miniflare` (via `wrangler`) and are only used in the local development environment — they are not bundled into production deployments.

## Architecture Insights

This is a **Cloudflare Workers project** with:
- **Hono** as the web framework
- **TypeScript** for type safety
- **Zod** for runtime validation
- **Chanfana** for automatic OpenAPI documentation generation
- **D1** as the database (per `package.json` scripts and Cloudflare config)
- **Comprehensive testing setup** with Vitest and Cloudflare Workers testing utilities

### Node.js Engine Requirements
- The strictest engine requirements come from **vite** and **yargs-parser**: `node ^20.19.0 || >=22.12.0`
- **wrangler** requires `node >= 20`
- Most packages require `node >= 18`

## Security Considerations

1. **Binary Dependencies**: 129 platform-specific packages (esbuild, sharp, workerd, rollup) are properly managed through optional dependencies with OS/CPU constraints.
2. **License Compliance**: All LGPL components (sharp/image libraries) are dev-only transitive dependencies and do not ship in production bundles.
3. **Minimal Production Footprint**: Only 9 packages are production dependencies, keeping the attack surface small.
4. **Development Focus**: The heavy Cloudflare Workers tooling (233 dev packages) is for local development only and doesn't affect the deployed worker.

## Recommendations

1. **Sync lockfile name**: Run `npm install` to update the lockfile project name from `chanfana-openapi-template` to `core-hub`.
2. **Node.js version**: Ensure Node.js >= 20.19.0 is used to satisfy all engine constraints (particularly vite and wrangler).
3. **Dependency Audit**: Run `npm audit` periodically given the 242-package dependency tree.
4. **Bundle Size Monitoring**: Cloudflare Workers have size limits; the production footprint is small (9 packages) but should be monitored as dependencies grow.
