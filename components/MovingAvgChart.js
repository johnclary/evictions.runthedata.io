import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  NUM_DAYS_MV_AVG,
  CHART_STROKE_COLOR,
  CHART_MIN_HEIGHT,
} from "./settings";

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

const useChartData = (inputData, startDate) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!inputData || inputData.length === 0) return;
    // clone data prop
    let data = [...inputData];
    // reverse the sort order to asc (our source view is newsest > oldest desc)
    data.sort(function (a, b) {
      if (a.filed_date < b.filed_date) return -1;
      return 1;
    });
    // calculate moving average (sets `avg` prop on each row)
    moveAvg(data, NUM_DAYS_MV_AVG);
    // remove the earliest records (less than num_days) which do not have a complete mv avg calc
    data = data.slice(NUM_DAYS_MV_AVG, data.length);
    // and now remove the records that fall outside our query range
    // because the data is not continuous (some days, e.g. weekends) are missing
    // we want the chart x domain to match the date filter (for UI consistency)
    data = data.filter((row) => row.filed_date >= startDate);
    // assign the numeric timestamp ms as a prop (makes recharts easier)
    data.forEach((row) => {
      row.timestamp = new Date(row.filed_date).getTime();
    });

    setChartData(data);
  }, [inputData, startDate]);
  return chartData;
};

export default function MovingAvgChart({ data, startDate }) {
  const chartData = useChartData(data, startDate);

  if (!chartData || chartData.length === 0)
    return (
      <p>
        <i>
          <small>No data</small>
        </i>
      </p>
    );

  return (
    <ResponsiveContainer width="100%" height={CHART_MIN_HEIGHT}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          scale="time"
          domain={["auto", "auto"]}
          dataKey="timestamp"
          tickFormatter={(v) => new Date(v).toLocaleDateString()}
          ticks={[
            new Date(chartData[0].filed_date),
            new Date(chartData[chartData.length - 1].filed_date),
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
          // animation is choppy w/ lots of records
          isAnimationActive={false}
          type="basis"
          dataKey="avg"
          stroke={CHART_STROKE_COLOR}
          strokeWidth="2"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
