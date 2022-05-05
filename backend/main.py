import requests
import time

def get_us_odds(api_key):
    url = f'https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=us&markets=h2h&oddsFormat=decimal&apiKey={api_key}'


with open('api_key', 'r') as file:
    api_key = file.read().rstrip()
    
    while True:
        # fetch the latest odds
        odds = get_us_odds(api_key=api_key)

        # sleep for 1 hour
        time.sleep(3600)