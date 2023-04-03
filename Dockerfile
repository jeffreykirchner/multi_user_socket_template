# Use the official Python image from the Docker Hub

FROM python:3.11.2

# Make a new directory to put our code in.

RUN mkdir /code

# Change the working directory.

WORKDIR /code

# Copy to code folder

COPY . /code/

# Install the requirements.

RUN pip install -r requirements.txt

# Run the application:

CMD daphne -b 0.0.0.0 _multi_user_socket_template.asgi:application
#CMD python manage.py runserver