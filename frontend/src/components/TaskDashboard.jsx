import { useEffect, useState } from "react";
import BarChartD3 from "./charts/BarChartD3";
import LineChartD3 from "./charts/LineChartD3";
import PieChartD3 from "./charts/PieChartD3";

const TaskDashboard = ({ taskId }) => {
  const [records, setRecords] = useState([]);
  const [yearFilter, setYearFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState([]);
  const [severityFilter, setSeverityFilter] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/tasks/${taskId}/records`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);

        // Extract unique values to set defaults
        const platforms = [...new Set(data.map(r => r.platform))];
        const severities = [...new Set(data.map(r => r.severity_level))];
        setPlatformFilter(platforms);
        setSeverityFilter(severities);
      });
  }, [taskId]);

  const filtered = records.filter((r) => {
    const yearMatch = yearFilter === "All" || r.date_detected.startsWith(yearFilter);
    const platformMatch = platformFilter.includes(r.platform);
    const severityMatch = severityFilter.includes(r.severity_level);
    return yearMatch && platformMatch && severityMatch;
  });

  const byCompany = {};
  const byDate = {};
  const bySeverity = {};

  filtered.forEach((r) => {
    const year = r.date_detected.slice(0, 4);
    byDate[year] = (byDate[year] || 0) + 1;
    byCompany[r.platform] = (byCompany[r.platform] || 0) + 1;
    bySeverity[r.severity_level] = (bySeverity[r.severity_level] || 0) + 1;
  });

  const barData = Object.entries(byCompany).map(([key, value]) => ({ key, value }));
  const lineData = Object.entries(byDate).map(([key, value]) => ({ key, value }));
  const pieData = Object.entries(bySeverity).map(([key, value]) => ({ key, value }));

  return (
    <div>
      <h2>📊 Dashboard for Task #{taskId}</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <label>
          Year:
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="All">All</option>
            {[...new Set(records.map(r => r.date_detected.slice(0, 4)))].map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>

        <label>
          Platforms:
          <select multiple value={platformFilter} onChange={e =>
            setPlatformFilter([...e.target.selectedOptions].map(o => o.value))
          }>
            {[...new Set(records.map(r => r.platform))].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label>
          Severity:
          <select multiple value={severityFilter} onChange={e =>
            setSeverityFilter([...e.target.selectedOptions].map(o => o.value))
          }>
            {[...new Set(records.map(r => r.severity_level))].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ maxWidth: "700px", marginTop: "30px" }}>
        <BarChartD3 data={barData} />
      </div>

      <div style={{ maxWidth: "700px", marginTop: "30px" }}>
        <LineChartD3 data={lineData} />
      </div>

      <div style={{ maxWidth: "400px", marginTop: "30px" }}>
        <PieChartD3 data={pieData} />
      </div>
    </div>
  );
};

export default TaskDashboard;
