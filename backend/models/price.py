import json

class Price:
    def __init__(self, bookmaker_key, bookmaker_title, last_updated, home_win_price, away_win_price, draw_price=0) -> None:
        self.bookmaker_key = bookmaker_key
        self.bookmaker_title = bookmaker_title
        self.last_updated = last_updated
        self.home_win_price = home_win_price
        self.away_win_price = away_win_price
        self.draw_price = draw_price

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)