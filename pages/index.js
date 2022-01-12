import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { format, parse } from "date-fns";
import { useGraphql } from "../components/utils/graphql";
import CasesByStatusChart from "../components/CasesByStatusChart";
import DateFilter from "../components/DateFilter";
import EvictLandlordTable from "../components/EvictionLandlordTable";
import Footer from "../components/Footer";
import Map from "../components/Map";
import MovingAvgChart from "../components/MovingAvgChart";
import Nav from "../components/Nav";
import {
  DEFAULT_START_DATE,
  STATUS_MAP,
  DATE_FORMAT,
  NUM_DAYS_MV_AVG,
} from "../components/settings";
import {
  CASES_BY_EVIC_DATE_QUERY,
  EVIC_BY_ZIP_DAY_QUERY,
  EVIC_BY_PLAINTIFF_QUERY,
  EVIC_BY_STATUS_BY_DAY_QUERY,
} from "../queries/queries";

const initializeDates = () => {
  return { start: DEFAULT_START_DATE, end: format(new Date(), DATE_FORMAT) };
};

const parseStatus = (status) => {
  // combine the many status into smaller categories
  let mappedStatus = STATUS_MAP?.[status.toLowerCase().trim()];
  return mappedStatus || "Unknown";
};

const groupStatuses = (data) => {
  // reduce to index of status: count
  let statusIndex = data.reduce((prev, curr) => {
    let status = curr.status;
    status = parseStatus(status);
    prev[status] = status in prev ? prev[status] : 0;
    prev[status] += curr.count;
    return prev;
  }, {});
  // convert to array of {name: <status>, count: <int>}
  let statusArr = [];
  Object.keys(statusIndex).map((status) => {
    statusArr.push({ name: status, count: statusIndex[status] });
  });
  return statusArr;
};

const offsetDates = (dates) => {
  /*
  Here's the challenge:
    - we want to smooth out cases/day because it's fairly sporadic
    - some days (weekends, mostly) have no cases
    Our MovingAvgChart will take care of creating a moving avg of cases/day,
    but we want the x domain of that chart to begin on start date provided
    via user input. So we need to calculate the rolling average of the
    start date, so we need fetch the previous <number days to avg> prior to
    the start date. but, since our data is not continuous (there are missing days)
    we don't know how many days before start date we need to fetch in order to
    have enough records to calculate the initial avg for the starting date.
    So the lazy way to do this is just multiply <number days to avg> times two
    and hope we get enough data.
    Good news—when we don't have enough data to calculate the moving avg of the
    start date, the chart will render nothing for those dates. it's nbd.

    all that to say we need to offset our query date *back in time* to try to 
    grab the extra data that goes into our moving avg.
  */
  let start = parse(dates.start, DATE_FORMAT, new Date());
  start = new Date(start.setDate(start.getDate() - NUM_DAYS_MV_AVG * 2));
  return { start: start, end: dates.end };
};

export default function Home() {
  const [dates, setDates] = useState(initializeDates());
  const {
    data: dataCases,
    error: errorCases,
    loading: loadingCases,
  } = useGraphql({
    query: CASES_BY_EVIC_DATE_QUERY,
    variables: offsetDates(dates),
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

  const {
    data: dataStatus,
    error: errorStatus,
    loading: loadingStatus,
  } = useGraphql({
    query: EVIC_BY_STATUS_BY_DAY_QUERY,
    variables: dates,
  });

  const data = {
    cases: dataCases?.evic_by_date || [],
    plaintiff: dataPlaint?.evict_by_plaintiff || [],
    zips: dataZips?.evic_by_zip_day || [],
    status: dataStatus?.evic_by_status_by_day || [],
  };

  return (
    <Container>
      <Nav />
      <Row className="mt-4">
        <Col>
          <h3 className="fw-bold">Travis County Evictions</h3>
        </Col>
      </Row>
      <Row className="mb-2 text-muted">
        <Col>
          <p>Tracking evictions in Austin, TX from public court records.</p>
        </Col>
      </Row>
      <DateFilter dates={dates} setDates={setDates} />
      <Row>
        <Col xs={12} md={6} className="mt-4">
          <Row>
            <Col>
              <h5>
                Daily filings <small>(avg)</small>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {loadingCases && <p>Loading...</p>}
              {!loadingCases && !errorCases && (
                <MovingAvgChart data={data.cases} startDate={dates.start}/>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} className="mt-4">
          <Row>
            <Col>
              <h5>Cases by status</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {loadingStatus && <p>Loading...</p>}
              {!loadingStatus && !errorStatus && (
                <CasesByStatusChart data={groupStatuses(data.status)} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} className="mt-4">
          <Row>
            <Col>
              <h5>Cases by landlord</h5>
            </Col>
          </Row>
          <Row>
            <Col style={{ height: 500, overflowX: "auto" }}>
              {loadingPlaint && <p>Loading...</p>}
              {!loadingPlaint && !errorPlaint && (
                <EvictLandlordTable data={data.plaintiff} />
              )}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="mt-4">
            <Col>
              <h5>Cases by zipcode</h5>
            </Col>
          </Row>
          <Row>
            <Col className="p-2">
              {loadingZips && <p>Loading...</p>}
              {!loadingZips && !errorZips && <Map data={data.zips} />}
            </Col>
          </Row>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
