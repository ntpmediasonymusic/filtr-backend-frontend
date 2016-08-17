WordPress as a Platform Application
================

This repo contains the build scripts necessary to deploy Highly Available WordPress Applications using
DeSMan Object Storage for uploads and git version control for all code provided by the project team.
The WordPress core is _not_ tracked as part of this repository. A collection of plugins have been included
which will make the installation more secure, and custom configuration is included to link the application
that is deployed in DeSMan to the Infrastructure we've included in the environment for object storage
and MySQL databases.

Recently, we've added the necessary files for deploying this repo as a Docker container. Checkout the docker
section for more information on how to build the image locally.

Updating
-------

To update WordPress, Simply replace the version number in `VERSION` to the exact version number of the 
preferred release. You can also downgrade in a similar fashion. Any plugins or themes you add should be 
added to the appropriate `plugins` or `themes` directories in the root of the repository.

If a newer version of a plugin or theme is released, it's recommended that you download and install it here
rather than through the wordpress admin panel due to the highly available nature of DeSMan Managed websites.

Plugins
------------

There are several plugins included with this project to help secure the frontend and provide a means for
storing uploaded media (i.e. `wp-content/uploads`)

* WordFence
* DeSMan Connector
* wp-google-authenticator
* mainwp-child
* w3-total-cache

Docker
----------

The docker build for this application is dependent on the inetu/nginx-fpm image. This image can be built using
the [inetu/nginx-fpm](https://gitlab.smehost.net/inetu/nginx-fpm) repo which has been made public so that anyone
can pull the repo.

Building a docker image will require access to a docker daemon, and by default you will need to be root to communicate.
To get started log into your build server as root and follow the steps below:


```bash

root@sony-build01 ~ # git clone https://gitlab.smehost.net/inetu/nginx-fpm.git && cd nginx-fpm
root@sony-build01 nginx-fpm # docker build -t inetu/nginx-fpm:5.5 .
Sending build context to Docker daemon 11.78 kB
Sending build context to Docker daemon 
Step 0 : FROM php:5.5-fpm
 ---> 90dcb85bfdbc
Step 1 : MAINTAINER John Fanjoy <jfanjoy@inetu.net>
 ---> Using cache
 ---> fcedc0eeb736
Step 2 : ENV DESMAN_CONTAINERIZER docker
 ---> Using cache
 ---> 3b8d144a3d2f
Step 3 : RUN echo "deb http://nginx.org/packages/debian/ jessie nginx" | tee -a /etc/apt/sources.list &&     apt-key adv --fetch-keys http://nginx.org/keys/nginx_signing.key &&     apt-get update -qq &&     apt-get install -qq -y libmcrypt-dev libpng12-dev nginx php-pear curl libmemcached-dev zlib1g-dev libncurses5-dev
 ---> Using cache
 ---> c520f5a59ff2
Step 4 : EXPOSE 80
 ---> Using cache
 ---> 0fd37b3ec8f8
Step 5 : WORKDIR /usr/src/php/ext
 ---> Using cache
 ---> be4aecf561cd
Step 6 : RUN curl -sL http://pecl.php.net/get/memcached-2.2.0.tgz -o memcached-2.2.0.tgz &&     curl -L http://pecl.php.net/get/memcache-2.2.7.tgz -o memcache-2.2.7.tgz &&     tar -xzf memcached-2.2.0.tgz && tar -xzf memcache-2.2.7.tgz &&     docker-php-ext-install memcached-2.2.0 &&     docker-php-ext-install memcache-2.2.7 &&     rm -vf memcache-2.2.7.tgz memcached-2.2.0.tgz
 ---> Using cache
 ---> d058c1b416ca
Step 7 : RUN docker-php-ext-install mcrypt gd mbstring mysql pdo_mysql mysqli
 ---> Using cache
 ---> a74031e3e2db
Step 8 : RUN /bin/echo -ne "pm.status_path = /status-fpm\nping.path = /ping\nping.response = pong\n" | tee -a /usr/local/etc/php-fpm.conf
 ---> Using cache
 ---> d73210f476f4
Step 9 : ADD nginx.conf /etc/nginx/conf.d/default.conf
 ---> Using cache
 ---> 612d30dd2f6d
Step 10 : RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
 ---> Using cache
 ---> c324d97bbc9c
Successfully built c324d97bbc9c
root@sony-build01 nginx-fpm # cd ..


```

Docker caches each build process so that unless there is a change you don't need to run every step. Once you have
the **inetu/nginx-fpm** image locally available, you can build this project very similarly. Assuming you cloned your project
into a directory named wordpress, the process would be along the lines of:


```bash

root@sony-build01 ~ # cd wordpress && docker build -t local/wordpress:devel .
Sending build context to Docker daemon 35.67 MB
Sending build context to Docker daemon 
Step 0 : FROM inetu/nginx-fpm:5.5
 ---> c324d97bbc9c
Step 1 : MAINTAINER John Fanjoy <jfanjoy@inetu.net>
 ---> Using cache
 ---> 729be023a91e
Step 2 : ENV DESMAN_CONTAINERIZER docker
 ---> Using cache
 ---> 721d13eab66d
Step 3 : RUN apt-get update &&     apt-get install -qq -y rsync libwww-curl-perl
 ---> Running in 7b53c57941e1
Get:1 http://security.debian.org jessie/updates InRelease [63.1 kB]
Ign http://nginx.org jessie InRelease
Get:2 http://httpredir.debian.org jessie-updates InRelease [133 kB]
Get:3 http://httpredir.debian.org jessie InRelease [134 kB]
Get:4 http://nginx.org jessie Release.gpg [287 B]
Get:5 http://nginx.org jessie Release [2307 B]
Get:6 http://security.debian.org jessie/updates/main amd64 Packages [131 kB]
Get:7 http://httpredir.debian.org jessie/main amd64 Packages [9038 kB]
Get:8 http://nginx.org jessie/nginx amd64 Packages [824 B]
Get:9 http://httpredir.debian.org jessie-updates/main amd64 Packages [3616 B]
Fetched 9506 kB in 5s (1806 kB/s)
Reading package lists...
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package libpopt0:amd64.
(Reading database ... 13100 files and directories currently installed.)
Preparing to unpack .../libpopt0_1.16-10_amd64.deb ...
Unpacking libpopt0:amd64 (1.16-10) ...
Selecting previously unselected package libcurl3-gnutls:amd64.
Preparing to unpack .../libcurl3-gnutls_7.38.0-4+deb8u2_amd64.deb ...
Unpacking libcurl3-gnutls:amd64 (7.38.0-4+deb8u2) ...
Selecting previously unselected package libwww-curl-perl.
Preparing to unpack .../libwww-curl-perl_4.17-1+b1_amd64.deb ...
Unpacking libwww-curl-perl (4.17-1+b1) ...
Selecting previously unselected package rsync.
Preparing to unpack .../rsync_3.1.1-3_amd64.deb ...
Unpacking rsync (3.1.1-3) ...
Processing triggers for systemd (215-17+deb8u1) ...
Setting up libpopt0:amd64 (1.16-10) ...
Setting up libcurl3-gnutls:amd64 (7.38.0-4+deb8u2) ...
Setting up libwww-curl-perl (4.17-1+b1) ...
Setting up rsync (3.1.1-3) ...
invoke-rc.d: policy-rc.d denied execution of restart.
Processing triggers for libc-bin (2.19-18) ...
Processing triggers for systemd (215-17+deb8u1) ...
 ---> 66b661c60215
Removing intermediate container 7b53c57941e1
Step 4 : ADD . /var/www/repo
 ---> 8edeb8d008d8
Removing intermediate container 16795799e4d0
Step 5 : RUN /var/www/repo/.desman/deploy &&     cp /var/www/repo/config/nginx.conf /etc/nginx/conf.d/default.conf &&     cp /var/www/repo/config/w3tc-nginx.conf /etc/nginx/w3tc
 ---> Running in 43d6517ed5c4
Writing new SALT... Done
Downloading WordPress Version 4.2.2... 
Verifying archive integrity now... 
Copying Wordpress configuration in /var/www/repo/config/wp-config.php...
Setting up W3 Total Cache... Done
Copying WordPress plugins from repository... Done
Copying WordPress themes from repository... Done
Copying build files to installdir now... Done
 ---> f892ed2bc1d5
Removing intermediate container 43d6517ed5c4
Step 6 : WORKDIR /var/www
 ---> Running in 9472a0d46215
 ---> cc8967dcfc77
Removing intermediate container 9472a0d46215
Step 7 : CMD /var/www/repo/.desman/start
 ---> Running in b5f6dbb980a6
 ---> 63de75098bbc
Removing intermediate container b5f6dbb980a6
Successfully built 63de75098bbc
root@sony-build01 wordpress # 

```

Once you receive the message `Successfully built` some hash, you are ready to run the application. You will need to set some environment
varables for WordPress to be able to communicate with the Object Storage and Database. These get set at run time using the `-e` flag once for each variable

```bash

root@sony-build01 wordpress # docker run -ti -d -p 80 \
  --name wordpress-example \
  -e DESMAN_ENV=devel \
  -e DESMAN_DB_ENV_MYSQL_USER=mysql_user \
  -e DESMAN_DB_ENV_MYSQL_DATABASE=mysql_db \
  -e DESMAN_DB_ENV_MYSQL_PASSWORD=mysql_password \
  -e DESMAN_DB_PORT_3306_TCP_ADDR=10.106.31.251 \
  -e DESMAN_OBS_KEY_ID=YOUR_OBS_KEY_ID \
  -e DESMAN_OBS_KEY_SECRET=YOUR_OBS_KEY_SECRET \
  -e DESMAN_OBS_BASE_URL=http://obs.smehost.net \
  local/wordpress:devel
63de75098bbc2b50ff83bd282ae0882d089e547b732267212e680f718d38511e

```

If you are unsure of how to get this information, contact support for assistance. Verify that the container is running and check the port mapping with the following commands:

```bash

root@sony-build01 wordpress # docker ps
CONTAINER ID        IMAGE                   COMMAND                CREATED             STATUS              PORTS                             NAMES
63de75098bbc        local/wordpress:devel   "/var/www/repo/.desm   5 seconds ago    5 seconds ago    9000/tcp, 0.0.0.0:47808->80/tcp   wordpress-example 
root@sony-build01 wordpress # docker port wordpress-example
80/tcp -> 0.0.0.0:47808
root@sony-build01 wordpress #

```

Using this example, wordpress should now be accessible at http://localhost:47808/. Due to the fact that this is intended to be run behind an nginx proxy which will offload
the SSL encryption/decryption, you will not be able to access the admin panel directly. You can create a local nginx proxy with self-signed certificates if that will be a requirement,
but that is not covered in this document. 



Extra information
-----------

We've added the `.inetu` directory as a place to keep local copies of files on the sftp server without including
them in the repository. Any MySQL exports and storage downloads __SHOULD__ be kept here or in another directory
that has been added to `.gitignore` to avoid degrading repository performance.
