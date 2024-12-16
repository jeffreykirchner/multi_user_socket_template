#!/bin/bash
echo "Create Super User:"
python ../manage.py createsuperuser
python ../manage.py setup_site_parameters




