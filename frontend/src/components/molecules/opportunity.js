import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Moment from 'react-moment';

import Logo from '../atoms/logo/logo';

import './opportunity.css';

function american(decimal) {
    if (decimal >= 2) {
        return '+' + Math.ceil((decimal - 1) * 100).toString()
    } else {
        return '-' + (-1 * Math.ceil(-100 / (decimal - 1))).toString()
    }
}

function Opportunity({ opportunity }) {
    return(
        <Card>
            <Card.Body>
                <Row>
                     <Col xs={2}>
                        <h5>Time</h5>
                        <p><Moment format='MM/DD/YYYY HH:mm'>{opportunity.event.time}</Moment></p>
                    </Col>
                    <Col xs={2}>
                        <h5>Competition</h5>
                        <p>{opportunity.event.sport_title}</p>
                    </Col>
                    <Col xs={2}>
                        <h5>Event</h5>
                        <p>{opportunity.event.home_team} vs {opportunity.event.away_team}</p>
                    </Col>
                    <Col xs={2}>
                        <h5>Bet 1</h5>
                        <Logo bookmaker_key={opportunity.home_win_bookmaker_key} />
                        <h6>Home Win - {opportunity.home_win_bookmaker}</h6>
                        <p>Odds: {american(opportunity.home_win_price)}</p>
                        <p>Stake: £{opportunity.home_win_stake.toFixed(2)}</p>
                        <p>Profit: £{opportunity.home_win_profit.toFixed(2)}</p>
                    </Col>
                    {opportunity.draw_price > 0 &&
                        <Col xs={2}>
                            <h5>Bet 2</h5>
                            <Logo bookmaker_key={opportunity.draw_bookmaker_key} />
                            <h6>Draw - {opportunity.draw_bookmaker}</h6>
                            <p>Odds: {american(opportunity.draw_price)}</p>
                            <p>Stake: £{opportunity.draw_stake.toFixed(2)}</p>
                            <p>Profit: £{opportunity.draw_profit.toFixed(2)}</p>
                        </Col>
                    }
                    <Col xs={2}>
                        {opportunity.draw_price > 0 &&
                            <h5>Bet 3</h5>
                        }
                        {opportunity.draw_price <= 0 &&
                            <h5>Bet 2</h5>
                        }
                        <Logo bookmaker_key={opportunity.away_win_bookmaker_key} />
                        <h6>Away Win - {opportunity.away_win_bookmaker}</h6>
                        <p>Odds: {american(opportunity.away_win_price)}</p>
                        <p>Stake: £{opportunity.away_win_stake.toFixed(2)}</p>
                        <p>Profit: £{opportunity.away_win_profit.toFixed(2)}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Opportunity;