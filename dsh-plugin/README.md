# Claude-mem Marian DSH bridge

This Host plugin connects DeepSeek Harness (DSH) to the existing local claude-mem worker.

## What it does

- Reads project memory from `GET /api/context/inject` on fresh start or clear, not on resume or compact, to avoid duplicate history.
- Adds returned memory to the agent's next step.
- Sends committed user and assistant text to `POST /api/sessions/init` and `POST /api/sessions/observations` after each completed turn.
- Requests a summary from `POST /api/sessions/summarize` when the agent ends.
- Does not capture reasoning blocks, stream chunks, tool arguments, or its own injected memory text.
- Uses a two-second request timeout and fails open if the worker is offline.
- Sends requests only to loopback HTTP hosts: `localhost`, `127.0.0.1`, or `::1`.

The worker must listen at `http://127.0.0.1:37777`, or `workerUrl` must be changed in `cordis.patch.yml`. The worker URL is checked before any request. The integration sends DSH turns and project paths to the local worker. Recalled memory is also sent to the model provider selected in DSH.

## Install

In DSH, open **Plugins** and choose **Add plugin**. Select this `dsh-plugin` directory. This changes the active DSH profile and affects its sessions.

## Check

Run `npm test` inside this directory. A live check also needs the local worker running and a new DSH session.
