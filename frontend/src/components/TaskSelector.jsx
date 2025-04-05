import { useEffect, useState } from "react";

const TaskSelector = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/tasks/")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const handleView = () => {
    if (selectedTaskId) {
      onSelectTask(selectedTaskId);
    }
  };

  const handleDelete = async () => {
    if (!selectedTaskId) return;
    const confirm = window.confirm(`Are you sure you want to delete Task #${selectedTaskId}?`);
    if (!confirm) return;

    const res = await fetch(`http://localhost:8000/tasks/${selectedTaskId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setTasks(prev => prev.filter(t => t.task_id !== selectedTaskId));
      setSelectedTaskId(null);
      onSelectTask(null); // clear dashboard view
    } else {
      alert("Failed to delete task.");
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Select a Task</h3>
      <select
        value={selectedTaskId || ""}
        onChange={(e) => setSelectedTaskId(Number(e.target.value))}
      >
        <option value="">-- Select a Task --</option>
        {tasks.map(task => (
          <option key={task.task_id} value={task.task_id}>
            Task #{task.task_id} - {task.status} ({task.record_count} records)
          </option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleView} disabled={!selectedTaskId} style={{ marginRight: "10px" }}>
          View
        </button>
        <button onClick={handleDelete} disabled={!selectedTaskId} style={{ backgroundColor: "#dc3545", color: "white" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskSelector;
