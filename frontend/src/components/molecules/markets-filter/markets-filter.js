import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function MarketsFilter({ markets, marketToggle}) {
    return (
        <Row style={{'margin-top': '1rem'}}>
            <Col>
                <Form.Label htmlFor="markets">Select Markets</Form.Label>
                <Form id='markets'>
                    {markets.map((market) => {
                        return (
                            <div key={market.key}>
                                <Form.Check
                                    type='checkbox'
                                    id={market.key}
                                    label={market.name}
                                    defaultChecked={true}
                                    onChange={(e) => marketToggle(e.target.id)}
                                />
                            </div>
                        )
                    })}
                </Form>
            </Col>
        </Row>
    )
}

export default MarketsFilter;