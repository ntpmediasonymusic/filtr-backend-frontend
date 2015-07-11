FROM registry.smehost.net:5000/inetu/nginx-fpm:5.5

MAINTAINER John Fanjoy <jfanjoy@inetu.net>

ENV DESMAN_CONTAINERIZER docker

RUN apt-get update && \
    apt-get install -qq -y rsync libwww-curl-perl
ADD . /var/www/repo

RUN /var/www/repo/.desman/deploy && \
    cp /var/www/repo/config/nginx.conf /etc/nginx/conf.d/main.conf && \
    cp /var/www/repo/config/w3tc-nginx.conf /etc/nginx/w3tc
WORKDIR /var/www
CMD ["/var/www/repo/.desman/start"]
