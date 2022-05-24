import json

class Price:
    def __init__(
        self,
        id: str,
        sportsbook_name: str,
        name: str,
        price: float,
        checked_date: str,
        bet_points: float,
        market_name: str,
        deep_link_url: str
    ) -> None:
        self.id = id
        self.sportsbook_name = sportsbook_name
        self.name = name
        self.price = price
        self.checked_date = checked_date
        self.bet_points = bet_points
        self.market_name = market_name
        self.deep_link_url = deep_link_url

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)