from decimal import Decimal, InvalidOperation

#check non-negative integer, zero is included
def is_non_negative(num):
    if isinstance(num, int) and num >= 0:
        return True
    else:
        return False

#check if non-negative float with at most # of decimal places, zero is included
def is_non_negative_float(num, decimal_places=2):
    if num is None:
        return False

    try:
        value = Decimal(str(num))
    except (InvalidOperation, TypeError, ValueError):
        return False

    if not value.is_finite() or value < 0:
        return False

    quantizer = Decimal("1").scaleb(-decimal_places)
    return value == value.quantize(quantizer)
