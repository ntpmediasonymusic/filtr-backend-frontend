<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('DB_NAME',getenv('DESMAN_DB_ENV_MYSQL_DATABASE') );
define('DB_USER',getenv('DESMAN_DB_ENV_MYSQL_USER') );
define('DB_PASSWORD',getenv('DESMAN_DB_ENV_MYSQL_PASSWORD') );
define("DB_PORT" , getenv("DESMAN_DB_PORT_3306_TCP_PORT") ?: 3306 );
define('DB_HOST',getenv('DESMAN_DB_PORT_3306_TCP_ADDR') . ":" . DB_PORT );

/** Salts from docker build */
require_once(sprintf("%s/salt.php",dirname($_SERVER['DOCUMENT_ROOT'])));

// ** Object storage settings ** //
define( 'DESMAN_OBS_KEY_ID', getenv('DESMAN_OBS_KEY_ID'));
define( 'DESMAN_OBS_KEY_SECRET', getenv('DESMAN_OBS_KEY_SECRET'));
define( 'S3_BASE_URL', getenv('DESMAN_OBS_BASE_URL'));


/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/**
 * We prefer to be secure by default
 */
define('FORCE_SSL_ADMIN', true);

/* Disable plugin install in prod */
define( 'DISALLOW_FILE_MODS', getenv("DESMAN_ENV") == 'prod');

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
  define('ABSPATH', dirname(__FILE__) . '/');

if ( getenv("DESMAN_ENV") == "devel" ) define('SCRIPT_DEBUG',true);
$scheme = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?: 'http';
define('WP_HOME',$scheme."://".$_SERVER['HTTP_HOST']);
define('WP_SITEURL',WP_HOME);
/** Tell WordPress where the plugins directory really is */
if ( !defined('WP_CONTENT_DIR') ) define('WP_CONTENT_DIR',ABSPATH."wp-content");
if ( !defined('UPLOADS') ) define('UPLOADS',basename(WP_CONTENT_DIR).'/uploads');
if ( !defined('WP_PLUGIN_DIR') && is_link(WP_CONTENT_DIR . '/plugins') ) define('WP_PLUGIN_DIR', realpath(WP_CONTENT_DIR . '/plugins'));
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache
/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
