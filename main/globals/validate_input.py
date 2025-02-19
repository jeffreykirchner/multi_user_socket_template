#check positive integer
def is_positive_integer(num):
    if isinstance(num, int) and num >= 0:
        return True
    else:
        return False
