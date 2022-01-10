import Link from "next/link";
import { Table } from "react-bootstrap";


export default function EvictLandlordTable({ data }) {
  if (!data || data?.length === 0) return <div>Loading...</div>;

  let totals = {};
  data = data.forEach((row) => {
    const p = row.party_one;
    totals[p] = totals[p] ? totals[p] : { name: p, count: 0 };
    totals[p].count += row.count;
  });

  let tableData = Object.keys(totals)
    .map((key) => totals[key])
    .filter((row) => row.name && row.count >= 0);

  tableData.sort(function (a, b) {
    if (a.count > b.count) return -1;
    return 1;
  });

  return (
    <Table size="sm">
      <thead>
        <tr>
          <th>Landlord</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.name}>
            <td>
              <Link href={`plaintiff/${encodeURIComponent(row.name)}`}>
                {row.name}
              </Link>
            </td>
            <td>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
