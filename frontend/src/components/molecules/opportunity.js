import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './opportunity.css';

function Opportunity({ opportunity }) {
    return(
        <Card>
            <Card.Body>
                <Row>
                    <Col xs={2}>
                        <h5>Competition</h5>
                        <p>{opportunity.event.sport_title}</p>
                    </Col>
                    <Col xs={4}>
                        <h5>Event</h5>
                        <p>{opportunity.event.home_team} vs {opportunity.event.away_team}</p>
                    </Col>
                    <Col xs={2}>
                        <h5>Bet 1</h5>
                        <h6>Home Win - {opportunity.home_win_bookmaker}</h6>
                        <p>Decimal Odds: {opportunity.home_win_price}</p>
                        <p>Stake: £{opportunity.home_win_stake.toFixed(2)}</p>
                        <p>Profit: £{opportunity.home_win_profit.toFixed(2)}</p>
                    </Col>
                    <Col xs={2}>
                        <h5>Bet 2</h5>
                        <h6>Draw - {opportunity.draw_bookmaker}</h6>
                        <p>Decimal Odds: {opportunity.draw_price}</p>
                        <p>Stake: £{opportunity.draw_stake.toFixed(2)}</p>
                        <p>Profit: £{opportunity.draw_profit.toFixed(2)}</p>
                    </Col>
                    <Col xs={2}>
                        <h5>Bet 3</h5>
                        <h6>Away Win - {opportunity.away_win_bookmaker}</h6>
                        <p>Decimal Odds: {opportunity.away_win_price}</p>
                        <p>Stake: £{opportunity.away_win_stake.toFixed(2)}</p>
                        <p>Profit: £{opportunity.away_win_profit.toFixed(2)}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Opportunity;