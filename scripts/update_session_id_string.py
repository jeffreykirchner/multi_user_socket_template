print("Update id strings")

from main.models import Session
import random
import string

# Get all sessions
sessions = Session.objects.all()

# Update id_string for each session
for session in sessions:
    # Generate a unique random 6 lowercase letter string
    id_string = ''.join(random.choices(string.ascii_lowercase, k=6))
    session.id_string = id_string
    session.save()
