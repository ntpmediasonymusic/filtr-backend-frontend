<?php
/*
Plugin Name: DeSMan&#0153; Connector
Description: This plugin connects WordPress to the resources provided by the INetU Developer Service Manager
Author: John Fanjoy
Version: alpha/0.3.1
Author URI: http://bradt.ca/
Network: True
*/

/**
 *
 * The S3 portion of this plugin was derived from the Amazon Web Services S3 WordPress plugin by Brad Touesnard.
 * The original copyright is below for historical purposes
 *
 **/

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

function incompat($msg) {
	require_once ABSPATH . '/wp-admin/includes/plugin.php';
	deactivate_plugins( __FILE__ );
    wp_die( $msg );
}

# we really only need to check the basics because we have complete control over the environment.

if ( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {
	if ( version_compare( PHP_VERSION, '5.3.3', '<' ) ) {
		incompat( __( 'The version of PHP installed is not compatible with the s3 SDK'));
	}
	elseif ( !function_exists( 'curl_version' ) 
		|| !( $curl = curl_version() ) || empty( $curl['version'] ) || empty( $curl['features'] )
		|| version_compare( $curl['version'], '7.16.2', '<' ) )
	{
		incompat( __( 'The s3 SDK requires cURL > 7.16.2 to be installed and accessible to php'));
	}
}

require_once 'classes/aws-plugin-base.php';
require_once 'classes/s3-connector.php';
require_once 'vendor/aws/aws-autoloader.php';

# for now this is the only connector that's required
function s3_connector_init() {
    global $s3_connector;
    $s3_connector = new S3_Connector( __FILE__ );
}

add_action( 'init', 's3_connector_init' );

function s3_connector_activation() {
	if ( !( $as3cf = get_option( 'tantan_wordpress_s3' ) ) ) {
		return;
	}

	if ( !isset( $as3cf['key'] ) || !isset( $as3cf['secret'] ) ) {
		return;
	}

	if ( !get_site_option( S3_Connector::SETTINGS_KEY ) ) {
		add_site_option( S3_Connector::SETTINGS_KEY, array(
			'access_key_id' => getenv('DESMAN_OBS_KEY_ID'),
			'secret_access_key' => getenv('DESMAN_OBS_KEY_SECRET')
		) );
	}

	update_option( 'tantan_wordpress_s3', $as3cf );
}
register_activation_hook( __FILE__, 's3_connector_activation' );
