import json

from .trigger import Trigger
from .event import Event

class Opportunity:
    def __init__(
        self,
        trigger: Trigger,
        bet_one_bookmaker: str, 
        bet_one_bookmaker_key: str, 
        bet_one_price: float, 
        bet_two_bookmaker: str, 
        bet_two_bookmaker_key: str, 
        bet_two_price: float, 
        event: Event, 
        stake: float
    ) -> None:
        self.trigger = trigger
        self.bet_one_bookmaker = bet_one_bookmaker
        self.bet_one_bookmaker_key = bet_one_bookmaker_key
        self.bet_one_price = bet_one_price
        self.bet_two_bookmaker = bet_two_bookmaker
        self.bet_two_bookmaker_key = bet_two_bookmaker_key
        self.bet_two_price = bet_two_price
        self.event = event
        self.stake = stake
        self.round = 0

    def compute_round(self):
        bet_one_percent = 100 / self.bet_one_price
        bet_two_percent = 100 / self.bet_two_price
        self.round = bet_one_percent + bet_two_percent

    def compute_stakes(self):
        self.bet_one_stake = ((100 / self.bet_one_price) / self.round) * self.stake
        self.bet_two_stake = ((100 / self.bet_two_price) / self.round) * self.stake
    
    def compute_returns(self):
        self.bet_one_return = self.bet_one_stake * self.bet_one_price
        self.bet_two_return = self.bet_two_stake * self.bet_two_price

    def compute_profits(self):
        self.bet_one_profit = self.bet_one_return - self.stake
        self.bet_two_profit = self.bet_two_return - self.stake

    def toJson(self):
        return json.dumps(self, default = lambda o: o.__dict__, sort_keys = True, indent = 4)