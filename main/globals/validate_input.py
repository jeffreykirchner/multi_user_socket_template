#check non-negative integer, zero is included
def is_non_negative(num):
    if isinstance(num, int) and num >= 0:
        return True
    else:
        return False
