import requests
import uvicorn
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Event, Price, Opportunity, Trigger

def get_sports(api_key):
    url = f'https://api.the-odds-api.com/v4/sports/?apiKey={api_key}'
    response = requests.get(url)
    return response.json()

def get_us_odds(api_key, region, sport, markets):
    url = f'https://api.the-odds-api.com/v4/sports/{sport}/odds/?regions={region}&markets={markets}&oddsFormat=decimal&apiKey={api_key}'
    response = requests.get(url)
    return response.json()

def dutch_calculator(event: Event, stake: float):
    opportunities = []

    # for a given event, compute dutching opportunities between any two bookmakers
    prices = event.prices

    for price in prices:
        
        bet_one_price = price.bet_one_price
        bet_one_bookmaker = price.bookmaker_title
        bet_one_bookmaker_key = price.bookmaker_key

        for _price in prices:
            bet_two_price = _price.bet_two_price
            bet_two_bookmaker = _price.bookmaker_title
            bet_two_bookmaker_key = _price.bookmaker_key

        opp = Opportunity(
            trigger=price.trigger,
            bet_one_bookmaker=bet_one_bookmaker,
            bet_one_bookmaker_key=bet_one_bookmaker_key,
            bet_one_price=bet_one_price,
            bet_two_bookmaker=bet_two_bookmaker,
            bet_two_bookmaker_key=bet_two_bookmaker_key,
            bet_two_price=bet_two_price,
            event=event,
            stake=stake
        )
        opp.compute_round()
        opp.compute_stakes()
        opp.compute_returns()
        opp.compute_profits()
        opportunities.append(opp)

    for price in prices:
        
        bet_two_price = price.bet_two_price
        bet_two_bookmaker = price.bookmaker_title
        bet_two_bookmaker_key = price.bookmaker_key

        for _price in prices:
            bet_one_price = _price.bet_one_price
            bet_one_bookmaker = _price.bookmaker_title
            bet_one_bookmaker_key = _price.bookmaker_key

        opp = Opportunity(
            trigger=price.trigger,
            bet_one_bookmaker=bet_one_bookmaker,
            bet_one_bookmaker_key=bet_one_bookmaker_key,
            bet_one_price=bet_one_price,
            bet_two_bookmaker=bet_two_bookmaker,
            bet_two_bookmaker_key=bet_two_bookmaker_key,
            bet_two_price=bet_two_price,
            event=event,
            stake=stake
        )
        opp.compute_round()
        opp.compute_stakes()
        opp.compute_returns()
        opp.compute_profits()
        opportunities.append(opp)

    return opportunities

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
async def health():
    return '{"healthy": "true"}'

@app.get("/api/sports")
async def sports():
    api_key = os.environ.get('THE_ODDS_API_KEY')
    return get_sports(api_key=api_key)

@app.get("/api/odds")
async def odds(
    sport: str = 'upcoming', 
    region: str = 'us', 
    stake: float = 100.00,
    bookmakers: str = 'betmgm,williamhill_us,draftkings,fanduel,unibet,pointsbetus,sugarhouse,twinspires,barstool,wynnbet,foxbet',
    markets: str = 'h2h,totals,spreads'
):
    api_key = os.environ.get('THE_ODDS_API_KEY')
    
    # fetch the latest odds
    odds = get_us_odds(api_key=api_key, sport=sport, region=region, markets=markets)

    opportunities = []

    # parse list of bookmakers
    bookmakers = bookmakers.split(',')

    for odd in odds:

        event = Event(odd['id'], odd['commence_time'], odd['sport_key'], odd['sport_title'], odd['home_team'], odd['away_team'])
        
        for bookmaker in odd['bookmakers']:

            if bookmaker['key'] in bookmakers:

                markets = [m for m in bookmaker['markets'] if m['key'] == 'h2h' or m['key'] == 'totals' or m['key'] == 'spreads']

                for market in markets:
                    
                    home_price = [p for p in market['outcomes'] if p['name'] == event.home_team]
                    away_price = [p for p in market['outcomes'] if p['name'] == event.away_team]
                    over_price = [p for p in market['outcomes'] if p['name'] == 'Over']
                    under_price = [p for p in market['outcomes'] if p['name'] == 'Under']

                    if market['key'] == 'h2h':
                        trigger = Trigger(
                            type='h2h', 
                            home_side=event.home_team, 
                            away_side=event.away_team,
                            bet_one_dir='Home Win',
                            bet_two_dir='Away Win'
                        )
                    elif market['key'] == 'totals':
                        trigger = Trigger(
                            type='totals', 
                            home_side=event.home_team, 
                            away_side=event.away_team, 
                            over_points=over_price[0]['point'], 
                            under_points=under_price[0]['point'],
                            bet_one_dir='Over ' + str(over_price[0]['point']),
                            bet_two_dir='Under ' + str(under_price[0]['point'])
                        )
                    else:
                        trigger = Trigger(
                            type='spreads', 
                            home_side=event.home_team, 
                            away_side=event.away_team, 
                            over_points=home_price[0]['point'], 
                            under_points=away_price[0]['point'],
                            bet_one_dir=event.home_team + ' ' + str(home_price[0]['point']),
                            bet_two_dir=event.away_team + ' ' + str(home_price[0]['point'])
                        )

                    price = Price(
                        bookmaker_key=bookmaker['key'],
                        bookmaker_title=bookmaker['title'], 
                        last_updated=bookmaker['last_update'],
                        trigger=trigger,
                        bet_one_price=home_price[0]['price'] if market['key'] == 'h2h' or market['key'] == 'spreads' else over_price[0]['price'],
                        bet_two_price=away_price[0]['price'] if market['key'] == 'h2h' or market['key'] == 'spreads' else under_price[0]['price']
                    )

                    event.addPrice(price)

        opps = dutch_calculator(event, stake)
        
        for opp in opps:
            opportunities.append(opp)

    opportunities.sort(key = lambda x: x.round)

    return opportunities

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)