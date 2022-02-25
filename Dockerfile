FROM python:3.9

ENV PYHTONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /chatsupport

COPY requirements.txt /chatsupport

RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY . /chatsupport/

ENV DJANGO_SETTINGS_MODULE=chatsupport.settings
CMD python3 manage.py runserver 0.0.0.0:$PORT
