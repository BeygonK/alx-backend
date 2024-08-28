#!/usr/bin/env python3
"""This module has a helper function"""


def index_range(page: int, page_size: int) -> tuple[int, int]:
    """This function returns a tuple"""
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index
