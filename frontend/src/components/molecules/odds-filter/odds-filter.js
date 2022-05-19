import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function OddsFilter({ minOdds, maxOdds, maxSpread, setMinOdds, setMaxOdds, setMaxSpread }) {

    return (
        <div>
            <Row style={{'marginTop': '1rem'}}>
                <Col>
                    <Form.Label>Maximum Odds</Form.Label>
                    <Form.Range onChange={(e) => setMaxOdds(e.target.value)} value={maxOdds} min={-1000} max={1000} />
                    <p>+{maxOdds}</p>
                </Col>
            </Row>
            <Row style={{'marginTop': '1rem'}}>
                <Col>
                    <Form.Label>Minimum Odds</Form.Label>
                    <Form.Range onChange={(e) => setMinOdds(e.target.value)} value={minOdds} min={-1000} max={1000} />
                    <p>{minOdds}</p>
                </Col>
            </Row>
            <Row style={{'marginTop': '1rem'}}>
                <Col>
                    <Form.Label>Maximum Spread</Form.Label>
                    <Form.Range onChange={(e) => setMaxSpread(e.target.value)} value={maxSpread} min={0} max={40} />
                    <p>{maxSpread}</p>
                </Col>
            </Row>
        </div>
    )
}

export default OddsFilter;