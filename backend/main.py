import requests
import uvicorn
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Event, Price, Opportunity

def american_to_decimal(american):
    if american > 0:
        return 1 + (american / 100)
    else:
        return 1 - (100 / (-1 * american))

def get_sports(api_key):
    url = f'https://api.the-odds-api.com/v4/sports/?apiKey={api_key}'
    response = requests.get(url)
    return response.json()

def get_odds_from_oddsjam(api_key, sport, sportsbooks, market):
    sportsbooks = sportsbooks.split(',')

    url = f'https://api-external.oddsjam.com/api/v2/game-odds?key={api_key}&sport={sport}&market_name={market}'

    for sportsbook in sportsbooks:
        url = url + '&sportsbook=' + sportsbook

    response = requests.get(url)
    return response.json()

def evaluate_opportunity(bet_one, bet_two, event, stake):
    # Takes two bets and computes the potential opportunity - i.e what would happen if you placed both bets (regardless of the actual outcome
    # of the underlying event.)

    if bet_one.price > 2 or bet_two.price > 2:

        bet_one_name = f'{bet_one.name}'
        bet_two_name = f'{bet_two.name}'
    
        # market type needs to be the same otherwise the bets aren't opposing.
        if (bet_one.market_name == bet_two.market_name):

            valid = True

            bet_one_price = bet_one.price
            bet_one_bookmaker = bet_one.sportsbook_name

            bet_two_price = bet_two.price
            bet_two_bookmaker = bet_two.sportsbook_name

            # Moneyline bets are bets for home win or away win. The bet is only valid if bet one is for home win and bet two is for away win or vice versa.
            if bet_one.market_name == 'Moneyline':
                if bet_one.name == bet_two.name:
                    valid = False

            # For spreads bets we need to ensure that the over/under values are opposite for each bet i.e if bet_one is for the home team to win by over 1.5 goals
            # then bet_two needs to be for the home team to not win by over 1.5 goals to have a valid opportunity.
            if bet_one.market_name == 'Point Spread':

                bet_one_tokens = bet_one.name.split(' ')
                bet_one_team = ' '.join(bet_one_tokens[:-1])
                bet_one_handicap = float(bet_one_tokens[-1])

                bet_two_tokens = bet_two.name.split(' ')
                bet_two_team = ' '.join(bet_two_tokens[:-1])
                bet_two_handicap = float(bet_two_tokens[-1])

                if bet_one_team == bet_two_team:
                    valid = False

                if bet_one_handicap != -1 * bet_two_handicap:
                    valid = False

                bet_one_name = f'{bet_one_team} {bet_one_handicap}'
                bet_two_name = f'{bet_two_team} {bet_two_handicap}'

            # Similar to spreads bets in that we need to ensure that we're evaluating two opposing bets here, totals is slightly different to spreads however.
            # If bet_one is for over 1.5 goals, then bet_two would have to be for under 1.5 goals.
            if bet_one.market_name == 'Total Points':

                bet_one_tokens = bet_one.name.split(' ')
                bet_one_over_under = ' '.join(bet_one_tokens[:-1])
                bet_one_total = bet_one_tokens[-1]

                bet_two_tokens = bet_two.name.split(' ')
                bet_two_over_under = ' '.join(bet_two_tokens[:-1])
                bet_two_total = bet_two_tokens[-1]

                # Not valid if bet one and bet two are both the same direction i.e they're both 'Over' or both 'Under'
                if (bet_one_over_under == bet_two_over_under):
                    valid = False

                # Not valid if bet one and bet two don't have the same total
                if (bet_one_total != bet_two_total):
                    valid = False

                bet_one_name = f'{bet_one_over_under} {bet_one_total}'
                bet_two_name = f'{bet_two_over_under} {bet_two_total}'

            # We could evaluate opposing bets for the same bookmaker, but it's not worth returning them as an opportunity because the bookmaker will likely
            # always ensure that their book is over round.
            if bet_one_bookmaker == bet_two_bookmaker:
                valid = False
            
            # Once we've verified that we're evaluating two opposing bets, we can compute the opportunity.
            if valid == True:

                event.prices = []

                opp = Opportunity(
                    market=bet_one.market_name,
                    bet_one_bookmaker=bet_one_bookmaker,
                    bet_one_name=bet_one_name,
                    bet_one_price=bet_one_price,
                    bet_two_bookmaker=bet_two_bookmaker,
                    bet_two_name=bet_two_name,
                    bet_two_price=bet_two_price,
                    event=event,
                    stake=stake
                )

                opp.compute_round()
                opp.compute_stakes()
                opp.compute_returns()
                opp.compute_profits()

                return opp

def dutch_calculator(event: Event, stake: float):
    # For a given event, compute all of the dutching opportunities.
    prices = event.prices

    return [evaluate_opportunity(price, _price, event, stake) for price in prices for _price in prices]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Health check endpoint - this is useful when deploying in GKE cluster as the readiness probe will query this endpoint and expect
# a 200 response if all is ok.
@app.get("/")
async def health():
    return '{"healthy": "true"}'

# Returns a list of matched opportunities.
@app.get("/api/odds")
async def odds(
    sport: str = 'basketball',
    stake: float = 100.00,
    bookmakers: str = 'Borgata,Golden Nugget,SuperBook,theScore,BetRivers,Caesars,Sports Interaction,888sport,LeoVegas,Betfred,Betway,bet365,unibet,BetMGM,William Hill,DraftKings,FanDuel,FOX bet,PointsBet,SugarHouse,TwinSpires,Barstool,WynnBET',
    market: str = 'Total Points'
):
    api_key = os.environ.get('ODDSJAM_API_KEY')
    
    # fetch the latest odds
    events = get_odds_from_oddsjam(api_key=api_key, sport=sport, sportsbooks=bookmakers, market=market)['data']

    opportunities = []
    
    # loop through all of the returned odds and create an Event object for each event, Event objects store the odds from each bookmaker
    # for the given event.
    for e in events:

        event = Event(
            id = e['id'],
            time = e['start_date'],
            sport = e['sport'],
            league = e['league'],
            home_team = e['home_team'],
            away_team = e['away_team']
        )
        
        prices = [Price(
                    id = o['id'],
                    sportsbook_name = o['sports_book_name'],
                    name = o['name'],
                    price = american_to_decimal(o['price']),
                    checked_date = o['checked_date'],
                    bet_points = o['bet_points'],
                    market_name = o['market_name'],
                    deep_link_url = o['deep_link_url']
                ) for o in e['odds']]

        event.prices = prices

        # Calculate all dutching opportunities for the event
        opps = dutch_calculator(event, stake)

        # Some opportunities will be invalid, the dutching calculator currently places a None entry
        # in the list for these. This line removed those values.
        opps = [o for o in opps if o is not None]

        opportunities = opportunities + opps

    # Sort by round to return the most profitable opportunities first
    opportunities.sort(key = lambda x: x.round)

    return opportunities

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)