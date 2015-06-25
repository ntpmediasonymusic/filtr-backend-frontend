FROM inetu/nginx-fpm:5.5

MAINTAINER John Fanjoy <jfanjoy@inetu.net>

ENV DESMAN_CONTAINERIZER docker

RUN apt-get update && \
    apt-get install -qq -y rsync libwww-curl-perl
ADD . /var/www/repo

RUN /var/www/repo/.desman/deploy
WORKDIR /var/www/html

# these will be removed in final image
CMD ["/var/www/repo/.desman/start"]
