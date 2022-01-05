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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="">
        <p className="label">{`${new Date(label).toLocaleDateString()}`}</p>
        <p className="label">{Math.round(payload[0].value * 10) / 10}</p>
        {/* <p className="intro">{getIntroOfPage(label)}</p> */}
      </div>
    );
  }
  return null;
}

export default function MovingAvgChart({ data }) {
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
          // interval={parseInt(data.length / 5)}
          type="number"
        />
        <YAxis
          domain={[0, 4]}
        />
        {/* <YAxis yAxisId="right" orientation="right" domain={[0, 40]} /> */}
        <Tooltip content={<CustomTooltip/>}/>
        {/* <Bar yAxisId="right" dataKey="count" stroke="black" fill="black" /> */}
        <Line
          type="basis"
          dataKey="avg"
          stroke={CHART_STROKE_COLOR}
          strokeWidth="2"
          dot={false}
        />
        {/* <ReferenceLine
          label={
            <Label
              position="insideTopRight"
              value="Another event of import"
              fontSize={".7rem"}
            />
          }
          x={new Date("2021-05-01").getTime()}
          // label="Uno"
          stroke="#000"
          strokeDasharray="3 3"
        /> */}
        {/* <ReferenceLine
          x={new Date("2021-06-01").getTime()}
          label="5 months evict"
          stroke="#000"
          strokeDasharray="3 3"
        /> */}
{/* 
        <ReferenceLine
          x={new Date("2021-09-01").getTime()}
          label={
            <Label
              position="insideTopRight"
              value="Count relief ends"
              fontSize={".7rem"}
            />
          }
          stroke="#000"
          strokeDasharray="3 3"
        /> */}
        {/* 
        <ReferenceLine
          x={new Date("2021-12-06").getTime()}
          label="County relief ends"
          stroke="#000"
          strokeDasharray="3 3"
        /> */}
        {/* <Bar dataKey="count" fill="red" /> */}
        {/* <Bar dataKey="count" fill="blue" /> */}
        {/* <Bar dataKey="count" fill="black" /> */}
        {/* <Bar dataKey="count" fill="green" /> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
