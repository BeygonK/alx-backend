#!/usr/bin/python3
"""Class inherits from BaseCaching"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    def __init__(self):
        """Initialize the class with the parent's init method."""
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """Add an item in the cache."""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.queue.remove(key)
        
        self.cache_data[key] = item
        self.queue.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_key = self.queue.pop(0)
            del self.cache_data[first_key]
            print(f"DISCARD: {first_key}")

    def get(self, key):
        """Get an item by key."""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
