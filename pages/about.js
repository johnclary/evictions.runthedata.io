import { Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const DOWNLOAD_URLS = {
  evictions:
    "https://travis-county-evictions.s3.us-east-2.amazonaws.com/evictions.csv",
};

export default function About() {
  return (
    <Container>
      <Nav />
      <Row>
        <Col>
          <h1 className="fw-bold">About</h1>
          <p>
            Eviction case records are collected from the Travis County Justice
            of the Peace{" "}
            <a
              href="https://odysseypa.traviscountytx.gov/JPPublicAccess/default.aspx"
              target="_blank"
              rel="noreferrer"
            >
              public records search
            </a>
            .
          </p>
          <p>
            <a href={DOWNLOAD_URLS.evictions} target="_blank" rel="noreferrer">
              Download a CSV
            </a>{" "}
            of the data that powers this website (~5mb).
          </p>
          <p>
            The source code for this website is available{" "}
            <a
              href="https://github.com/johnclary/evictions-app"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
