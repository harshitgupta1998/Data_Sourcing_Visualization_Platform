import { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChartD3 = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeSet2);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d.data.key);
  }, [data]);

  return (
    <div>
      <h3>Pie Chart: Severity Levels</h3>
      <svg ref={ref}></svg>
    </div>
  );
};

export default PieChartD3;
