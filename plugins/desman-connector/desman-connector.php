<?php
/**
 * Plugin Name: DeSMan&#0153; Connector
 * Plugin URI: https://gitlab.inetu.org/jfanjoy/desman-connector
 * Description: WordPress Plugin for managing DeSMan Storage connections and allow for object storage backing of all media uploads
 * Version: 2.4
 * Author: John Fanjoy <jfanjoy@inetu.net>
 * Author URI: https://gitlab.inetu.org/u/jfanjoy
 * License: WTFPL
 **/
defined ( 'ABSPATH' ) or die (__("No Script Kiddies Please"));
# composer autorequire and our connector class
require_once 'vendor/autoload.php';
require_once 'lib/connector.php';

# add some hooks and register plugin
register_activation_hook( __FILE__, 'dsman_activate');
add_action( 'init','dsman_init' );

# I believe this is run with each request. Keep this light to reduce impact on performance
function dsman_init () {
        global $dsman; # $dsman = new StorageConnector(__FILE__);
        $dsman = new StorageConnector( __FILE__, sprintf('dsman_%s', getenv('OPENSHIFT_DEPLOYMENT_BRANCH') ?: getenv('DESMAN_ENV')) );
        return $dsman;
}

# options get stored as a serialized array in wp_options under the optgroup_key defined in the storage connector class
function dsman_activate() {
        if ( envars_defined() ) {
                try {
                        $connector = new StorageConnector(__FILE__, sprintf('dsman_%s', getenv('OPENSHIFT_DEPLOYMENT_BRANCH') ?: getenv('DESMAN_ENV')));
                        # this could fail IF the domain name is longer than 32 characters because the bucket would be longer than app_name
                        update_option( sprintf('dsman_%s', getenv('OPENSHIFT_DEPLOYMENT_BRANCH') ?: getenv('DESMAN_ENV')), array(
                                'options' => intval(
                                        StorageConnector::OPTION_WP_UPLOADS | 
                                        StorageConnector::OPTION_COPY_TO_S3 | 
                                        StorageConnector::OPTION_SERVE_FROM_S3 | 
                                        StorageConnector::OPTION_REMOVE_LOCALS | 
                                        StorageConnector::OPTION_VERSIONING |
        				StorageConnector::OPTION_EXPIRATION_HEADER
                                ),
                                'prefix' => UPLOADS
                        ));
                } catch ( Exception $e ) { wp_die($e->getMessage()); }
        } elseif (get_option(sprintf('dsman_%s', getenv('DESMAN_ENV')), False)){
                # Correct options table entry exists.
        } else {
                wp_die(__("Required Environment Variables are not defined!"));
        }
}

function envars_defined() { return (bool) getenv("DESMAN_OBS_BASE_URL"); }
