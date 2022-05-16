import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import Opportunity from '../molecules/opportunity';
import BookmakerFilter from '../molecules/bookmaker-filter/bookmaker-filter';
import OddsFilter from '../molecules/odds-filter/odds-filter';

const bookmakers = [
    {
        name: 'BetMGM',
        key: 'betmgm'
    },
    {
        name: 'William Hill',
        key: 'williamhill_us'
    },
    {
        name: 'DraftKings',
        key: 'draftkings'
    },
    {
        name: 'FanDuel',
        key: 'fanduel'
    },
    {
        name: 'Unibet',
        key: 'unibet'
    },
    {
        name: 'PointsBet',
        key: 'pointsbetus'
    },
    {
        name: 'SugarHouse',
        key: 'sugarhouse'
    },
    {
        name: 'TwinSpires',
        key: 'twinspires'
    },
    {
        name: 'Barstool Sports',
        key: 'barstool'
    },
    {
        name: 'Wynnbet',
        key: 'wynnbet'
    },
    {
        name: 'FoxBET',
        key: 'foxbet'
    }
]

function american(decimal) {
    if (decimal >= 2) {
        return {value: Math.ceil((decimal - 1) * 100), sign: 1}
    } else {
        return {value: (-1 * Math.ceil(-100 / (decimal - 1))), sign: -1}
    }
}

function OpportunitiesList() {

    const [sports, setSports] = useState({ isLoading: true, items: [], error: null });
    const [sport, setSport] = useState('baseball_mlb');
    const [region, setRegion] = useState('us');
    const [opportunities, setOpportunities] = useState({ isLoading: true, items: [], error: null });
    const [selectedBookmakers, setSelectedBookmakers] = useState({ selected: [...bookmakers] });
    const [maxOdds, setMaxOdds] = useState(200);
    const [minOdds, setMinOdds] = useState(-200)
    const [maxSpread, setMaxSpread] = useState(20);

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
        let bookmakersString = '';

        selectedBookmakers.selected.forEach(b => {
            bookmakersString = bookmakersString + b.key + ',';
        });

        fetch(process.env.REACT_APP_API_ENDPOINT + '/api/odds?sport=' + sport + '&region=' + region + '&bookmakers=' + bookmakersString)
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
    }, [sport, region, selectedBookmakers]);

    const bookmakerToggle = ((key) => {
        const bookmaker = bookmakers.filter(b => b.key === key)[0];
        let selected = selectedBookmakers.selected;
        const index = selectedBookmakers.selected.indexOf(bookmaker);
        
        if (index > -1) {
            selected.splice(index, 1);
        } else {
            selected.push(bookmaker);
        }

        setSelectedBookmakers({
            selected: selected
        });
    });

    const checkFilters = ((o) => {

        const bet_one = american(o['home_win_price']);
        const bet_two = american(o['away_win_price']);

        const spread = Math.abs(bet_one.value - bet_two.value);

        if (spread > maxSpread) {
            return false;
        }

        if (bet_one.value > maxOdds || bet_two.value > maxOdds) {
            return false;
        }

        if (bet_one.value * bet_one.sign < minOdds || bet_two.value * bet_two.sign < minOdds) {
            return false;
        }

        return true
    })

    return(
        <Container fluid>
            <Row>
                <Col xs={12} md={3}>
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
                            <BookmakerFilter availableBookmakers={bookmakers} bookmakerToggle={bookmakerToggle} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <OddsFilter minOdds={minOdds} maxOdds={maxOdds} maxSpread={maxSpread} setMinOdds={setMinOdds} setMaxOdds={setMaxOdds} setMaxSpread={setMaxSpread} />
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={9}>
                    <Row>
                        <Col>
                            {opportunities.items.length > 0 && opportunities.items.map((o, i) => {
                                if (checkFilters(o)) {
                                    return (
                                        <Row key={i}>
                                            <Col>
                                                <Opportunity opportunity={o} />
                                            </Col>
                                        </Row>
                                    )
                                } else {
                                    return (<></>)
                                }
                            })}
                            {opportunities.items.length === 0 && 
                                <Row style={{'paddingTop': '1rem'}}>
                                    <Col>
                                        <p>Sorry, no odds were found for this market.</p>
                                    </Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        </Container>
    )
}

export default OpportunitiesList;