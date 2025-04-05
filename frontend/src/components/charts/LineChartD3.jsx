import { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChartD3 = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    const years = data.map(d => d.key);
    const values = data.map(d => d.value);

    const x = d3.scalePoint()
      .domain(years)
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(values)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#007bff")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div>
      <h3>Line Chart: Records by Year</h3>
      <svg ref={ref}></svg>
    </div>
  );
};

export default LineChartD3;
