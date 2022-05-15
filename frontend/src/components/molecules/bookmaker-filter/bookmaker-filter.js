import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function BookmakerFilter({ availableBookmakers, bookmakerToggle }) {
    return (
        <Row style={{'margin-top': '1rem'}}>
            <Col>
                <Form.Label htmlFor="bookmakers">Select Bookmakers</Form.Label>
                <Form id='bookmakers'>
                    {availableBookmakers.map((bookmaker) => {
                        return (
                            <div key={bookmaker.key}>
                                <Form.Check
                                    type='checkbox'
                                    id={bookmaker.key}
                                    label={bookmaker.name}
                                    defaultChecked={true}
                                    onChange={(e) => bookmakerToggle(e.target.id)}
                                />
                            </div>
                        )
                    })}
                </Form>
            </Col>
        </Row>
    )
}

export default BookmakerFilter;