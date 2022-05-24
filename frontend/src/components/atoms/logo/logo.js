import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Logo({ bookmaker_key }) {
    return (
        <Row style={{'height': '200px'}} className='align-items-center'>
            <Col>
                <img src={'/logos/' + bookmaker_key + '.jpg'} alt={bookmaker_key + ' logo'} width="100%" style={{ 'padding': '1rem' }}/>
            </Col>
        </Row>
    )
}

export default Logo;