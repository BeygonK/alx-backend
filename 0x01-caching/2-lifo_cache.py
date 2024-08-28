#!/usr/bin/python3
"""LIFO Implementation of cache"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """class which inherits from parent class"""
    def __init__(self):
        """Initialize the class with the parent's init method."""
        super().__init__()
        self.stack = []

    def put(self, key, item):
        """Add an item in the cache."""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.stack.remove(key)
        self.cache_data[key] = item
        self.stack.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            last_key = self.stack.pop()
            del self.cache_data[last_key]
            print(f"DISCARD: {last_key}")

    def get(self, key):
        """Get an item by key."""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
