import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { CHART_STROKE_COLOR } from "./settings";
const CasesByStatusChart = ({ data }) => {
  return (
    <ResponsiveContainer width={"100%"} height={250}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey="count" />
        <Tooltip />
        <Bar maxBarSize={30} key={"name"} dataKey={"count"} fill={CHART_STROKE_COLOR} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CasesByStatusChart;
