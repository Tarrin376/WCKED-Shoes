from db.Schema import BoughtTogether

class PNode:
  def __init__(self, edge: BoughtTogether):
    self.edge = edge

  def __lt__(self, other):
    return self.edge.frequency < other.edge.frequency