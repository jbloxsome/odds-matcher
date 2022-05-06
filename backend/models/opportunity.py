import json

class Opportunity:
    def __init__(self, home_win_bookmaker, home_win_price, away_win_bookmaker, away_win_price, draw_bookmaker, draw_price) -> None:
        self.home_win_bookmaker = home_win_bookmaker
        self.home_win_price = home_win_price
        self.away_win_bookmaker = away_win_bookmaker
        self.away_win_price = away_win_price
        self.draw_bookmaker = draw_bookmaker
        self.draw_price = draw_price

    def compute_round(self):
        home_win_percent = 100 / self.home_win_price
        away_win_percent = 100 / self.away_win_price
        draw_win_percent = (100 / self.draw_price) if self.draw_price > 0 else 0
        self.round = home_win_percent + away_win_percent + draw_win_percent

    def compute_stakes(self):
        self.home_win_stake = ((100 / self.home_win_price) / self.round) * 100
        self.away_win_stake = ((100 / self.away_win_price) / self.round) * 100
        self.draw_stake = (((100 / self.draw_price) / self.round) * 100) if self.draw_price > 0 else 0
    
    def compute_returns(self):
        self.home_win_return = self.home_win_stake * self.home_win_price
        self.away_win_return = self.away_win_stake * self.away_win_price
        self.draw_return = self.draw_stake * self.draw_price

    def compute_profits(self):
        self.home_win_profit = self.home_win_return - 100
        self.away_win_profit = self.away_win_return - 100
        self.draw_profit = self.draw_return - 100

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)