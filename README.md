# Smart Farming Frontend (React PWA)

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Protected – changes must go through a pull request from `dev`. |
| `dev`  | Active development branch. All feature branches should be created from and merged back into `dev`. |

Workflow: `feature/*` → `dev` → PR → `main`

## Notes
- PWA support is enabled via `vite-plugin-pwa`.
- The app is ready to call a Spring backend API.
