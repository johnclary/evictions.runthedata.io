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
              href="https://github.com/johnclary/evictions.runthedata.io"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <h2 className="fw-bold">Get involved</h2>
          <p>
            Vote for{" "}
            <a
              href="https://www.hairstonforpeace.com/"
              target="_blank"
              rel="noreferrer"
            >
              Andrew Hairston
            </a>{" "}
            for Justice of the Peace.
          </p>
          <p>
            Vote for{" "}
            <a
              href="https://www.bobforcommish.com/"
              target="_blank"
              rel="noreferrer"
            >
              Bob Libal
            </a>{" "}
            for Travis County Commissioner .
          </p>
          <p>
            Support{" "}
            <a
              href="https://www.bastaaustin.org/"
              target="_blank"
              rel="noreferrer"
            >
              Building and Strengthening Tenant Action (BASTA)
            </a>
            .
          </p>
          <p>
            Join the{" "}
            <a
              href="https://www.austindsa.org/"
              target="_blank"
              rel="noreferrer"
            >
              Austin Democratic Socialists of America
            </a>
            .
          </p>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
