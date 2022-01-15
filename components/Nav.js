import Link from "next/link";
import { Row } from "react-bootstrap";

export default function Nav() {
  return (
    <Row className="my-3">
      <div className="d-flex justify-content-end">
        <div className="me-3">
          <Link href="/">home</Link>
        </div>
        <div className="me-3">
          <a href="https://runthedata.io" target="_blank" rel="noreferrer">
            policing
          </a>
        </div>
        <div>
          <Link href="/about">about</Link>
        </div>
      </div>
    </Row>
  );
}
