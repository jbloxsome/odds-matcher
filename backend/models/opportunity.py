import json

class Opportunity:
    def __init__(self, home_win_bookmaker, home_win_bookmaker_key, home_win_price, away_win_bookmaker, away_win_bookmaker_key, away_win_price, draw_bookmaker, draw_bookmaker_key, draw_price, event, stake) -> None:
        self.home_win_bookmaker = home_win_bookmaker
        self.home_win_bookmaker_key = home_win_bookmaker_key
        self.home_win_price = home_win_price
        self.away_win_bookmaker = away_win_bookmaker
        self.away_win_bookmaker_key = away_win_bookmaker_key
        self.away_win_price = away_win_price
        self.draw_bookmaker = draw_bookmaker
        self.draw_bookmaker_key = draw_bookmaker_key
        self.draw_price = draw_price
        self.event = event
        self.stake = stake

    def compute_round(self):
        home_win_percent = 100 / self.home_win_price
        away_win_percent = 100 / self.away_win_price
        draw_win_percent = (100 / self.draw_price) if self.draw_price > 0 else 0
        self.round = home_win_percent + away_win_percent + draw_win_percent

    def compute_stakes(self):
        self.home_win_stake = ((100 / self.home_win_price) / self.round) * self.stake
        self.away_win_stake = ((100 / self.away_win_price) / self.round) * self.stake
        self.draw_stake = (((100 / self.draw_price) / self.round) * self.stake) if self.draw_price > 0 else 0
    
    def compute_returns(self):
        self.home_win_return = self.home_win_stake * self.home_win_price
        self.away_win_return = self.away_win_stake * self.away_win_price
        self.draw_return = self.draw_stake * self.draw_price

    def compute_profits(self):
        self.home_win_profit = self.home_win_return - self.stake
        self.away_win_profit = self.away_win_return - self.stake
        self.draw_profit = (self.draw_return - self.stake) if self.draw_price > 0 else 0

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)