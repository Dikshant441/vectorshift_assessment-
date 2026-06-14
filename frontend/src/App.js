import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './index.css';

function App() {
  return (
    <div className="vs-app">
      <header className="vs-topbar">
        <span className="vs-topbar__mark" />
        <span className="vs-topbar__title">Pipeline Builder</span>
      </header>

      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
