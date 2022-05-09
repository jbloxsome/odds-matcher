import requests
import uvicorn
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Event, Price, Opportunity

def get_sports(api_key):
    url = f'https://api.the-odds-api.com/v4/sports/?apiKey={api_key}'
    response = requests.get(url)
    return response.json()

def get_us_odds(api_key, region, sport):
    url = f'https://api.the-odds-api.com/v4/sports/{sport}/odds/?regions={region}&markets=h2h&oddsFormat=decimal&apiKey={api_key}'
    response = requests.get(url)
    return response.json()

def dutch_calculator(event, stake):
    opportunities = []

    # for a given event, compute dutching opportunities between any two bookmakers
    prices = event.prices

    for price in prices:
        home_price = price.home_win_price
        home_bookmaker = price.bookmaker_title
        home_bookmaker_key = price.bookmaker_key

        for _price in prices:
            away_price = _price.away_win_price
            away_bookmaker = _price.bookmaker_title
            away_bookmaker_key = _price.bookmaker_key

            for __price in prices:
                draw_price = __price.draw_price
                draw_bookmaker = __price.bookmaker_title
                draw_bookmaker_key = __price.bookmaker_key

        opp = Opportunity(home_bookmaker, home_bookmaker_key, home_price, away_bookmaker, away_bookmaker_key, away_price, draw_bookmaker, draw_bookmaker_key, draw_price, event, stake)
        opp.compute_round()
        opp.compute_stakes()
        opp.compute_returns()
        opp.compute_profits()
        opportunities.append(opp)

    for price in prices:
        away_price = price.away_win_price
        away_bookmaker = price.bookmaker_title
        away_bookmaker_key = price.bookmaker_key

        for _price in prices:
            home_price = _price.home_win_price
            home_bookmaker = _price.bookmaker_title
            home_bookmaker_key = _price.bookmaker_key

            for __price in prices:
                draw_price = __price.draw_price
                draw_bookmaker = __price.bookmaker_title
                draw_bookmaker_key = __price.bookmaker_key

        opp = Opportunity(home_bookmaker, home_bookmaker_key, home_price, away_bookmaker, away_bookmaker_key, away_price, draw_bookmaker, draw_bookmaker_key, draw_price, event, stake)
        opp.compute_round()
        opp.compute_stakes()
        opp.compute_returns()
        opp.compute_profits()
        opportunities.append(opp)
    
    for price in prices:
        draw_price = price.draw_price
        draw_bookmaker = price.bookmaker_title
        draw_bookmaker_key = price.bookmaker_key

        for _price in prices:
            home_price = _price.home_win_price
            home_bookmaker = _price.bookmaker_title
            home_bookmaker_key = _price.bookmaker_key

            for __price in prices:
                away_price = __price.away_win_price
                away_bookmaker = __price.bookmaker_title
                away_bookmaker_key = __price.bookmaker_key

        opp = Opportunity(home_bookmaker, home_bookmaker_key, home_price, away_bookmaker, away_bookmaker_key, away_price, draw_bookmaker, draw_bookmaker_key, draw_price, event, stake)
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

@app.get("/sports")
async def sports():
    api_key = os.environ.get('THE_ODDS_API_KEY')
    return get_sports(api_key=api_key)

@app.get("/odds")
async def odds(sport: str = 'upcoming', region: str = 'us', stake: float = 100.00):
    api_key = os.environ.get('THE_ODDS_API_KEY')
    
    # fetch the latest odds
    odds = get_us_odds(api_key=api_key, sport=sport, region=region)

    opportunities = []

    for odd in odds:
        event = Event(odd['id'], odd['commence_time'], odd['sport_key'], odd['sport_title'], odd['home_team'], odd['away_team'])
        
        for bookmaker in odd['bookmakers']:
            market = [m for m in bookmaker['markets'] if m['key'] == 'h2h'][0]
            home_price = [p for p in market['outcomes'] if p['name'] == event.home_team][0]
            away_price = [p for p in market['outcomes'] if p['name'] == event.away_team][0]

            # in events where there cant be a draw the price is just 0 for a draw
            try:
                draw_price = [p for p in market['outcomes'] if p['name'] == 'Draw'][0]
            except:
                draw_price = {'price': 0}

            price = Price(bookmaker['key'], bookmaker['title'], bookmaker['last_update'], home_price['price'], away_price['price'], draw_price['price'])
            event.addPrice(price)

        opps = dutch_calculator(event, stake)
        
        for opp in opps:
            opportunities.append(opp)

    opportunities.sort(key = lambda x: x.round)

    return opportunities

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)