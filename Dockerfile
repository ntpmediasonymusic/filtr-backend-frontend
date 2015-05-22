FROM jolicode/hhvm
MAINTAINER John Fanjoy <jfanjoy@inetu.net>

RUN sudo apt-get update && sudo apt-get install -qq -y libwww-curl-perl lsof

ENV DESMAN_CONTAINERIZER docker
RUN sudo install -dT -o www-data -m2755 /var/www/ && \
    sudo install -dT -o travis -m2755 /build

VOLUME ["/var/desman/data"]

WORKDIR /build
ADD . /build/
ADD .openshift/action_hooks/deploy /build/deploy
RUN sudo install -m644 -o www-data -g www-data /build/config/hhvm.hdf /etc/hhvm/hhvm.hdf

ENTRYPOINT [ "/bin/bash" ]
