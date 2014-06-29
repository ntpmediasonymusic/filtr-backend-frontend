DeSMan S3 Object Storage
=============

> Contributors: Author: bradt, Adapted: jfanjoy
Tags: uploads, s3, storage, cdn, media
Requires at least: 3.5
Tested up to: 3.6.1
Stable tag: 0.6.1
License: GPLv3

Copies files to DeSMan Object Storage as they are uploaded to the Media Library. Also replaces all references to the url for uploaded media with the object storage bucket url.

Description
--------

This plugin automatically copies images, videos, documents, and any other media added through WordPress' media uploader to DeSMan Object Storage (OBS) using the s3 protocol. 
It then automatically replaces the URL to each media file with their respective OBS URL Image thumbnails are also copied to OBS and delivered through S3/OBS.

Uploading files *directly* to your OBS account is not currently supported by this plugin. They are uploaded to your server first, then copied to OBS. There is an option
to automatically remove the files from your server once they are copied to OBS however.

If you're adding this plugin to a site that's been around for a while, your existing media files will not be copied or served from OBS. Only newly uploaded files will be 
copied and served from OBS.

**[Request features, report bugs, and submit pull requests on Gitlab](https://gitlab.smehost.net/inetu/desman-wordpress/issues)**

*This plugin has been completely rewritten and adapted multiple times, but was originally a fork of 
[Amazon S3 for WordPress with CloudFront](http://wordpress.org/extend/plugins/tantan-s3-cloudfront/) 
which is a fork of [Amazon S3 for WordPress](http://wordpress.org/extend/plugins/tantan-s3/), also known as tantan-s3.*

Installation
----------

1. Installation should be automatically handled by you. However, you will need to activate the s3 connector before you can activate this plugins
2. Follow the instructions [if any] to setup your DeSMan access keys
3. Install this plugin using WordPress' built-in installer
4. Access the *Object Storage* option under *DeSMan* and configure


Changelog
-----------

+ 0.2.0 - 24 Jun 14 "John Fanjoy <jfanjoy@inetu.net>"
 Initial Version (adapted from Amazon S3 and Cloudfront plugin by bradt [GPLv3])