import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskSelector from "./components/TaskSelector";
import TaskDashboard from "./components/TaskDashboard";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  return (
    <div className="p-4">
      <h1>🧠 Threat Intelligence Dashboard</h1>
      <TaskForm onTaskCreated={() => setRefresh(prev => prev + 1)} />
      <TaskSelector onSelectTask={setSelectedTaskId} key={refresh} />
      {selectedTaskId && <TaskDashboard taskId={selectedTaskId} />}
    </div>
  );
}

export default App;
