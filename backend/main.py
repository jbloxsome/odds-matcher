import requests
import time

from models import Event, Price

def get_us_odds(api_key):
    url = f'https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=us&markets=h2h&oddsFormat=decimal&apiKey={api_key}'
    response = requests.get(url)
    return response.json()


with open('api_key', 'r') as file:
    api_key = file.read().rstrip()
    
    while True:
        # fetch the latest odds
        odds = get_us_odds(api_key=api_key)

        for odd in odds:
            event = Event(odd['id'], odd['sport_key'], odd['sport_title'], odd['home_team'], odd['away_team'])
            
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

            print(event.toJson())

        # sleep for 1 hour
        time.sleep(3600)