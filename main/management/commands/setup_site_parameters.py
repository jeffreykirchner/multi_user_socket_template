from django.core.management.base import BaseCommand, CommandError
from main.models import Parameters


class Command(BaseCommand):
    help = "Setup site parameters"

    def handle(self, *args, **options):
        p = Parameters()
        p.save()
        self.stdout.write(self.style.SUCCESS('Successfully setup site parameters'))