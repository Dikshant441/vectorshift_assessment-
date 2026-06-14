import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const BACKEND_URL = 'http://localhost:8000/pipelines/parse';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const { num_nodes, num_edges, is_dag } = await response.json();

      alert(
        'Pipeline parsed\n\n' +
          `Nodes: ${num_nodes}\n` +
          `Edges: ${num_edges}\n` +
          `Valid DAG (no cycles): ${is_dag ? 'Yes' : 'No'}`
      );
    } catch (error) {
      alert(
        'Could not reach the backend.\n\n' +
          `${error.message}\n\n` +
          'Make sure it is running:  uvicorn main:app --reload'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vs-submit">
      <button
        className="vs-submit__btn"
        type="button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Parsing…' : 'Submit Pipeline'}
      </button>
    </div>
  );
};
