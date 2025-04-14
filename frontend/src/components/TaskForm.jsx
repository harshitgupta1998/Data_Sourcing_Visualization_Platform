import { useState, useEffect } from "react";
import * as d3 from "d3";

const TaskForm = ({ onTaskCreated }) => {
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [platforms, setPlatforms] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [severityOptions, setSeverityOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [aJson, bCsvText] = await Promise.all([
        fetch("https://raw.githubusercontent.com/harshitgupta1998/Narravance/main/sourceA.json").then(res => res.json()),
        fetch("https://raw.githubusercontent.com/harshitgupta1998/Narravance/main/source_b.csv").then(res => res.text())
      ]);

      const bCsv = d3.csvParse(bCsvText);

      const normalizedA = aJson.map(d => ({
        platform: d.platform,
        severity_level: d.severity
      }));

      const normalizedB = bCsv.map(d => ({
        platform: d.channel,
        severity_level: d.severity_level
      }));

      const merged = [...normalizedA, ...normalizedB];

      const uniquePlatforms = [...new Set(merged.map(r => r.platform))];
      const uniqueSeverities = [...new Set(merged.map(r => r.severity_level))];

      setPlatformOptions(uniquePlatforms);
      setSeverityOptions(uniqueSeverities);

      // default selections
      setPlatforms(uniquePlatforms);
      setSeverityLevels(uniqueSeverities);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_date: startDate, end_date: endDate, severity_levels: severityLevels, platforms }),
    });
    const data = await res.json();
    onTaskCreated();
  };

  return (
<form onSubmit={handleSubmit} className="mb-6" >
  <h2 className="mb-4">Create New Task</h2>

  <div className="flex flex-wrap gap-6 items-center mb-4">
    <div className="flex items-center gap-2">
      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
    </div>

    <div className="flex items-center gap-2">
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
    </div>

    <div className="flex items-center gap-2">
      <label>Platforms:</label>
      <select
        multiple
        value={platforms}
        onChange={e => setPlatforms([...e.target.selectedOptions].map(o => o.value))}
      >
        {platformOptions.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>

    <div className="flex items-center gap-2">
      <label>Severity Levels:</label>
      <select
        multiple
        value={severityLevels}
        onChange={e => setSeverityLevels([...e.target.selectedOptions].map(o => o.value))}
      >
        {severityOptions.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  </div>

  <button type="submit">Create Task</button>
</form>
  );
};

export default TaskForm;
