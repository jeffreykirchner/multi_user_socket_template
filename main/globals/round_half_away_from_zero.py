'''
round away from zero
'''
import logging
from decimal import Decimal, ROUND_HALF_UP, ROUND_UP, ROUND_05UP


def round_half_away_from_zero(val, decimal_places):
    '''
    round half away from zero
    '''
    logger = logging.getLogger(__name__)
    if decimal_places == 0:
        place_string = "0"
    else:
        place_string = "0."
        for place in range(decimal_places):
            place_string += "0"
    
    val_str = str(val)
    
    # logger.info(f'round_half_away_from_zero: value {val_str} place string {place_string}')

    return float(Decimal(val_str).quantize(Decimal(place_string), rounding=ROUND_HALF_UP))

def round_up(val, decimal_places):
    '''
    round half up
    '''
    logger = logging.getLogger(__name__)
    if decimal_places == 0:
        place_string = "0"
    else:
        place_string = "0."
        for place in range(decimal_places):
            place_string += "0"
    
    val_str = str(val)
    
    # logger.info(f'round_half_away_from_zero: value {val_str} place string {place_string}')

    return Decimal(val_str).quantize(Decimal(place_string), rounding=ROUND_UP)