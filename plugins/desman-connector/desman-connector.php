<?php
/**
 * Plugin Name: DeSMan&#0153; Connector
 * Plugin URI: https://gitlab.inetu.org/jfanjoy/desman-connector
 * Description: WordPress Plugin for managing DeSMan Storage connections and allow for object storage backing of all media uploads
 * Version: 2.7.3
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
#  global $dsman; # $dsman = new StorageConnector(__FILE__);
  $dsman = new StorageConnector( __FILE__, "dsman" );
#  return $dsman;
}

# options get stored as a serialized array in wp_options under the optgroup_key defined in the storage connector class
function dsman_activate() {
    try {
      $connector = new StorageConnector(__FILE__, "dsman");
      if ($connector->error) {
        wp_die(__("Required Environment Variables are not defined!"));
      }
    } catch ( Exception $e ) { wp_die($e->getMessage()); }
}

function envars_defined() { return (bool) getenv("DESMAN_OBS_BASE_URL"); }
