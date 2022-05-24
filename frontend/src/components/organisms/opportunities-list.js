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

const bookmakers = [
    {
        name: 'Borgata',
        key: 'Borgata'
    },
    {
        name: 'Golden Nugget',
        key: 'Golden Nugget'
    },
    {
        name: 'SuperBook',
        key: 'SuperBook'
    },
    {
        name: 'The Score',
        key: 'theScore'
    },
    {
        name: 'BetRivers',
        key: 'BetRivers'
    },
    {
        name: 'Caesars',
        key: 'Caesars'
    },
    {
        name: 'Sports Interaction',
        key: 'Sports Interaction'
    },
    {
        name: '888Sport',
        key: '888sport'
    },
    {
        name: 'LeoVegas',
        key: 'LeoVegas'
    },
    {
        name: 'Betfred',
        key: 'Betfred'
    },
    {
        name: 'Betway',
        key: 'Betway'
    },
    {
        name: 'Bet365',
        key: 'bet365'
    },
    {
        name: 'Unibet',
        key: 'unibet'
    },
    {
        name: 'BetMGM',
        key: 'BetMGM'
    },
    {
        name: 'William Hill',
        key: 'William Hill'
    },
    {
        name: 'DraftKings',
        key: 'DraftKings'
    },
    {
        name: 'FanDuel',
        key: 'FanDuel'
    },
    {
        name: 'FOX Bet',
        key: 'FOX bet'
    },
    {
        name: 'PointsBet',
        key: 'PointsBet'
    },
    {
        name: 'SugarHouse',
        key: 'SugarHouse'
    },
    {
        name: 'TwinSpires',
        key: 'TwinSpires'
    },
    {
        name: 'Barstool',
        key: 'Barstool'
    },
    {
        name: 'WynnBET',
        key: 'WynnBET'
    }
]

const markets = [
    {
        name: 'Moneyline',
        key: 'Moneyline'
    },
    {
        name: 'Total Points',
        key: 'Total Points'
    },
    {
        name: 'Point Spread',
        key: 'Point Spread'
    }
];

const sports = [
    {
        name: 'Basketball',
        key: 'basketball'
    },
    {
        name: 'Baseball',
        key: 'baseball',
    },
    {
        name: 'Hockey',
        key: 'hockey'
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
    const [sport, setSport] = useState('basketball');
    const [market, setMarket] = useState('Moneyline');
    const [opportunities, setOpportunities] = useState({ isLoading: true, items: [], error: null });
    const [selectedBookmakers, setSelectedBookmakers] = useState({ selected: [...bookmakers] });
    const [maxOdds, setMaxOdds] = useState(1000);
    const [minOdds, setMinOdds] = useState(0)
    const [maxSpread, setMaxSpread] = useState(1000);


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

        fetch(process.env.REACT_APP_API_ENDPOINT + '/api/odds?sport=' + sport + '&bookmakers=' + bookmakersString + '&market=' + market)
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
    }, [sport, market, selectedBookmakers]);

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
                                    {sports.map((s, i) => {
                                        return <option value={s.key} key={i}>{s.name}</option>
                                    })}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col xs={6}>
                            <FloatingLabel controlId='floatingSelect' label='Select market'>
                                <Form.Select onChange={e => setMarket(e.target.value)} aria-label='Select market'>
                                    {markets.map((m, i) => {
                                        return <option value={m.key} key={i}>{m.name}</option>
                                    })}
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