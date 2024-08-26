#!/usr/bin/python3
""" This module inherits from BaseCaching
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """This class inherits from BaseCaching

    Args:
        BaseCaching (class): Parent class
    """
    def put(self, key, item):
        """Adds item to the dictionary
        in define in the parent class

        Args:
            key (): key of the item to assign
            item (_type_): item to asssign
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """Returns the item"""
        return self.cache_data.get(key, None)
