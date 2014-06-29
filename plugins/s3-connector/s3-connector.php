<?php
/*
Plugin Name: DeSMan &#0153; S3 Connector
Description: Includes the S3 SDK PHP libraries, stores access keys, and allows other plugins to hook into it
Author: Brad Touesnard
Modified: John Fanjoy
Version: alpha/0.3.1
Author URI: http://bradt.ca/
Network: True
*/

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

function amazon_web_services_incompatibile( $msg ) {
	require_once ABSPATH . '/wp-admin/includes/plugin.php';
	deactivate_plugins( __FILE__ );
    wp_die( $msg );
}

if ( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {
	if ( version_compare( PHP_VERSION, '5.3.3', '<' ) ) {
		amazon_web_services_incompatibile( __( 'The official Amazon Web Services SDK requires PHP 5.3.3 or higher. The plugin has now disabled itself.', 'amazon-web-services' ) );
	}
	elseif ( !function_exists( 'curl_version' ) 
		|| !( $curl = curl_version() ) || empty( $curl['version'] ) || empty( $curl['features'] )
		|| version_compare( $curl['version'], '7.16.2', '<' ) )
	{
		amazon_web_services_incompatibile( __( 'The official Amazon Web Services SDK requires cURL 7.16.2+. The plugin has now disabled itself.', 'amazon-web-services' ) );
	}
	elseif ( !( $curl['features'] & CURL_VERSION_SSL ) ) {
		amazon_web_services_incompatibile( __( 'The official Amazon Web Services SDK requires that cURL is compiled with OpenSSL. The plugin has now disabled itself.', 'amazon-web-services' ) );
	}
	elseif ( !( $curl['features'] & CURL_VERSION_LIBZ ) ) {
		amazon_web_services_incompatibile( __( 'The official Amazon Web Services SDK requires that cURL is compiled with zlib. The plugin has now disabled itself.', 'amazon-web-services' ) );
	}
}

require_once 'classes/aws-plugin-base.php';
require_once 'classes/s3-connector.php';
require_once 'vendor/aws/aws-autoloader.php';

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
