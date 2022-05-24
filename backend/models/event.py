import json

class Event:
    def __init__(self, id, time, sport, league, home_team, away_team) -> None:
        self.id = id
        self.time = time
        self.sport = sport
        self.league = league
        self.home_team = home_team
        self.away_team = away_team
        self.prices = []
    
    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)

    def addPrice(self, price):
        self.prices.append(price)