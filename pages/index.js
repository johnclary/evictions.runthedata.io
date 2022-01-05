import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Map from "../components/map";
import { useGraphql } from "../components/utils/graphql";
import Nav from "../components/Nav";
import MovingAvgChart from "../components/movingAvgChart";
import EvictLandlordTable from "../components/evictionLandlordTable";
import {
  CASES_BY_EVIC_DATE_QUERY,
  EVIC_BY_ZIP_DAY_QUERY,
  EVIC_BY_PLAINTIFF_QUERY,
} from "../queries/queries";

export default function Home() {
  const [dateFilter, setDateFilter] = useState("2021-01-01");
  const { data, error, loading } = useGraphql({
    query: CASES_BY_EVIC_DATE_QUERY,
  });

  const {
    data: dataZips,
    error: errorZips,
    loading: loadingZips,
  } = useGraphql({ query: EVIC_BY_ZIP_DAY_QUERY });

  const {
    data: dataPlaint,
    error: errorPlaint,
    loading: loadingPlaint,
  } = useGraphql({
    query: EVIC_BY_PLAINTIFF_QUERY,
    variables: { filed_date: "2020-05-01" },
  });

  if (!data || data?.length === 0 || error || loading)
    return <div>Loading or error...</div>;

  return (
    <Container>
      <Nav />
      <Row className="mt-4">
        <Col>
          <h1 className="fw-bold">Travis County Evictions</h1>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <input
            onChange={(e) => setDateFilter(e.target.value)}
            type="date"
            defaultValue={dateFilter}
          />
          <button>set date</button>
        </Col>
      </Row> */}
      <Row>
        <Col xs={12} md={6}>
          <Row>
            <Col>
              <h5>Daily filings (90-day moving avg)</h5>
            </Col>
          </Row>
          <Row>
            <Col style={{ minHeight: 450 }}>
              <MovingAvgChart data={data["evic_by_date"]} />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <h5>Filings by zipcode</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {dataZips?.evic_by_zip_day && (
                <Map data={dataZips.evic_by_zip_day} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4>Evictions filed - last 12 months</h4>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <EvictLandlordTable data={dataPlaint?.evict_by_plaintiff} />
        </Col>
      </Row>
    </Container>
  );
}
