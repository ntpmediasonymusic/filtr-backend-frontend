<?php
set_time_limit(2);
if ( getenv('DESMAN_CONTAINERIZER') == 'docker' ) {
    define('DB_NAME',getenv('DESMAN_DB_ENV_MYSQL_DATABASE') );
    define('DB_USER',getenv('DESMAN_DB_ENV_MYSQL_USER') );
    define('DB_PASSWORD',getenv('DESMAN_DB_ENV_MYSQL_PASSWORD') );
    define('DB_HOST',getenv('DESMAN_DB_PORT_3306_TCP_ADDR') );
} else {
    require_once(sprintf("%s/.dbc.php",dirname($_SERVER['DOCUMENT_ROOT'])));
}
$dsn = sprintf('mysql:dbname=%s;host=%s;charset=UTF8', DB_NAME, DB_HOST);
try {
    $db = new PDO($dsn, DB_USER, DB_PASSWORD);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->query('SELECT `option_value` FROM `wp_options` WHERE `option_name` = "siteurl"');
} catch (PDOException $e) {
    http_response_code(500);
    die('ERROR');
}
print 'OK';
