<?php if ( isset( $_POST['access_key_id'] ) ) : ?>
	<div class="aws-updated">
		<p><strong>Settings saved.</strong></p>
	</div>
<?php endif; ?>

<div class="aws-content aws-settings">
	<?php if ( $this->are_key_constants_set() ) : ?>
		<?php
			$access_key = DESMAN_OBS_KEY_ID;
			$access_sec = DESMAN_OBS_KEY_SECRET;
			$dbuser = DESMAN_MYSQL_DB_USERNAME;
			$dbpass = DESMAN_MYSQL_DB_PASSWORD;
			$dbname = DESMAN_MYSQL_DB_NAME;
			$dbhost = DESMAN_MYSQL_DB_HOST;
			$domain = $_SERVER['SERVER_NAME'];
			$baseurl = preg_match("/(obs|s3)/",S3_BASE_URL);

			# we only want to display this information for devel and stage
			if ( preg_match("/$baseurl/",$domain ) && preg_match("/(devel|stage)/",$domain) ): ?>
			<h3>MySQL Credential Information</h3>

			<?php if ( $dbuser ): ?>
				<div class="form-control">
					<form class="form">
						<label for="dbuser"><?php echo __("Username: "); ?>
							<input name="dbuser" class="disabled form-control" type="text" value="<?php echo $dbuser; ?>" disabled="disabled" />
						</label><label for="dbpass"><?php echo __("Password: "); ?>
							<input name="dbpass" class="disabled form-control" type="text" value="<?php echo $dbpass; ?>" disabled="disabled" />
						</label><label for="dbname"><?php echo __("Database: "); ?>
							<input name="dbname" class="disabled form-control" type="text" value="<?php echo $dbname; ?>" disabled="disabled" />
						</label><label for="dbhost"><?php echo __("Hostname: "); ?>
							<input name="dbhost" class="disabled form-control" type="text" value="<?php echo $dbhost; ?>" disabled="disabled" />
						</label>
					</form>
				</div>
			<?php endif; ?>


	<?php endif; ?>
		
	<h3>S3 Object Storage Access Keys</h3>

	<p>
		<?php _e('Please create a support request if the form below doesn\'t contain your access key id'); ?>
	</p>


	<input type="hidden" name="action" value="save" />
	<?php wp_nonce_field( 'aws-save-settings' ) ?>

	<table class="form-table">
	<tr valign="top">
		<th width="33%" scope="row"><?php _e( 'Access Key ID:', 'desman-connector' ); ?></th>
		<td><input type="text" name="access_key_id" value="<?php echo esc_attr( $this->get_access_key_id() ); ?>" size="50" autocomplete="off" /></td>
	</tr>
	<tr valign="top">
		<th width="33%" scope="row"><?php _e( 'Secret Access Key:', 'desman-connector' ); ?></th>
		<td><input type="text" name="secret_access_key" value="<?php echo $this->get_secret_access_key() ? '-- not shown --' : ''; ?>" size="50" autocomplete="off" /></td>
	</tr>
	<tr valign="top">
		<td colspan="2">
			<button type="submit" class="button button-primary"><?php _e( 'Save Changes', 'desman-connector' ); ?></button>
			<?php if ( $this->get_access_key_id() || $this->get_secret_access_key() ) : ?>
			&nbsp;<button class="button remove-keys"><?php _e( 'Remove Keys', 'desman-connector' ); ?></button>
			<?php endif; ?>
		</td>
	</tr>
	</table>

	</form>

	<?php endif; ?>

</div>
