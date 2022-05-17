import json

from .trigger import Trigger

class Price:
    def __init__(
        self,
        bookmaker_key: str, 
        bookmaker_title: str,
        last_updated: str, 
        trigger: Trigger, 
        bet_one_price: float, 
        bet_two_price: float,
    ) -> None:
        self.bookmaker_key = bookmaker_key
        self.bookmaker_title = bookmaker_title
        self.last_updated = last_updated
        self.trigger = trigger
        self.bet_one_price = bet_one_price
        self.bet_two_price = bet_two_price

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)