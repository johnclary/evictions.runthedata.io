import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function DateFilter({ dates, setDates }) {
  // form state, but not updating parent state (until submit)
  const [formDates, setFormDates] = useState({ ...dates });

  // capture initial dates for reset button
  const [initialDates, setInitialDates] = useState({ ...dates });

  const handleSubmit = (e) => {
    // update parent dates state
    e.preventDefault();
    setDates(formDates);
  };

  const handleReset = (e) => {
    // update parent dates state
    e.preventDefault();
    setFormDates(initialDates);
    setDates(initialDates);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col xs="auto">
          <span className="me-2">From</span>
          <input
            onChange={(e) =>
              setFormDates({ ...formDates, start: e.target.value })
            }
            type="date"
            value={formDates.start}
          />
          <span className="mx-2">to</span>
          <input
            onChange={(e) =>
              setFormDates({ ...formDates, end: e.target.value })
            }
            type="date"
            value={formDates.end}
          />
        </Col>
        <Col>
          <button className="me-2" role="submit">
            Update
          </button>
          <button role="reset" onClick={handleReset}>
            Reset
          </button>
        </Col>
      </Row>
    </form>
  );
}
