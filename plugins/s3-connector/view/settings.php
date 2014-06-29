<div class="aws-content aws-settings">

	<h3>Access Keys</h3>

	<?php if ( $this->are_key_constants_set() ) : ?>

	<p>
		<?php _e( 'S3 Connector settings saved in wp-config.', 's3-connector' ); ?>
	</p>

	<?php else : ?>

	<p>
		<?php _e('Please create a support request if the form below doesn\'t contain your access key id'); ?>
	</p>

	<?php if ( isset( $_POST['access_key_id'] ) ) : ?>
	<div class="aws-updated">
		<p><strong>Settings saved.</strong></p>
	</div>
	<?php endif; ?>

	<input type="hidden" name="action" value="save" />
	<?php wp_nonce_field( 'aws-save-settings' ) ?>

	<table class="form-table">
	<tr valign="top">
		<th width="33%" scope="row"><?php _e( 'Access Key ID:', 's3-connector' ); ?></th>
		<td><input type="text" name="access_key_id" value="<?php echo esc_attr( $this->get_access_key_id() ); ?>" size="50" autocomplete="off" /></td>
	</tr>
	<tr valign="top">
		<th width="33%" scope="row"><?php _e( 'Secret Access Key:', 's3-connector' ); ?></th>
		<td><input type="text" name="secret_access_key" value="<?php echo $this->get_secret_access_key() ? '-- not shown --' : ''; ?>" size="50" autocomplete="off" /></td>
	</tr>
	<tr valign="top">
		<td colspan="2">
			<button type="submit" class="button button-primary"><?php _e( 'Save Changes', 's3-connector' ); ?></button>
			<?php if ( $this->get_access_key_id() || $this->get_secret_access_key() ) : ?>
			&nbsp;<button class="button remove-keys"><?php _e( 'Remove Keys', 's3-connector' ); ?></button>
			<?php endif; ?>
		</td>
	</tr>
	</table>

	</form>

	<?php endif; ?>

</div>
