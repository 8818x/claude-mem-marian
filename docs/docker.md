# Docker

> **Modified by the claude-mem-marian fork:** Clarified that this stack runs the separate server runtime, not the local worker HTTP runtime (Decision 17). The API-key authentication policy is unchanged.

The root `docker-compose.yml` starts Claude-Mem Server beta with a persistent Valkey sidecar.

```sh
docker compose up --build
curl http://127.0.0.1:37777/healthz
```

The server container uses:

- `CLAUDE_MEM_WORKER_HOST=0.0.0.0`
- `CLAUDE_MEM_DATA_DIR=/data/claude-mem`
- `CLAUDE_MEM_QUEUE_ENGINE=bullmq`
- `CLAUDE_MEM_REDIS_URL=redis://valkey:6379`
- `CLAUDE_MEM_AUTH_MODE=api-key`

Create an API key inside the container before using protected V1 write routes.

This stack never runs the local worker HTTP runtime (`worker-service.cjs`), so the local worker's startup rule — a non-loopback `CLAUDE_MEM_WORKER_HOST` requires a non-empty `CLAUDE_MEM_TV_TOKEN`, refused before listening otherwise — does not apply here. The server container's `CLAUDE_MEM_WORKER_HOST=0.0.0.0` is a legacy variable read by some libraries; the HTTP service is the server runtime, authenticated by API keys.
