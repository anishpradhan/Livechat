FROM python:3.9

ENV PYHTONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /chatsupport

COPY requirements.txt /chatsupport

RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install -r requirements.txt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY . /chatsupport/

ENV DJANGO_SETTINGS_MODULE=chatsupport.settings
