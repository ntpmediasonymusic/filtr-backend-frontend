<?php
/*
Plugin Name: DeSMan&#0153; Storage
Description: This plugin will automatically copy any new uploads (media) to an S3 Object Store managed by DeSMan
Author: Brad Tousenard (adapted by John Fanjoy <jfanjoy@inetu.net>)
Version: 0.3.2a

// Copyright (c) 2013 Brad Touesnard. All rights reserved.
//
// Released under the GPL license
// http://www.opensource.org/licenses/gpl-license.php
//
// **********************************************************************
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// **********************************************************************
//
// Forked Amazon S3 for WordPress with CloudFront (http://wordpress.org/extend/plugins/tantan-s3-cloudfront/)
// which is a fork of Amazon S3 for WordPress (http://wordpress.org/extend/plugins/tantan-s3/).
// Then completely rewritten.
*/

function as3cf_check_required_plugin() {
    if ( class_exists( 'S3_Connector' ) || !is_admin() || ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
        return;
    }

    require_once ABSPATH . '/wp-admin/includes/plugin.php';
    deactivate_plugins( __FILE__ );

    $msg = sprintf( __( 'Object Storage is not yet activated as it requires the <a href="%s">DeSMan &#0153; S3 Connector</a> plugin.', 'as3cf' ), 'https://github.com/deliciousbrains/wp-amazon-web-services' ) . '<br /><br />';
    
    if ( file_exists( WP_PLUGIN_DIR . '/s3-connector/s3-connector.php' ) ) {
        $activate_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=s3-connector/s3-connector.php', 'activate-plugin_s3-connector/s3-connector.php' );
        $msg .= sprintf( __( 'It appears to already be installed. <a href="%s">Click here to activate it.</a>', 'as3cf' ), $activate_url );
    }
    else {
        $download_url = 'https://github.com/deliciousbrains/wp-amazon-web-services/releases/download/v0.1/amazon-web-services-0.1.zip';
        $msg .= sprintf( __( '<a href="%s">Click here to download a zip of the latest version.</a> Then install and activate it. ', 'as3cf' ), $download_url );
    }

    $msg .= '<br /><br />' . __( 'Once it has been activated, you can activate DeSMan Object Storage', 'as3cf' );

    wp_die( $msg );
}

add_action( 'plugins_loaded', 'as3cf_check_required_plugin' );

function as3cf_init( $aws ) {
    global $as3cf;
    try {
        require_once 'classes/s3-downloads.php';
        $as3cf = new S3_Object_Storage( __FILE__, $aws );
        $bucket = array_shift($as3cf->get_buckets());
        $default = $bucket['Name'];
        $s3url = $default.".".parse_url(S3_BASE_URL,PHP_URL_HOST);
        
        # bucket and public url
        $as3cf->set_setting('bucket',$default);
        $as3cf->set_setting('cloudfront',$s3url);

        # naming, paths, and cache settings
        $as3cf->set_setting('expires',true);
        $as3cf->set_setting('object-versioning',true);
        $as3cf->set_setting('object-prefix',"wp-content/uploads/");

        # media behaviors
        $as3cf->set_setting('copy-to-s3',true);
        $as3cf->set_setting('serve-from-s3',true);
        $as3cf->set_setting('remove-local-file',true);

    } catch ( Exception $e ) {
        wp_die($e->getMessage());
    }
}

add_action( 'aws_init', 'as3cf_init' );
