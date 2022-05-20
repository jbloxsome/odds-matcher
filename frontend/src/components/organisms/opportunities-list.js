import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';

import Opportunity from '../molecules/opportunity';
import BookmakerFilter from '../molecules/bookmaker-filter/bookmaker-filter';
import OddsFilter from '../molecules/odds-filter/odds-filter';
import MarketsFilter from '../molecules/markets-filter/markets-filter';

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

const markets = [
    {
        name: 'Head to Head',
        key: 'h2h'
    },
    {
        name: 'Totals',
        key: 'totals'
    },
    {
        name: 'Spreads',
        key: 'spreads'
    }
];

function american(decimal) {
    if (decimal >= 2) {
        return {value: Math.ceil((decimal - 1) * 100), sign: 1}
    } else {
        return {value: (-1 * Math.ceil(-100 / (decimal - 1))), sign: -1}
    }
}

function OpportunitiesList() {

    const [sports, setSports] = useState({ isLoading: true, items: [], error: null });
    const [sport, setSport] = useState('basketball_nba');
    const [region, setRegion] = useState('us');
    const [opportunities, setOpportunities] = useState({ isLoading: true, items: [], error: null });
    const [selectedBookmakers, setSelectedBookmakers] = useState({ selected: [...bookmakers] });
    const [selectedMarkets, setSelectedMarkets] = useState({ selected: [...markets ]});
    const [maxOdds, setMaxOdds] = useState(1000);
    const [minOdds, setMinOdds] = useState(200)
    const [maxSpread, setMaxSpread] = useState(400);

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

        setOpportunities({
            isLoading: true,
            items: [],
            error: null
        });

        let bookmakersString = '';

        selectedBookmakers.selected.forEach(b => {
            bookmakersString = bookmakersString + b.key + ',';
        });

        bookmakersString = bookmakersString.substring(0, bookmakersString.length - 1);

        let marketsString = '';

        selectedMarkets.selected.forEach(m => {
            marketsString = marketsString + m.key + ',';
        });

        marketsString = marketsString.substring(0, marketsString.length - 1);

        fetch(process.env.REACT_APP_API_ENDPOINT + '/api/odds?sport=' + sport + '&region=' + region + '&bookmakers=' + bookmakersString + '&markets=' + marketsString)
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
    }, [sport, region, selectedBookmakers, selectedMarkets]);

    const bookmakerToggle = ((key) => {
        const bookmaker = bookmakers.filter(b => b.key === key)[0];
        let selected = selectedBookmakers.selected;
        const index = selected.indexOf(bookmaker)

        if (index > -1) {
            selected.splice(index, 1);
        } else {
            selected.push(bookmaker);
        }

        setSelectedBookmakers({
            selected: selected
        });
    });

    const marketToggle = ((key) => {
        const market = markets.filter(m => m.key === key)[0];
        let selected = selectedMarkets.selected;
        const index = selected.indexOf(market);
        
        if (index > -1) {
            selected.splice(index, 1);
        } else {
            selected.push(market);
        }

        setSelectedMarkets({
            selected: selected
        });
    });

    const checkFilters = ((o) => {

        const bet_one = american(o['bet_one_price']);
        const bet_two = american(o['bet_two_price']);

        const spread = Math.abs(bet_one.value - bet_two.value);

        if (spread > maxSpread) {
            return false;
        }

        const biggest = Math.max(bet_one.value, bet_two.value)

        if (biggest > maxOdds) {
            return false;
        }

        if (biggest < minOdds) {
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
                                <Form.Select onChange={e => setSport(e.target.value)} aria-label='Select sport' value={sport}>
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
                            <MarketsFilter markets={markets} marketToggle={marketToggle} />
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
                    {!opportunities.isLoading && 
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
                    }
                    {opportunities.isLoading &&
                        <Row className='align-items-center' style={{ height: '90vh' }}>
                            <Col md={{ span: 2, offset: 6}}>
                                <Spinner animation='border' />
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
            
        </Container>
    )
}

export default OpportunitiesList;