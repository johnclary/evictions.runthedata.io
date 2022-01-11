import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { NUM_DAYS_MV_AVG, CHART_STROKE_COLOR } from "./settings";

const moveAvg = (data, num_days) => {
  let i = 0;
  let sum = 0;
  for (let n = Math.min(num_days - 1, data.length); i < n; ++i) {
    sum += data[i].count;
  }
  for (let n = data.length; i < n; ++i) {
    sum += data[i].count;
    data[i].avg = sum / num_days;
    sum -= data[i - num_days + 1].count;
  }
  return data;
};

const tooltipValueFormatter = (value, name, props) => [
  "",
  Math.round(value * 10) / 10,
];

const tooltipLabelFormatter = (d) => {
  return new Date(d).toLocaleDateString();
};

export default function MovingAvgChart({ data }) {
  if (!data || data?.length === 0)
    return (
      <p>
        <i>
          <small>No data</small>
        </i>
      </p>
    );

  data.sort(function (a, b) {
    if (a.filed_date < b.filed_date) return -1;
    return 1;
  });

  data.forEach((row) => {
    row.filed_date = new Date(row.filed_date).getTime();
  });

  data = moveAvg(data, NUM_DAYS_MV_AVG);
  data = data.slice(NUM_DAYS_MV_AVG, data.length);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart width="100%" height="300%" data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          scale="time"
          domain={["auto", "auto"]}
          dataKey="filed_date"
          tickFormatter={(v) => new Date(v).toLocaleDateString()}
          ticks={[
            new Date(data[0].filed_date),
            new Date(data[data.length - 1].filed_date),
          ]}
          type="number"
        />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip
          formatter={tooltipValueFormatter}
          labelFormatter={tooltipLabelFormatter}
          separator=""
        />

        <Line
          type="basis"
          dataKey="avg"
          stroke={CHART_STROKE_COLOR}
          strokeWidth="2"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
