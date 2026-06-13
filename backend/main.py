from collections import defaultdict, deque
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow the React dev server (and anything else, for the assessment) to call us.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# We only need a few fields from each node/edge. Pydantic ignores the rest
# (position, data, sourceHandle, etc.) so the frontend can send full objects.
class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """A graph is a DAG if a topological sort can include every node.

    Uses Kahn's algorithm: repeatedly remove nodes with no incoming edges.
    If we manage to remove all of them, there is no cycle -> it is a DAG.
    """
    indegree = {node.id: 0 for node in nodes}
    adjacency = defaultdict(list)

    for edge in edges:
        # Ignore edges that point to/from unknown nodes.
        if edge.source in indegree and edge.target in indegree:
            adjacency[edge.source].append(edge.target)
            indegree[edge.target] += 1

    queue = deque([node_id for node_id, deg in indegree.items() if deg == 0])
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    # If every node was visited, no cycle remained.
    return visited_count == len(nodes)


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": check_is_dag(pipeline.nodes, pipeline.edges),
    }
