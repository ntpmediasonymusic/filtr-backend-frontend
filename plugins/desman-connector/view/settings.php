<?php if ( isset( $_POST['access_key_id'] ) ) : ?>
        <div class="aws-updated">
                <p><strong>Settings saved.</strong></p>
        </div>
<?php endif; ?>

<div class="aws-content aws-settings">
<p>The settings for this plugin are <code>READ ONLY</code> at this time. This page <em>should</em> contain the credentials required to access content storage that is not part of OpenShift. If you don't see the information you need below, please submit a support request</p>
        <?php if ( $this->are_key_constants_set() ) : ?>
                <?php
                        $access_key = getenv(DESMAN_OBS_KEY_ID);
                        $access_sec = getenv(DESMAN_OBS_KEY_SECRET);
                        $dbuser = getenv(DESMAN_MYSQL_DB_USERNAME);
                        $dbpass = getenv(DESMAN_MYSQL_DB_PASSWORD);
                        $dbname = getenv(DESMAN_MYSQL_DB_NAME);
                        $dbhost = getenv(DESMAN_MYSQL_DB_HOST);
                        $domain = $_SERVER['SERVER_NAME'];
                        $baseurl = parse_url(preg_replace("/(obs|s3)\./","",S3_BASE_URL),PHP_URL_HOST);

                        # we only want to display this information for devel and stage
                        if ( preg_match("/$baseurl/",$domain ) && preg_match("/(devel|stage)/",$domain) ): ?>
                        <h3>MySQL Credential Information</h3>

                        <?php if ( $dbuser ): ?>
                                <div class="form-control">
                                        <form class="form">
                                                <div class="form-control-group">
                                                <label for="dbuser"><strong><?php echo __("Username: "); ?></strong>
                                                        <input name="dbuser" class="disabled form-control" type="text" value="<?php echo $dbuser; ?>" size="50" disabled="disabled" />
                                                </label><br /><label for="dbpass"><strong><?php echo __("Password: "); ?></strong>
                                                        <input name="dbpass" class="disabled form-control" type="text" value="<?php echo $dbpass; ?>" size="50" disabled="disabled" />
                                                </label><br /><label for="dbname"><strong><?php echo __("Database: "); ?></strong>
                                                        <input name="dbname" class="disabled form-control" type="text" value="<?php echo $dbname; ?>" size="50" disabled="disabled" />
                                                </label><br /><label for="dbhost"><strong><?php echo __("Hostname: "); ?></strong>
                                                        <input name="dbhost" class="disabled form-control" type="text" value="<?php echo $dbhost; ?>" size="50" disabled="disabled" />
                                                </label>
                                                </div>
                                        </form>
                                </div>
                        <?php else: ?>
                                <div class="alert alert-warning">
                                        <p>MySQL information is only available in the devel and stage application.</p>
                                </div>
                        <?php endif; ?>


        <?php endif; ?>

        <h3>S3 Object Storage Access Keys</h3>

        <p>
                <?php _e('Please create a support request if the form below doesn\'t contain your access key id'); ?>
        </p>


        <?php wp_nonce_field( 'aws-save-settings' ) ?>
                <div class="form-control">
                        <form class="form">
                                <div class="form-control-group">
                                <input type="hidden" name="action" value="save" />
                                <label for "access_key_id"><strong><?php _e( 'Access Key ID:', 'desman-connector' ); ?></strong>
                                        <input type="text" name="access_key_id" value="<?php echo esc_attr( $this->get_access_key_id() ); ?>" size="50" disabled="disabled" />
                                </label><br /><label for="secret_access_key"><strong><?php _e( 'Secret Access Key:', 'desman-connector' ); ?></strong>
                                        <input type="text" name="secret_access_key" value="<?php echo $this->get_secret_access_key() ?: 'Not defined'; ?>" size="50" disabled="disabled" />
                                </label>

                                </div>
<?php 
/**
 * Not sure if we'll ever allow these values to be edited, but for now, we'll just hide this
    
                                <button type="submit" class="button button-primary"><?php _e( 'Save Changes', 'desman-connector' ); ?></button>
                                <?php if ( $this->get_access_key_id() || $this->get_secret_access_key() ) : ?>
                                &nbsp;<button class="button remove-keys"><?php _e( 'Remove Keys', 'desman-connector' ); ?></button>
                                <?php endif; ?>
**/

?>
                        </form>
                </div>

        <?php endif; ?>

</div>
