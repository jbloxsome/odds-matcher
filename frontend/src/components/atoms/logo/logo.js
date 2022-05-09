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
    'lowvig': '/logos/lowvig.jpg',
    'mybookieag': '/logos/mybookieag.jpg',
    'pointsbetus': '/logos/pointsbetus.jpg',
    'sugarhouse': '/logos/sugarhouse.png',
    'twinspires': '/logos/twinspires.png',
    'unibet': '/logos/unibet.jpg',
    'williamhill_us': '/logos/williamhill_us.jpg',
    'wynnbet': '/logos/wynnbet.jpg'
}

function Logo({ bookmaker_key }) {
    console.log(bookmaker_key);
    return <img src={bookmakers[bookmaker_key]} alt={bookmaker_key + ' logo'} width='200px' />
}

export default Logo;