import { Row, Col, Table } from "react-bootstrap";

const EvicPlaint = ({ data }) => {
  if (!data || data?.length === 0) return <div>Loading or error...</div>;

  let bob = {};
  data = data.forEach((row) => {
    const p = row.party_one;
    bob[p] = bob[p] ? bob[p] : { name: p, count: 0 };
    bob[p].count += row.count;
  });

  let thedata = Object.keys(bob)
    .map((key) => bob[key])
    .filter((row) => row.name && row.count >= 0);

  thedata.sort(function (a, b) {
    if (a.count > b.count) return -1;
    return 1;
  });

  return (
    <Table size="sm">
      <tbody>
        {thedata.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default function EvictLandlordTable({ data }) {
  if (!data) {
    return null;
  }
  return (
    <>
      <Table size="sm">
        <thead>
          <tr>
            <th>Landlord</th>
            <th>Count</th>
          </tr>
        </thead>
      </Table>
      <div
        style={{
          maxHeight: "500px",
          overflow: "auto",
          display: "inline-block",
        }}
      >
        <EvicPlaint data={data} />
      </div>
    </>
  );
}
