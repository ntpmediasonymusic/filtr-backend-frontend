<?php
defined ( 'ABSPATH' ) or die (__("No Script Kiddies Please"));
use Aws\Common\Aws;
use Aws\S3\S3Client;
class StorageConnector {
  const OPTION_WP_UPLOADS = 1;
  const OPTION_COPY_TO_S3 = 2;
  const OPTION_SERVE_FROM_S3 = 4;
  const OPTION_REMOVE_LOCALS = 8;
  const OPTION_VERSIONING = 16;
  const OPTION_FORCE_SSL = 32;
  const OPTION_EXPIRATION_HEADER = 64;
  const OPTION_HIDPI = 128;
  protected $plugin_file_path, $plugin_dir_path, $plugin_slug, $plugin_basename, $plugin_title, $plugin_menu_title, $Aws, $s3Client;
  private $options;
  public $default_prefix;
  public $id, $secret_key, $bucket, $endpoint, $ext_endpoint;

  public function __construct( $plugin_file_path, $optgroup ) {
    $this->default_options = array('wp-uploads' => True, 'copy-to-s3' => True, 'serve-from-s3' => True, 'remove-local-file' => True, 'object-versioning' => False, 'force-ssl' => False, 'expiration-header' => True, 'hidpi-images' => False);
    $this->optgroup = $optgroup;
    $this->plugin_file_path = $plugin_file_path;
    $this->plugin_dir_path = rtrim( plugin_dir_path( $plugin_file_path ), '/' );
    $this->plugin_slug = basename( $this->plugin_dir_path );
    $this->plugin_basename = plugin_basename( $plugin_file_path );
    $this->default_prefix = UPLOADS;
    $this->prefix = UPLOADS;
    $this->error = False;
    $this->id = getenv("DESMAN_OBS_KEY_ID");
    $this->env = getenv('DESMAN_ENV');
    $this->secret_key = getenv("DESMAN_OBS_KEY_SECRET");
    $this->bucket = getenv("DESMAN_OBS_BUCKET");
    $this->endpoint = getenv("DESMAN_OBS_BASE_URL");
    $this->ext_endpoint = getenv("DESMAN_OBS_EXT_URL") ?: $this->endpoint;
    if (!$this->id) {
        if (!$this->env) {
            # We don't have the variables we need
            $this->error = 'Missing settings - env';
        } else {
            $options = get_option(sprintf('dsman_%s', $this->env));
            if (!$options) {
                # We don't have the variables we need
                $this->error = 'Missing settings - opt';
            } else {
                # Set from DB
                $this->id = $options['id'];
                $this->secret_key = $options['secret'];
                $this->bucket = $options['bucket'];
                $this->endpoint = $options['endpoint'];
                $this->ext_endpoint = $options['ext-endpoint'] ?: $this->endpoint;
            }
        }
    }
    $this->general_options = get_option('desman_options', $this->default_options);
#    do_action( 'dsman_init', $this );
    if ( is_admin() ) do_action( 'dsman_admin_init', $this );
    if ( is_multisite() ) {
      add_action( 'network_admin_menu', array( $this, 'admin_menu' ) );
      $this->plugin_permission = 'manage_network_options';
    } else {
      add_action( 'admin_menu', array( $this, 'admin_menu' ) );
      $this->plugin_permission = 'manage_options';
    }
    $this->plugin_title = __( 'DeSMan&#0153; Connector Settings', 'desman-connector' );
    $this->plugin_menu_title = __( 'DeSMan&#0153;', 'desman-connector' );

    add_action( 'wp_ajax_dsman-create-bucket', array( $this, 'ajax_create_bucket' ) );

    add_filter( 'wp_get_attachment_url' , array( $this, 'wp_get_attachment_url' ) , 9, 2 );
    add_filter( 'wp_generate_attachment_metadata', array( $this, 'gen_metadata'), 20, 2);
    add_filter( 'delete_attachment', array( $this, 'delete_attachment'), 20 );
    add_filter( 'wp_calculate_image_srcset', array( $this, 'wp_calculate_image_srcset'), 20, 5 );
    add_action( 'wpml_media_create_duplicate_attachment', array($this, 'update_existing_metadata'), 10, 2);
    add_action( 'icl_make_duplicate', array($this, 'update_wpml_metadata'), 10, 4);
    add_filter('authenticate', 'StorageConnector::authenticateFilter', 10000, 3);
  }
  public static function authenticateFilter($authUser, $username, $passwd){
    if(is_wp_error($authUser) || is_null($authUser)){
      error_log("Login Failure :: ".serialize($authUser));
      return new WP_Error( 'incorrect_password', sprintf( __( '<strong>ERROR</strong>: Authentication Failure. <a href="%1$s" title="Password Lost and Found">Lost your password</a>?', 'desman-connector' ),  wp_lostpassword_url() ) );
    }
    return $authUser;
  }

  public function get_installed_version() {
    if ( !is_admin() ) return false;
    $plugins = get_plugins();
    return ( !isset( $plugins[$this->plugin_basename]['Version'] ) ) ? $plugins[$this->plugin_basename]['Version'] : false;
  }

  /**
   * These functions relate to the admin screens and updating settings
   *
   **/
  public function admin_menu() {
    $icon_url = plugins_url( 'assets/img/logo.png', $this->plugin_file_path );
    $hook_suffixes[] = add_menu_page( $this->plugin_title, $this->plugin_menu_title, $this->plugin_permission, $this->plugin_slug, array( $this, 'settings_page' ), $icon_url );
    $hook_suffixes[] = add_submenu_page( $this->plugin_slug, $this->plugin_title . ": update existing media metadata", "Existing Media", $this->plugin_permission,'update-metadata', array( $this, 'generate_storage_metadata' ));
    global $submenu;
    if ( isset( $submenu[$this->plugin_slug][0][0] ) ) {
      $submenu[$this->plugin_slug][0][0] = __( 'Settings', 'desman-connector' );
    }
    do_action( 'dsman_admin_menu', $this );
    foreach ( $hook_suffixes as $hook_suffix ) {
      add_action( 'load-' . $hook_suffix , array( $this, 'plugin_load' ) );
    }
  }

  public function get_option( $key ) {
    # check object-properties before checking the wp_options
    if ( in_array($key,array('ext-endpoint','endpoint','bucket','id','secret_key')) ) {
      if ( ! is_null( $this->$key ) ) return $this->$key;
      $try_key = preg_replace("/-/","_",$key);
      if ( property_exists("StorageConnector", $try_key) && ! is_null($this->$try_key) ) return $this->$try_key;
    }
    # now try out the options table as a fallback
    if ( is_null ($this->options) ) $this->options = get_option($this->optgroup);
    if ( !array_key_exists('ext-endpoint',$this->options) ) $this->options['ext-endpoint'] = $this->options['endpoint'];
    if ( array_key_exists($key,$this->options) ) return $this->options[$key];
    switch ( $key ) {
      case 'copy-to-s3':
      return intval($this->options['options'] & self::OPTION_COPY_TO_S3);
      break;
      case 'serve-from-s3':
      return intval($this->options['options'] & self::OPTION_SERVE_FROM_S3);
      break;
      case 'wp-uploads':
      return intval($this->options['options'] & self::OPTION_WP_UPLOADS);
      break;
      case 'remove-local-copy':
      return intval($this->options['options'] & self::OPTION_REMOVE_LOCALS);
      break;
      case 'force-ssl':
      return intval($this->options['options'] & self::OPTION_FORCE_SSL);
      break;
      case 'object-versioning':
      return intval($this->options['options'] & self::OPTION_VERSIONING);
      break;
      case 'expiration-header':
      return intval($this->options['options'] & self::OPTION_EXPIRATION_HEADER);
      break;
      case 'hidpi-images':
      return intval($this->options['options'] & self::OPTION_HIDPI);
      break;
      default:
      return '';
      break;
    }
  }

  # overloads the global wp function to update_options and writes options to a serialized array in wp_options table
  # we need to rewrite the whole array each time so this just makes it easier to do
  public function update_option( $key, $value ) {
    if ( is_null( $this->options) ) $this->options = get_option($this->optgroup);
    if ( array_key_exists($key, $this->options) ) {
      $this->options[$key] = $value;
    } else {
      $options = $this->options['options'];
      switch( $key ) {
        case 'copy-to-s3':
        $options = intval($options | self::OPTION_COPY_TO_S3);
        break;
        case 'serve-from-s3':
        $options = intval($options | self::OPTION_SERVE_FROM_S3);
        break;
        case 'wp-uploads':
        $options = intval($options | self::OPTION_WP_UPLOADS);
        break;
        case 'remove-local-copy':
        $options = intval($options | self::OPTION_REMOVE_LOCALS);
        break;
        case 'force-ssl':
        $options = intval($options | self::OPTION_FORCE_SSL);
        break;
        case 'object-versioning':
        $options = intval($options | self::OPTION_VERSIONING);
        break;
        case 'expiration-header':
        $options = intval($options | self::OPTION_EXPIRATION_HEADER);
        break;
        case 'hidpi-images':
        $options =  intval($options | self::OPTION_HIDPI);
        break;
        default:
        break;
      }
      $this->options['options'] = $options;
    }
    update_option($this->optgroup,$this->options);
  }

  # since most of our configuration options are bitmasked, this function retrieves a listing of the logical names
  private function keys() {
    return array(
      'id',
      'secret',
      'bucket',
      'endpoint',
      'ext-endpoint',
      'prefix',
      'copy-to-s3',
      'serve-from-s3',
      'remove-local-copy',
      'force-ssl',
      'object-versioning',
      'expiration-header',
      'wp-uploads'
      );
  }
  // a couple of view rendering functions (menu link callbacks)

  public function generate_storage_metadata() {
    if ( $view = $this->render_view('update-metadata') ) {
      
    } # else show errors
  }

  public function settings_page() {
    $this->render_view('settings'); # $this->plugin_dir_path .'/views/settings.php';
  }


  # load up admin screends and handle post requests
  public function plugin_load() {
    $css = plugins_url( 'assets/css/styles.css' , $this->plugin_file_path );
    wp_enqueue_style( 'dsman-styles', $css, array(), $this->get_installed_version() );
    $suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';
    $js = plugins_url( 'assets/js/script' . $suffix . ".js", $this->plugin_file_path );
    wp_enqueue_script( 'dsman-script' , $js, array('jquery'),$this->get_installed_version() );
    wp_localize_script( 'dsman-script', 'dsman_i18n',array(
      'create_bucket_prompt' => __("Bucket: ",'dsman'),
      'create_bucket_error' => __("Error Creating Bucket",'dsman'),
      'create_bucket_nonce' => wp_create_nonce('dsman-create-bucket')
      ));
    $this->handle_post_request();
  }
  public function wp_get_attachment_url( $url , $post_id ) {
    if ( $s3_url = $this->get_attachment_url ( $post_id ) ) return $s3_url;
    else return $url;
  }

  public function handle_post_request() {
    if ( empty($_POST['action']) ) return;
    switch( $_POST['action'] ) {
      case 'save':
      if ( empty($_POST['_wpnonce'] ) || !wp_verify_nonce( $_POST['_wpnonce'],'dsman-save-settings' ) ) return $this->__die();
      $keys = $this->keys();
      foreach ( $keys as $key ) {
        if ( !isset($_POST[$key] ) ) continue;
        $this->update_option($key,$_POST[$key]);
      }
      break;
      case 'update-metadata':
      if ( wp_verify_nonce( $_POST['_wpnonce'], 'dsman-update-metanonce' ) ) {
        $this->update_existing_metadata();
        break;
      }
      default:
      trigger_error(sprintf("Action %s is not supported by DeSMan Connector Plugin at this time",$_POST['action']));
      break;
    }
    return wp_redirect('admin.php?page='.$this->plugin_slug.'&updated=1');
  }
  
  public function verify_ajax_request() {
    if ( !is_admin() || !wp_verify_nonce( $_POST['_nonce'], $_POST['action'] ) ) return $this->__die();
    if ( !current_user_can('manage_options' ) ) wp_die(__('You do not have access to make changes on this page','dsman'));
    return true;
  }
  # json response for ajax request to create a bucket
  public function ajax_create_bucket() {
    if ( $this->verify_ajax_request() ) {
      $out = array();
      if ( !isset( $_POST['bucket_name'] ) || ! $_POST['bucket_name'] ) wp_die(__( 'No bucket name provided.','dsman') );
      $result = $this->create_bucket( $_POST['bucket_name'] );
      if ( is_wp_error( $result ) ) $out['error'] = $result->get_error_message();
      else $out['success'] = 1;
      $out['_nonce'] = wp_create_nonce('dsman-create-bucket');
      echo json_encode($out);
    }
    exit;
  }

  /**
   * These functions actually USE the S3 protocol
   *
   **/

  # creates an Aws\S3\S3Client object using the configured options
  public function getClient() {
    if ( is_null($this->s3Client ) ) {
      $opts = array(
        'key' => $this->id,
        'secret' => $this->secret_key,
        'base_url' => $this->endpoint
        );
      $this->Aws = Aws::factory($opts);
      $this->s3Client = $this->Aws->get('s3');
    }
    return $this->s3Client;
  }

  # return a listing of buckets
  public function getBuckets() {
    try {
      $return = $this->getClient()->listBuckets();
    } catch (Exception $e ) {
      return new WP_Error('exception', $e->getMessage());
    }
    return $return['Buckets'];
  }
  #
  # creates a bucket
  public function create_bucket( $bucket_name ) {
    try {
      $this->getClient()->createBucket(array('Bucket' => $bucket_name) );
    } catch (Exception $e) {
      return new WP_Error( 'exception' , $e->getMessage() );
    }
    return true;
  }
  public function delete_attachment( $post_id ) {
    if ( $this->error ) return;
    $backup_sizes = get_post_meta( $post_id , '_wp_attachment_backup_sizes', true);
    $intermediates = array();
    foreach ( get_intermediate_image_sizes() as $size ) {
      if ( $intermediate = image_get_intermediate_size( $post_id, $size ) )
        $intermediates[] = $intermediate;
    }
    if ( ! ( $s3 = $this->get_info( $post_id ) ) ) return;
    $key_path = dirname( $s3['key'] );
    $objects = array();
    foreach( $intermediates as $intermediate ) {
      $objects[] = array(
        'Key' => path_join( $key_path, $intermediate['file'] )
        );
    }
    # something may need to be done if a backup plugin is used
    #
    if ( $objects ) {
      $hidpi = array();
      $objects[] = array( 'Key' => $s3['key'] );
      $error = 0;
      foreach ( $objects as $obj ) {
        # we don't really care about logging errors for hidpi images
        try { 
          # if we use default_bucket here we will no longer be able to
          # allow users to create buckets. This is not something many users
          # do currently, but it could be useful in the future
          $this->getClient()->deleteObject( array(
            'Key' => $this->get_hidpi_file_path( $obj['Key'] ),
            'Bucket' => $this->bucket
            ));
        } catch (Exception $e) {}

        # but we should be logging failures here
        try {
          $this->getClient()->deleteObject( array(
            'Key' => $obj['Key'],
            'Bucket' => $this->bucket
            ));
        } catch ( Exception $e ) {
          # trigger_error( 'Error removing files from S3: ' . $e->getMessage() );
          error_log( 'Failed to remove '.$obj['Key']. ' from S3: ' . $e->getMessage() );
          $error++;
        }
      }
      if ( $error > 0 ) return false;
    }
    delete_post_meta( $post_id, 'amazonS3_info' );
  }


  /**
   * These functions are used to manipulate existing postmeta content and make sure that wordpress
   * can create the expected urls for object-storage uploaded content
   **/
  public function insert_metadata( $attachment ) {
    global $wpdb;
    $sql = "INSERT INTO $wpdb->postmeta ( post_id , meta_key, meta_value ) VALUES ( %d, 'amazonS3_info', %s);";
    try {
      $target = UPLOADS . "/$attachment->meta_value";
      $meta_value = serialize(array('bucket' => $this->bucket, 'key' => $target));
      return (int) $wpdb->query($wpdb->prepare($sql,$attachment->id, $meta_value));
    } catch( Exception $e ) {
      trigger_error($e->getMessage());
      return false;
    }
  }
  public function update_existing_metadata($old_post=null, $new_post=null) {
    global $wpdb;
    if ($new_post) {
      $attached_file_query = "SELECT post_id as id, meta_value from $wpdb->postmeta where meta_key = '_wp_attached_file' and post_id = %d";
      $attachment = $wpdb->get_row($wpdb->prepare($attached_file_query, $new_post));
      if ($attachment){
        $this->insert_metadata($attachment);
      }
      return;
    }
    $attachments = $this->get_attachments();
    $already_set = "SELECT count(*) from $wpdb->postmeta where post_id = %d AND meta_key = 'amazonS3_info';";
    $count = count($attachments);
    $counter = 0;
    foreach ( $attachments as $media ) {
      $has_been = $wpdb->get_var($wpdb->prepare($already_set,$media->id));
      if ( $has_been ) continue;
      $counter += $this->insert_metadata($media);
    }
    wp_die("Updated $counter/$count media objects metadata. <a href='admin.php?page=update-metadata&updated=1'>Back to Storage Settings</a>");
  }
  public function update_wpml_metadata($master_post, $lang, $post_array, $duplicate_id){
      global $wpdb;
      $sql = "select ID from $wpdb->posts where post_parent = %d";
      $ids = $wpdb->get_results($wpdb->prepare($sql, $duplicate_id));
      foreach ($ids as $an_id) {
          $this->update_existing_metadata(null, $an_id->ID);
      }
  }

  public function get_attachments() {
    global $wpdb;
    return $wpdb->get_results("
      select post.id, meta.meta_value from 
      $wpdb->posts post join 
      $wpdb->postmeta meta on 
      post.id = meta.post_id where 
      post.post_type = 'attachment' and meta.meta_key = '_wp_attached_file' and (select count(*) from wp_postmeta where post_id = post.id and meta_key = 'amazonS3_info') = 0 limit 10000;
      ");
  }

  public function get_info( $post_id ) {
    return get_post_meta($post_id, 'amazonS3_info', true);
  }
  public function wp_calculate_image_srcset($sources, $size_array, $image_src, $image_meta, $attachment_id){
    $main = parse_url($image_src);
    $source_out = array();
    foreach($sources as $size => $info){
      $info['url'] = sprintf('//%s%s/%s', $main['host'], dirname($main['path']), basename(parse_url($info['url'], PHP_URL_PATH)));
      $source_out[$size] = $info;
    }
    return $source_out;
  }

  public function get_attachment_url( $post_id, $expires = null ) {
    $host = parse_url($this->ext_endpoint,PHP_URL_HOST);
    if ( !$this->general_options['serve-from-s3'] || !( $s3 = $this->get_info($post_id) ) ) return false;
    $bucket = ""; 
    $scheme = "http";
    $key = $s3['key'];
    if ( is_ssl() || $this->general_options['force-ssl'] ) {
      $scheme .= "s";
    }
    $bucket = "$host/".$this->bucket;
    $url = "$scheme://$bucket/$key";
    if ( !is_null ($expires) ) {
      try {
        $expires = time() + $expires;
        $secure_url = $this->getClient()->getObjectUrl( $this->bucket,$s3['key'],$expires );
        $url .= substr( $secure_url , $strpos( $secure_url,'?') );
      } catch ( Exception $e ) {
        return new WP_Error('exception' , $e->getMessage());
      }
    }
    return apply_filters( 'dsman_get_attachment_url', $url, $s3, $post_id, $expires );
  }
  public function gen_metadata( $data, $post_id ) {
    if ( !$this->general_options['copy-to-s3'] ) return $data;
    $time = $this->get_folder_time( $post_id );
    $time = date('Y/m',$time );
    $prefix = ltrim( trailingslashit( $this->prefix ), '/' );
    $prefix .= ltrim( trailingslashit( $this->get_dynamic_prefix( $time ) ),'/');
    if ( $this->general_options['object-versioning'] ) $prefix .= $this->get_version_string( $post_id );
    $type = get_post_mime_type( $post_id );
      # exit(json_encode(array("response" => "Here we go!",'prefix' => $prefix,'data' => $data, 'post' => $post_id)));
    $file_path = get_attached_file( $post_id, true );
    if ( file_exists($file_path) ) {
      # acl setup here
      $additional = array();
      $acl = 'public-read';
      $file_name = basename ( $file_path ) ;
      $remove = array( $file_path );
      $client = $this->getClient();
      $args = array(
        'Bucket' => $this->bucket,
        'Key' => $prefix. $file_name,
        'SourceFile' => $file_path,
        'ACL' => $acl
        );
      if ( $this->general_options['expiration-header'] ) $args['Expires'] = date( 'D, d M Y H:i:s T', time()+315360000);
      try {
        $success = $client->putObject($args);
        delete_post_meta( $post_id , 'amazonS3_info' );
        add_post_meta( $post_id , 'amazonS3_info', array(
          'bucket' => $this->bucket,
          'key' => $prefix.$file_name
          ));
      } catch( Exception $e ) {
        error_log( "Error uploading $file_path to S3: ". $e->getMessage() );
        return $data;
      }
      if ( isset( $data['thumb'] ) && $data['thumb'] ) {
        $path = str_replace( $file_name, $data['thumb'], $file_path );
        $additional[] = array(
          'Key' => $prefix.$data['thumb'],
          'SourceFile' => $path
          );
        $remove[] = $path;
      } elseif ( !empty( $data['sizes'] ) ) {
        foreach( $data['sizes'] as $size ) {
          $path = str_replace( $file_name, $size['file'], $file_path );
          $additional[] = array(
            'Key' => $prefix.$size['file'],
            'SourceFile' => $path
            );
          $remove[] = $path;
        }
      }
      if ( $this->general_options['hidpi-images']) {
        $images = array();
        foreach( $additional as $image ) {
          $hidpi_path = $this->get_hidpi_file_path( $image['SourceFile'] );
          if ( file_exists( $hidpi_path ) ) {
            $images[] = array(
              'Key' => $this->get_hidpi_file_path( $image['Key'] ),
              'SourceFile' => $hidpi_path
              );
            $remove[] = $hidpi_path;
          }
        }
        $additional = array_merge($additional, $images);
      }
      foreach( $additional as $image ) {
        try {
          $args = array_merge( $args, $image );
          $client->putObject($args);
        } catch( Exception $e ) {
          trigger_error( "Error Uploading ". $args["SourceFile"]. " to S3: " . $e->getMessage() );
        }
      }
      if ( $this->general_options['remove-local-file'] ) $this->remove_local($remove);
    }
    return $data;
  }
  public function get_folder_time( $post_id ) {
    $time = current_time( 'timestamp' );
    try {
      $attach = get_post($post_id);
      if ( is_object($attach) && $attach->post_parent) {
        $post = get_post( $attach->post_parent );
        if ( is_object($post) && ( substr( $post->post_date_gmt, 0, 4 ) > 0 ) )
          return strtotime( $post->post_date_gmt. '+0000');
      }
    } catch( Exception $e ) {
      trigger_error($e->getMessage(), E_USER_ERROR);
    }
    return $time;
  }
  # timestamped upload paths (for object-versioning)
  public function get_dynamic_prefix( $time = null ) {
    $uploads = wp_upload_dir( $time );
    return str_replace( $this->get_base_upload_path(), '', $uploads['path'] );
  }

  private function get_hidpi_file_path( $path ) {
    $x = pathinfo($path);
    return $x['dirname']. "/". $x['filename']. "@2x.".$x['extension'];
  }

  private function get_version_string( $post_id ) {
    $fmt = 'YmdHis';
    $time = $this->get_folder_time( $post_id );
    $ver = date( $fmt, $time ) . "/";
    return $ver;
  }

  # returns the fully qualified current upload path   
  public function get_base_upload_path() {   
    if ( defined( 'UPLOADS' ) && ! ( is_multisite() && get_site_option( 'ms_files_rewriting' ) ) ) {
      return ABSPATH . UPLOADS;
    }

    $upload_path = trim( get_option( 'upload_path' ) );

    if ( empty( $upload_path ) || 'wp-content/uploads' == $upload_path ) {
      return WP_CONTENT_DIR . '/uploads';
    } elseif ( 0 !== strpos( $upload_path, ABSPATH ) ) {
      // $dir is absolute, $upload_path is (maybe) relative to ABSPATH
      return path_join( ABSPATH, $upload_path );
    } else {
      return $upload_path;
    }
  }
  private function remove_local( $paths = array() ) {
    foreach ( $paths as $path ){
      if ( !@unlink( $path ) ) trigger_error( 'Error removing local file ' . $path );
    }
  }
  private function __die() {
    return wp_die(__("This plugin was not meant to be used in that fashion!",'dsman'));
  }
  private function render_view( $template , $args = array() ) {
    try {
      extract($args);
      # if header exists render it
      include $this->plugin_dir_path . "/view/$template.php";
      # if footer exists render it
    } catch (Exception $e) {
      return new WP_Error( 'exception' , $e->getMessage() );
    }
    return true;
  }
}
