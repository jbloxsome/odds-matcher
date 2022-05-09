const bookmakers = {
    'barstool': '/logos/barstool.png',
    'betonlineag': '/logos/betonlineag.png',
    'betfair': '/logos/betfair.jpg',
    'betmgm': '/logos/betmgm.png',
    'betrivers': '/logos/betrivers.png',
    'betus': '/logos/betus.png',
    'bovada': '/logos/bovada.png',
    'draftkings': '/logos/draftkings.png',
    'fanduel': '/logos/fanduel.png',
    'foxbet': '/logos/foxbet.png',
    'gtbets': '/logos/gtbets.png',
    'intertops': '/logos/intertops.png',
    'lowvig': '/logos/lowvig.png',
    'mybookieag': '/logos/mybookieag.jpg',
    'pointsbetus': '/logos/pointsbetus.jpg',
    'sugarhouse': '/logos/sugarhouse.png',
    'twinspires': '/logos/twinspires.png',
    'unibet': '/logos/unibet.jpg',
    'williamhill_us': '/logos/williamhill_us.jpg',
    'williamhill': '/logos/williamhill_us.jpg',
    'wynnbet': '/logos/wynnbet.jpg',
    'sport888': '/logos/sport888.png',
    'betfred': '/logos/betfred.png',
    'betvictor': '/logos/betvictor.jpg',
    'matchbook': '/logos/matchbook.png',
    'ladbrokes': '/logos/ladbrokes.png',
    'boylesports': '/logos/boylesports.png',
    'coral': '/logos/coral.png',
    'pinnacle': '/logos/pinnacle.jpg',
    'betclic': '/logos/betclic.png',
    'marathonbet': '/logos/marathonbet.jpg',
    'casumo': '/logos/casumo.png',
    'leovegas': '/logos/leovegas.png',
    'skybet': '/logos/skybet.png',
    'virginbet': '/logos/virginbet.png',
    'paddypower': '/logos/paddypower.png',
    'nordicbet': '/logos/nordicbet.png',
    'livescorebet': '/logos/livescorebet.png'
}

function Logo({ bookmaker_key }) {
    return <img src={bookmakers[bookmaker_key]} alt={bookmaker_key + ' logo'} height='75px' style={{padding: '0.5rem'}} />
}

export default Logo;