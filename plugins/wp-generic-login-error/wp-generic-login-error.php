<?php
/**
 * Plugin Name: Generic Login Errors
 * Plugin URI: https://gitlab.smehost.net/inetu/wp-generic-login-error
 * Description: WordPress Plugin for displaying generic login errors to frustrate brute-force logins
 * Version: 0.1
 * Author: David Six <dsix@inetu.net>
 * Author URI: https://gitlab.smehost.net/u/dsix
 * License: GPL
 **/
defined ( 'ABSPATH' ) or die (__("No Script Kiddies Please"));
# add some hooks and register plugin
register_activation_hook( __FILE__, 'gle_activate');
add_action( 'init','gle_init' );

# This is run with each request. Keep this light to reduce impact on performance
function gle_init () {
    add_filter('authenticate', 'authenticateFilter', 10000, 3);
}

function gle_activate() {
    pass;
}

function authenticateFilter($authUser, $username, $passwd){
    if(is_wp_error($authUser) || is_null($authUser)){
        error_log("Login Failure :: ".serialize($authUser));
        return new WP_Error( 'incorrect_password', sprintf( __( '<strong>ERROR</strong>: Authentication Failure. <a href="%1$s" title="Password Lost and Found">Lost your password</a>?', 'gle' ),  wp_lostpassword_url() ) );
    }
    return $authUser;
}
