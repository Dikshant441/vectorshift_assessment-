# VectorShift — Frontend Technical Assessment

A visual pipeline builder: drag nodes onto a canvas, wire them together, and submit
the graph to a FastAPI backend that reports its size and whether it forms a DAG.

- **Frontend:** React 18 + [React Flow](https://reactflow.dev/) + [Zustand](https://github.com/pmndrs/zustand)
- **Backend:** Python + FastAPI

## Running locally

**Backend** (from `/backend`):

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000
```

**Frontend** (from `/frontend`):

```bash
npm install
npm start                          # http://localhost:3000
```

The frontend expects the backend on `http://localhost:8000` (see `src/submit.js`).

---

## Part 1 — Node Abstraction

All shared node behaviour lives in one component, **`src/nodes/BaseNode.js`**. Each
node describes *what* it contains; `BaseNode` owns *how* it is rendered, styled, and
wired into the store:

| Prop        | Purpose                                                              |
|-------------|---------------------------------------------------------------------|
| `title`     | Text shown in the coloured header                                   |
| `fields`    | `[{ name, label, type: 'text' \| 'select', options?, default? }]`   |
| `handles`   | `[{ id, type: 'source' \| 'target', position }]`                    |
| `children`  | Custom content for nodes with special logic (e.g. Text)             |
| `className` | Per-category accent colour                                          |

`BaseNode` also seeds field state from saved data/defaults, syncs changes to the
Zustand store, spaces multiple handles evenly down a side, and calls
`updateNodeInternals` when the handle set changes so edges stay attached.

The four original nodes (**Input, Output, LLM, Text**) were rewritten on top of it.
A node like Input is now ~20 declarative lines with zero layout/styling/store
boilerplate.

**Five new nodes** demonstrate the abstraction across every shape:

| Node      | Handles                          | Demonstrates              |
|-----------|----------------------------------|---------------------------|
| Filter    | 1 in → 1 out                     | Simple pass-through        |
| Math      | 2 in (`a`, `b`) → 1 out          | Multiple inputs, one side  |
| API       | 1 in → 1 out                     | Mixed select + text fields |
| Condition | 1 in → 2 out (`true`/`false`)    | Multiple outputs           |
| Note      | none                             | Zero-handle / custom body  |

> Each handle maps to a meaningful data port: a `target` (left) is something the node
> consumes, a `source` (right) is something it produces. Counts follow the node's role
> (e.g. an LLM takes a system prompt + a prompt and returns one response → 3 handles).

Adding a node = one small file + a line in `toolbar.js` and `ui.js`.

## Part 2 — Styling

A single design system in **`src/index.css`** (prefixed `vs-*`), built on CSS custom
properties — no UI framework. The one deliberate idea is **per-category colour**: each
node type owns an accent that runs through its toolbar chip, header, and handles, so a
busy graph stays scannable. Includes focus rings, hover states, a dark top bar, and a
`prefers-reduced-motion` guard.

## Part 3 — Text Node Logic

Both behaviours live in **`src/nodes/textNode.js`**:

- **Dynamic sizing** — width tracks the longest line (clamped 220–460px) and height
  auto-grows by syncing the textarea to its `scrollHeight`.
- **Variables** — text is scanned with `/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g`
  (valid JS identifiers only). Each unique match becomes a left-side `target` handle,
  deduped via a `Set`, with chips listing the detected variables.

## Part 4 — Backend Integration

- **`src/submit.js`** POSTs `{ nodes, edges }` to `/pipelines/parse`, then shows a
  user-friendly `alert` with the node count, edge count, and DAG result (and a separate
  alert if the backend is unreachable).
- **`backend/main.py`** returns `{ num_nodes, num_edges, is_dag }`. The DAG check uses
  **Kahn's algorithm** (topological sort): if every node is visited, there is no cycle.
  CORS is enabled so the browser can call the API.

---

## Project structure

```
backend/
  main.py            # /pipelines/parse — counts + DAG check
  requirements.txt
frontend/src/
  nodes/
    BaseNode.js      # the shared abstraction (Part 1)
    inputNode.js  outputNode.js  llmNode.js  textNode.js   # originals, refactored
    filterNode.js mathNode.js apiNode.js conditionNode.js noteNode.js  # 5 new
  store.js           # Zustand store (nodes, edges, add/remove/update)
  ui.js              # React Flow canvas + nodeTypes registry
  toolbar.js         # draggable node palette
  submit.js          # POST to backend + result alert (Part 4)
  index.css          # design system (Part 2)
```
