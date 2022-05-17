import json

class Trigger:
    def __init__(self, type, home_side, away_side, over_points = None, under_points = None, bet_one_dir: str = None, bet_two_dir: str = None) -> None:
        self.type = type
        self.home_side = home_side
        self.away_side = away_side
        self.over_points = over_points
        self.under_points = under_points
        self.bet_one_dir = bet_one_dir
        self.bet_two_dir = bet_two_dir
    
    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)