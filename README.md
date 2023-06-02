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
preferred release in the base-wordpress layer. You can also downgrade in a similar fashion. Any plugins 
or themes you add should be added to the appropriate `plugins` or `themes` directories in the root of the 
repository.

If a newer version of a plugin or theme is released, it's installed automatically from the slugs listed 
in the plugins.yaml. Plugins in the `plugins` folder will need to be updated manually

Plugins
------------

There are several plugins included with this project to help secure the frontend and provide a means for
storing uploaded media (i.e. `wp-content/uploads`)

* WordFence
* DeSMan Connector
* mainwp-child
* w3-total-cache
* SME-Tools
* SME-Security

Docker
----------

The docker build for this application is dependent on the inetu/nginx-fpm image. This image can be built using
the [inetu/nginx-fpm](https://gitlab.smehost.net/inetu/nginx-fpm) repo which has been made public so that anyone
can pull the repo.

Building a docker image will require access to a docker daemon, and by default you will need to be root to communicate.
To get started log into your build server as root and follow the steps below:

Note: You may need to update the NewRelic Agent version to the latest release. Check [here](https://download.newrelic.com/php_agent/release/) to find the latest version. 

```bash
╰─○ git clone git@gitlab.smehost.net:inetu/nginx-fpm.git
Cloning into 'nginx-fpm'...
remote: Counting objects: 655, done.
remote: Compressing objects: 100% (91/91), done.
remote: Total 655 (delta 91), reused 117 (delta 64)
Receiving objects: 100% (655/655), 67.70 KiB | 135.00 KiB/s, done.
Resolving deltas: 100% (392/392), done.
╰─○ cd nginx-fpm 
╰─± git checkout php8.2-alpine
Branch 'php8.2-alpine' set up to track remote branch 'php8.2-alpine' from 'origin'.
Switched to a new branch 'php8.2-alpine'
─± docker pull php:8.2-fpm-alpine3.16 &&
BUILD_T=`date +%s`;\
REF=`git rev-parse --short @`;\
NAME='registry.smehost.net:5000/inetu/nginx-fpm';\
docker build --no-cache -t ${NAME}:8.2-alpine -t ${NAME}:8.2-alpine-${REF}-${BUILD_T} .
8.2-fpm-alpine3.16: Pulling from library/php
Digest: sha256:9657c0a34d5ab86f1f57bafafe9b1e95edd1405bdeb1c3a96c4d3e09e7587632
Status: Image is up to date for php:8.2-fpm-alpine3.16
docker.io/library/php:8.2-fpm-alpine3.16
[+] Building 90.8s (13/13) FINISHED                                                                                                                                                       
 => [internal] load build definition from Dockerfile                                                                                                                                 0.0s
 => => transferring dockerfile: 3.19kB                                                                                                                                               0.0s
 => [internal] load .dockerignore                                                                                                                                                    0.0s
 => => transferring context: 34B                                                                                                                                                     0.0s
 => [internal] load metadata for docker.io/library/php:8.2-fpm-alpine3.16                                                                                                            0.0s
 => CACHED [1/8] FROM docker.io/library/php:8.2-fpm-alpine3.16                                                                                                                       0.0s
 => [internal] load build context                                                                                                                                                    0.0s
 => => transferring context: 827B                                                                                                                                                    0.0s
 => [2/8] RUN apk add --no-cache db libgcc libstdc++ icu-libs libintl freetype libpng libjpeg-turbo libmemcached libsasl libwebp yaml zlib nginx ssmtp libzip                        1.4s
 => [3/8] RUN apk add --no-cache --virtual .build-deps freetype-dev libpng-dev libjpeg-turbo-dev gettext-dev icu-dev zlib-dev libmemcached-dev cyrus-sasl-dev libwebp-dev yaml-dev  86.1s 
 => [4/8] RUN curl -sL -o /tmp/newrelic.tgz https://download.newrelic.com/php_agent/release/newrelic-php5-10.10.0.1-linux-musl.tar.gz &&     tar -xzf /tmp/newrelic.tgz -C /tmp &&   2.2s 
 => [5/8] RUN sed -ri 's/;?pm.max_requests =.*$/pm.max_requests = 500/' /usr/local/etc/php-fpm.d/www.conf && /bin/echo -ne '\n; add new line in case there is no new line at end of  0.4s 
 => [6/8] COPY nginx/ /etc/nginx/                                                                                                                                                    0.0s 
 => [7/8] WORKDIR /var/www                                                                                                                                                           0.0s 
 => [8/8] COPY .desman/ /var/www/repo/.desman/                                                                                                                                       0.0s 
 => exporting to image                                                                                                                                                               0.5s 
 => => exporting layers                                                                                                                                                              0.5s 
 => => writing image sha256:6995f4d2455f2f6694700622a37c60037775ae9b72a21ceea1f0d341c7294934                                                                                         0.0s
 => => naming to registry.smehost.net:5000/inetu/nginx-fpm:8.2-alpine                                                                                                                0.0s
 => => naming to registry.smehost.net:5000/inetu/nginx-fpm:8.2-alpine-1f025d9-1685720706                      
```

Docker caches each build process so that unless there is a change you don't need to run every step. Once you have
the **inetu/nginx-fpm** image locally available, you can build this project very similarly. Assuming you cloned your project
into a directory named wordpress, the process would be along the lines of:


```bash
╰─○ git clone git@gitlab.smehost.net:inetu/base-wordpress.git
Cloning into 'base-wordpress'...
remote: Counting objects: 1053, done.
remote: Compressing objects: 100% (11/11), done.
remote: Total 1053 (delta 4), reused 0 (delta 0)
Receiving objects: 100% (1053/1053), 170.77 KiB | 128.00 KiB/s, done.
Resolving deltas: 100% (541/541), done.
╰─○ cd base-wordpress 
╰─± git checkout php8-alpine
Branch 'php8-alpine' set up to track remote branch 'php8-alpine' from 'origin'.
Switched to a new branch 'php8-alpine'
╰─± docker build --no-cache -t registry.smehost.net:5000/inetu/base-wordpress:php8 .

[+] Building 60.7s (15/15) FINISHED                                                                                                                                                       
 => [internal] load build definition from Dockerfile                                                                                                                                 0.0s
 => => transferring dockerfile: 1.39kB                                                                                                                                               0.0s
 => [internal] load .dockerignore                                                                                                                                                    0.0s
 => => transferring context: 2B                                                                                                                                                      0.0s
 => [internal] load metadata for registry.smehost.net:5000/inetu/nginx-fpm:8.2-alpine                                                                                                0.0s
 => [ 1/10] FROM registry.smehost.net:5000/inetu/nginx-fpm:8.2-alpine                                                                                                                0.2s
 => [internal] load build context                                                                                                                                                    0.0s
 => => transferring context: 40.15kB                                                                                                                                                 0.0s
 => [ 2/10] WORKDIR /var/www                                                                                                                                                         0.0s
 => [ 3/10] COPY health.php /var/www/html/                                                                                                                                           0.0s
 => [ 4/10] COPY bin/* /usr/local/bin/                                                                                                                                               0.0s
 => [ 5/10] COPY [universal_plugins.yaml, VERSION, /var/www/]                                                                                                                        0.0s
 => [ 6/10] COPY config/w3tc-nginx.conf /etc/nginx/w3tc                                                                                                                              0.0s
 => [ 7/10] COPY config/w3tc-base.json /var/www/repo/.desman/w3tc-base.json                                                                                                          0.0s
 => [ 8/10] COPY .desman/start.d /var/www/repo/.desman/start.d/                                                                                                                      0.0s
 => [ 9/10] RUN wp-docker.php base &&     cp -f /var/www/html/wp-content/plugins/w3-total-cache/wp-content/advanced-cache.php /var/www/html/wp-content/ &&     install -d -o www-d  58.7s
 => [10/10] COPY config/w3tc-config     /var/www/html/wp-content/w3tc-config/                                                                                                        0.0s
 => exporting to image                                                                                                                                                               1.5s 
 => => exporting layers                                                                                                                                                              1.5s 
 => => writing image sha256:e7ccf0758a657d0082d57314dd646a0383d41bd5d68392a3837f144882f2fbd4                                                                                         0.0s 
 => => naming to registry.smehost.net:5000/inetu/base-wordpress:php8   
```

From here, we're going to navigate to our site's repository and build it with the following command:

```bash
╰─± cd ../demotest.smehost.net 
╭─brian at L5411 in ~/Working/Gits/demotest.smehost.net on devel✘✘✘
╰─± git pull origin
remote: Counting objects: 38, done.
remote: Compressing objects: 100% (24/24), done.
remote: Total 38 (delta 18), reused 25 (delta 9)
Unpacking objects: 100% (38/38), 4.33 KiB | 632.00 KiB/s, done.
From gitlab.smehost.net:inetu/demotest-smehost-net
   87d5653..bf9f251  devel      -> origin/devel
You asked to pull from the remote 'origin', but did not specify
a branch. Because this is not the default configured remote
for your current branch, you must specify a branch on the command line.
╭─brian at L5411 in ~/Working/Gits/demotest.smehost.net on devel✘✘✘
╰─± vim Dockerfile 
╭─brian at L5411 in ~/Working/Gits/demotest.smehost.net on devel✘✘✘
╰─± docker build -t demotest.smehost.net .
[+] Building 31.0s (16/16) FINISHED                                                                                                                                                       
 => [internal] load build definition from Dockerfile                                                                                                                                 0.0s
 => => transferring dockerfile: 94B                                                                                                                                                  0.0s
 => [internal] load .dockerignore                                                                                                                                                    0.0s
 => => transferring context: 66B                                                                                                                                                     0.0s
 => [internal] load metadata for registry.smehost.net:5000/inetu/base-wordpress:php8                                                                                                 0.0s
 => [1/1] FROM registry.smehost.net:5000/inetu/base-wordpress:php8                                                                                                                   0.3s
 => [internal] load build context                                                                                                                                                    0.0s
 => => transferring context: 9.70kB                                                                                                                                                  0.0s
 => [2/1] COPY config/nginx.conf /etc/nginx/conf.d/main.conf                                                                                                                         0.0s
 => [3/1] COPY languages /var/www/html/wp-content/languages/                                                                                                                         0.0s
 => [4/1] COPY plugins /var/www/html/wp-content/plugins/                                                                                                                             0.0s
 => [5/1] COPY themes /var/www/html/wp-content/themes/                                                                                                                               0.0s
 => [6/1] COPY cron.d /var/www/repo/cron.d/                                                                                                                                          0.0s
 => [7/1] COPY .desman/start.d /var/www/repo/.desman/start.d/                                                                                                                        0.0s
 => [8/1] COPY [extras/, config/wp-config.php, /var/www/html/]                                                                                                                       0.0s
 => [9/1] COPY plugins.yaml /var/www/                                                                                                                                                0.0s
 => [10/1] RUN wp-docker.php plugins                                                                                                                                                28.9s
 => [11/1] RUN echo '<?php' > /var/www/salt.php; curl -s https://api.wordpress.org/secret-key/1.1/salt/ >> /var/www/salt.php                                                         0.5s 
 => exporting to image                                                                                                                                                               0.9s 
 => => exporting layers                                                                                                                                                              0.8s 
 => => writing image sha256:85f0b73680ed9e4b73f482398fcbcffdfbb5c9ba657d8c654fb6d88c65ef88c8                                                                                         0.0s 
 => => naming to docker.io/library/demotest.smehost.net
 ```

Once you receive the message `Successfully tagged/built` some hash, you are ready to run the application. You will need to set some environment
varables for WordPress to be able to communicate with the Object Storage and Database. These get set at run time using the `-e` flag once for each variable

```bash
docker run -it -d -p 80 --name demotest \
-e DESMAN_OBS_SIGNATURE=v4 \ 
-e DESMAN_OBS_REGION=eu-central-1 \ 
-e DESMAN_DB_ENV_MYSQL_USER=XXXXXXXXXXX \ 
-e DESMAN_OBS_KEY_SECRET=XXXXXXXXXXXX \ 
-e DESMAN_OBS_BUCKET=XXXXXXXXX \ 
-e DESMAN_OBS_BASE_URL=https://s3.eu-central-1.amazonaws.com \ 
-e DESMAN_DB_PORT_3306_TCP_ADDR=XXXXXXXXXXXX \ 
-e DESMAN_OBS_EXT_URL=https://cdn-d.smehost.net \ 
-e DESMAN_OBS_PREFIX=XXXXXXXXXX \ 
-e DESMAN_DB_ENV_MYSQL_PASSWORD=XXXXXXXXXXX \ 
-e DESMAN_OBS_PATH_MODE=False \ 
-e DESMAN_ENV=devel \ 
-e DESMAN_OBS_KEY_ID=XXXXXXXXXXXXXXX \ 
-e DESMAN_DB_ENV_MYSQL_DATABASE=XXXXXXXXXXX \ 
-e DESMAN_DB_PORT_3306_TCP_PORT=3306 \
demotest.smehost.net:latest
```

If you are unsure of how to get this information, contact support for assistance. Verify that the container is running and check the port mapping with the following commands:

```bash
root@sony-build01 wordpress # docker ps
CONTAINER ID        IMAGE                   COMMAND                CREATED             STATUS              PORTS                             NAMES
63de75098bbc        local/wordpress:devel   "/var/www/repo/.desm   5 seconds ago    5 seconds ago    9000/tcp, 0.0.0.0:47808->80/tcp   wordpress-example 
root@sony-build01 wordpress # docker port wordpress-example
80/tcp -> 0.0.0.0:47808
```

Using this example, wordpress should now be accessible at http://localhost:47808/. Due to the fact that this is intended to be run behind an nginx proxy which will offload
the SSL encryption/decryption, you will not be able to access the admin panel directly. You can create a local nginx proxy with self-signed certificates if that will be a requirement,
but that is not covered in this document. 



Extra information
-----------

We've added the `.inetu` directory as a place to keep local copies of files on the sftp server without including
them in the repository. Any MySQL exports and storage downloads __SHOULD__ be kept here or in another directory
that has been added to `.gitignore` to avoid degrading repository performance.
