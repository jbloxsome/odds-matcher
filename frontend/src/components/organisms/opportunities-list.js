import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import Opportunity from '../molecules/opportunity';

function OpportunitiesList() {

    const [sports, setSports] = useState({ isLoading: true, items: [], error: null });
    const [sport, setSport] = useState('baseball_mlb');
    const [region, setRegion] = useState('us');
    const [opportunities, setOpportunities] = useState({ isLoading: true, items: [], error: null });

    useEffect(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + '/api/sports')
            .then(resp => resp.json())
            .then(
                (result) => {

                    const sports = result.filter(i => i.key.includes('basketball') || i.key.includes('hockey') || i.key.includes('baseball'))

                    setSports({
                        isLoading: false,
                        items: sports,
                        error: null
                    });
                },
                (error) => {
                    setSports({
                        isLoading: false,
                        items: [],
                        error: error
                    })
                }
            )
    }, []);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_ENDPOINT + '/api/odds?sport=' + sport + '&region=' + region)
            .then(resp => resp.json())
            .then(
                (result) => {
                    setOpportunities({
                        isLoading: false,
                        items: result,
                        error: null
                    });
                },
                (error) => {
                    setOpportunities({
                        isLoading: false,
                        items: [],
                        error: error
                    })
                }
            )
    }, [sport, region]);

    return(
        <Container fluid>
            <Row>
                <Col xs={6}>
                    <FloatingLabel controlId='floatingSelect' label='Select sport'>
                        <Form.Select onChange={e => setSport(e.target.value)} aria-label='Select sport'>
                            {sports.items.map((s, i) => {
                                return <option value={s.key} key={i}>{s.description}</option>
                            })}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={6}>
                    <FloatingLabel controlId='floatingSelect' label='Select region'>
                        <Form.Select onChange={e => setRegion(e.target.value)} aria-label='Select region'>
                            <option value='us'>United States + Canada</option>
                            <option value='uk'>United Kingdom</option>
                            <option value='eu'>Europe</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
        <Row>
            <Col>
                {opportunities.items.length > 0 && opportunities.items.map((o, i) => {
                    return (
                        <Row key={i}>
                            <Col>
                                <Opportunity opportunity={o} />
                            </Col>
                        </Row>
                    )
                })}
                {opportunities.items.length === 0 && 
                    <Row style={{'padding-top': '1rem'}}>
                        <Col>
                            <p>Sorry, no odds were found for this market.</p>
                        </Col>
                    </Row>
                }
            </Col>
        </Row>
        </Container>
    )
}

export default OpportunitiesList;