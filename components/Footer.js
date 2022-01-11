import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Footer(props) {
  return (
    <Row>
      <Col>
        <p className="text-center">
          Created by John Clary (
          <a
            href="https://github.com/johnclary/"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          ,{" "}
          <a
            href="https://twitter.com/spatialaustin"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          ) | Copyright (C) 2022 |{" "}
          <a
            href="https://github.com/johnclary/evictions-app/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            MIT License
          </a>
        </p>
      </Col>
    </Row>
  );
}
