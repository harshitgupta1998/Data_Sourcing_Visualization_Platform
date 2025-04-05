import { useEffect, useState } from "react";

const TaskList = ({ refreshFlag, onSelectTask }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/tasks/")
      .then(res => res.json())
      .then(setTasks);
  }, [refreshFlag]);



const deleteTask = async (taskId) => {
  if (!window.confirm(`Are you sure you want to delete Task #${taskId}?`)) return;

  const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
    method: "DELETE"
  });

  if (res.ok) {
    setTasks(prev => prev.filter(t => t.task_id !== taskId));
  } else {
    alert("Failed to delete task.");
  }
};


return (
  <div>
    <h2>All Tasks</h2>
    <ul>
      {tasks.map(task => (
        <li key={task.task_id}>
          <strong>ID {task.task_id}</strong> - {task.status} - {task.record_count} records
          <div style={{ marginTop: "5px" }}>
            <button onClick={() => onSelectTask(task.task_id)} style={{ marginRight: "10px" }}>
              View
            </button>
            <button onClick={() => deleteTask(task.task_id)} style={{ backgroundColor: "#dc3545", color: "white" }}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
};

export default TaskList;
