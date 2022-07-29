#!/bin/bash

python manage.py collectstatic --noinput

python manage.py migrate_schemas --shared

# Start server

gunicorn chatsupport.wsgi:application --bind 0.0.0.0:8000
# python manage.py runserver 0.0.0.0:8000

# exec "$@"