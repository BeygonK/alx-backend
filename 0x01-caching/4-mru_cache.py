#!/usr/bin/python3
"""This module implements a class"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """This is an implementation of class"""
    def __init__(self):
        """Initialize the class with the parent's init method."""
        super().__init__()
        self.usage_order = []

    def put(self, key, item):
        """Add an item in the cache."""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.usage_order.remove(key)
        self.cache_data[key] = item
        self.usage_order.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            mru_key = self.usage_order.pop()
            del self.cache_data[mru_key]
            print(f"DISCARD: {mru_key}")

    def get(self, key):
        """Get an item by key."""
        if key is None or key not in self.cache_data:
            return None
        self.usage_order.remove(key)
        self.usage_order.append(key)
        return self.cache_data[key]
