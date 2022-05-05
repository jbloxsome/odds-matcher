import json

class Opportunity:
    def __init__(self, home_win_bookmaker, home_win_price, away_win_bookmaker, away_win_price, draw_bookmaker, draw_price) -> None:
        self.home_win_bookmaker = home_win_bookmaker
        self.home_win_price = home_win_price
        self.away_win_bookmaker = away_win_bookmaker
        self.away_win_price = away_win_price
        self.draw_bookmaker = draw_bookmaker
        self.draw_price = draw_price
        self.round = self.compute_round()

    def compute_round(self):
        home_win_percent = 100 / self.home_win_price
        away_win_percent = 100 / self.away_win_price
        draw_win_percent = (100 / self.draw_price) if self.draw_price > 0 else 0
        return home_win_percent + away_win_percent + draw_win_percent

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)