import BarChartD3 from "./charts/BarChartD3";
import LineChartD3 from "./charts/LineChartD3";
import PieChartD3 from "./charts/PieChartD3";

const PreviewDashboard = ({ records }) => {
  const byPlatform = {};
  const byYear = {};
  const bySeverity = {};

  records.forEach((r) => {
    const year = r.date_detected.slice(0, 4);
    byYear[year] = (byYear[year] || 0) + 1;
    byPlatform[r.platform] = (byPlatform[r.platform] || 0) + 1;
    bySeverity[r.severity_level] = (bySeverity[r.severity_level] || 0) + 1;
  });

  const barData = Object.entries(byPlatform).map(([key, value]) => ({ key, value }));
  const lineData = Object.entries(byYear).map(([key, value]) => ({ key, value }));
  const pieData = Object.entries(bySeverity).map(([key, value]) => ({ key, value }));

  return (
    <div>
      <h3>📊 Preview Data Visualizations</h3>

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

export default PreviewDashboard;
