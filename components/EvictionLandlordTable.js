import Link from "next/link";
import { Table } from "react-bootstrap";

const ROW_LIMIT = 50;

export default function EvictLandlordTable({ data }) {
  if (!data || data?.length === 0)
    return (
      <p>
        <i>
          <small>No data</small>
        </i>
      </p>
    );
  let totals = {};
  data.forEach((row) => {
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

  let rowsNotRenderedCount = 0;
  if (tableData.length > ROW_LIMIT) {
    rowsNotRenderedCount = tableData.length - ROW_LIMIT;
    tableData = tableData.slice(0, ROW_LIMIT);
  }

  return (
    <Table size="sm" hover>
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
        {rowsNotRenderedCount > 0 && (
          <tr>
            <td colSpan="2">
              <small>{`${rowsNotRenderedCount} additional rows not displayed`}</small>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
