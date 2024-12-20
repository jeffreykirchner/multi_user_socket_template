from django.core.management.base import BaseCommand
from getpass import getpass
from django.contrib.auth.models import User
from main.models import Profile

class Command(BaseCommand):
    help = "Setup superuser with profile"

    def handle(self, *args, **options):
        email = input('Enter email: ')
        password = getpass('Enter password: ')
        first_name = input('Enter first name: ')
        last_name = input('Enter last name: ')

        user = User.objects.create_superuser(username=email, 
                                             first_name=first_name,
                                             last_name=last_name,
                                             email=email, 
                                             password=password)
        Profile.objects.create(user=user)
        self.stdout.write(self.style.SUCCESS('Successfully created superuser with profile'))
