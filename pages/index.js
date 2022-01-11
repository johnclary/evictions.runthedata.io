import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { useGraphql } from "../components/utils/graphql";
import DateFilter from "../components/dateFilter";
import EvictLandlordTable from "../components/EvictionLandlordTable";
import Footer from "../components/Footer";
import Map from "../components/Map";
import MovingAvgChart from "../components/MovingAvgChart";
import Nav from "../components/Nav";
import { DEFAULT_START_DATE } from "../components/settings";
import {
  CASES_BY_EVIC_DATE_QUERY,
  EVIC_BY_ZIP_DAY_QUERY,
  EVIC_BY_PLAINTIFF_QUERY,
} from "../queries/queries";

const initializeDates = () => {
  return { start: DEFAULT_START_DATE, end: format(new Date(), "yyyy-MM-dd") };
};

export default function Home() {
  const [dates, setDates] = useState(initializeDates());
  const {
    data: dataCases,
    error: errorCases,
    loading: loadingCases,
  } = useGraphql({
    query: CASES_BY_EVIC_DATE_QUERY,
    variables: dates,
  });

  const {
    data: dataZips,
    error: errorZips,
    loading: loadingZips,
  } = useGraphql({ query: EVIC_BY_ZIP_DAY_QUERY, variables: dates });

  const {
    data: dataPlaint,
    error: errorPlaint,
    loading: loadingPlaint,
  } = useGraphql({
    query: EVIC_BY_PLAINTIFF_QUERY,
    variables: dates,
  });

  const data = {
    cases: dataCases?.evic_by_date || [],
    plaintiff: dataPlaint?.evict_by_plaintiff || [],
    zips: dataZips?.evic_by_zip_day || [],
  };

  return (
    <Container>
      <Nav />
      <Row className="mt-4">
        <Col>
          <h1 className="fw-bold">Travis County Evictions</h1>
        </Col>
      </Row>
      <Row className="mb-2 text-muted">
        <Col>
          <p>Tracking evictions in Austin, TX from public court records.</p>
        </Col>
      </Row>
      <DateFilter dates={dates} setDates={setDates} />
      <Row className="mt-4">
        <Col xs={12} md={6}>
          <Row>
            <Col>
              <h5>
                Daily filings <small>(avg)</small>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col style={{ minHeight: 450 }}>
              {loadingCases && <p>Loading...</p>}
              {!loadingCases && !errorCases && (
                <MovingAvgChart data={data.cases} />
              )}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <h5>Cases by zipcode</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {loadingZips && <p>Loading...</p>}
              {!loadingZips && !errorZips && <Map data={data.zips} />}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h5>Cases by landlord</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          {loadingPlaint && <p>Loading...</p>}
          {!loadingPlaint && !errorPlaint && (
            <EvictLandlordTable data={data.plaintiff} />
          )}
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
