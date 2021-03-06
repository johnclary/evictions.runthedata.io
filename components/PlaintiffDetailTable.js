import { Table } from "react-bootstrap";

export default function PlaintiffDetailTable({ data }) {
  if (!data) {
    return null;
  }

  return (
    <Table size="sm">
      <thead>
        <tr>
          <th>Filed Date</th>
          <th>Zipcode</th>
          <th>Precinct</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id}>
            <td>{new Date(row.filed_date).toLocaleDateString()}</td>
            <td>{row.defendant_zip}</td>
            <td>{row.precinct}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
