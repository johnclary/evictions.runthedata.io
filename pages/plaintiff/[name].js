import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { useGraphql } from "../../components/utils/graphql";
import PlaintiffDetailTable from "../../components/plaintiffDetailTable";
import CasesByStatusChart from "../../components/casesByStatusChart";
import Nav from "../../components/Nav";

import { PLAINTIFF_DETAIL_QUERY } from "../../queries/queries";

const getPlaintiffInfo = (data) => {
  return data.find(
    (row) => row.plaintiff_city && row.plaintiff_state && row.plaintiff_zip
  );
};

const getStats = (data) => {
  let statusIndex = {};
  let stats = [];
  data.forEach((row) => {
    const status = row.status;
    statusIndex[status] = statusIndex?.[status] ? statusIndex[status] : 0;
    statusIndex[status]++;
  });
  Object.keys(statusIndex).map((status) => {
    stats.push({ name: status, count: statusIndex[status] });
  });
  return stats;
};

export default function Home() {
  const router = useRouter();
  const name = router?.query?.name;
  const { data, error, loading } = useGraphql({
    query: name ? PLAINTIFF_DETAIL_QUERY : null,
    variables: name ? { name: decodeURIComponent(name) } : null,
  });

  if (loading)
    return (
      <Container>
        <Row className="mt-5 text-center">
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      </Container>
    );

  const info = getPlaintiffInfo(data?.cases || []);
  const stats = getStats(data?.cases || []);
  return (
    <Container>
      <Nav backButton />
      {data?.cases?.length === 0 && (
        <Row>
          <Col>
            <p>{`No data found for '${decodeURIComponent(name)}'`}</p>
          </Col>
        </Row>
      )}
      {data?.cases?.length > 0 && (
        <>
          <Row>
            <Col>
              <span>
                <small>Landlord</small>
              </span>
            </Col>
          </Row>

          <Row>
            <Col>
              <Row>
                <Col>
                  <h2 className="fw-bold">{decodeURIComponent(name)}</h2>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  Doing business from{" "}
                  {`${info?.plaintiff_city}, ${info?.plaintiff_state} ${info?.plaintiff_zip}`}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={8} md={6}>
              <CasesByStatusChart data={stats} />
            </Col>
          </Row>
          <Row className="pt-3">
            <Col>
              <h5 className="fw-bold">Evictions filed</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <PlaintiffDetailTable data={data?.cases} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
