import { useRouter } from "next/router";
import { Row, Col } from "react-bootstrap";

export default function Nav({ backButton }) {
  const router = useRouter();
  return (
    <Row className="mb-3">
      <div
        className={`d-flex ${
          backButton ? "justify-content-between" : "justify-content-end"
        }`}
      >
        {backButton && (
          <div className="text-reset" onClick={() => router.back()}>
            <a href="#">{`< back`}</a>
          </div>
        )}
        <div className="text-reset">about</div>
      </div>
    </Row>
  );
}
