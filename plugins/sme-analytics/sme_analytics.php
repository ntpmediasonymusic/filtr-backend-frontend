<?php
/*
  Plugin Name: SME Analytics
  Plugin URI:
  Description: Provides functionality related to Google Tag Manager.
  Version: 1.0
  Author: 45PRESS
  Author URI: http://www.45press.com
 */
 
 /*
 * Admin Menus
 */
function sme_analytics_menu_pages() {
    add_options_page(__('SME Analytics Settings', 'sme-analytics'), __('SME Analytics', 'sme-analytics'), 'manage_options', 'sme-analytics.php', 'sme_analytics_settings_page');
}
add_action('admin_menu', 'sme_analytics_menu_pages');

 /*
 * Register Settings
 */
function sme_analytics_register_settings() {
    register_setting('sme-analytics', 'sme_analytics_gtm_container_id', 'sanitize_text_field');
}
add_action('admin_init', 'sme_analytics_register_settings');

function sme_analytics_settings_page() {
    ?>
    <div class="wrap">
        <h2><?php _e('SME Analytics Settings', 'sme-analytics'); ?></h2>
        <form method="post" action="options.php"> 
            <?php settings_fields('sme-analytics'); ?>
            <?php do_settings_sections('sme-analytics'); ?>
            <h3><?php _e('General', 'sme-analytics'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php _e('GTM Container ID', 'sme-analytics'); ?></th>
                    <td>
                        <input type="text" name="sme_analytics_gtm_container_id" value="<?php echo esc_attr(get_option('sme_analytics_gtm_container_id')); ?>" />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

 /*
 * Output analytics
 */
function sme_analytics_output() {

	$gtm_container_id = get_option('sme_analytics_gtm_container_id');
	
	if(!empty($gtm_container_id)) {
		echo '<!-- Google Tag Manager -->';
		echo "<noscript><iframe src='//www.googletagmanager.com/ns.html?id=" .esc_attr($gtm_container_id). "' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>";
		echo "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" .esc_attr($gtm_container_id). "');</script>";
		echo '<!-- End Google Tag Manager -->';
	}

}
add_action('wp_footer', 'sme_analytics_output');