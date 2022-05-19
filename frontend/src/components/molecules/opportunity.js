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
                     <Col xs={4} md={2}>
                        <h6>Time</h6>
                        <p><Moment format='MM/DD/YYYY HH:mm'>{opportunity.event.time}</Moment></p>
                    </Col>
                    <Col xs={4} md={2}>
                        <h6>Competition</h6>
                        <p>{opportunity.event.sport_title}</p>
                    </Col>
                    <Col xs={4} md={2}>
                        <h6>Event</h6>
                        <p>{opportunity.event.home_team} vs {opportunity.event.away_team}</p>
                    </Col>
                    <Col xs={4} md={2}>
                        <h6>Market</h6>
                        <p>{opportunity.trigger.type}</p>
                    </Col>
                    <Col xs={4} md={2}>
                        <h6>Bet 1</h6>
                        <Logo bookmaker_key={opportunity.bet_one_bookmaker_key} />
                        <h6>{opportunity.trigger.bet_one_dir} : {opportunity.bet_one_bookmaker}</h6>
                        <p>Odds: {american(opportunity.bet_one_price)}</p>
                        <p>Stake: ${opportunity.bet_one_stake.toFixed(2)}</p>
                        <p>Profit: ${opportunity.bet_one_profit.toFixed(2)}</p>
                    </Col>
                    <Col xs={4} md={2}>
                        <h6>Bet 2</h6>
                        <Logo bookmaker_key={opportunity.bet_two_bookmaker_key} />
                        <h6>{opportunity.trigger.bet_two_dir} : {opportunity.bet_two_bookmaker}</h6>
                        <p>Odds: {american(opportunity.bet_two_price)}</p>
                        <p>Stake: ${opportunity.bet_two_stake.toFixed(2)}</p>
                        <p>Profit: ${opportunity.bet_two_profit.toFixed(2)}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Opportunity;