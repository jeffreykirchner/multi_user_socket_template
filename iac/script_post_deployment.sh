#!/bin/bash
echo "Create Super User:"
python ../manage.py setup_superuser_with_profile
python ../manage.py setup_site_parameters




