<?php
set_time_limit(2);
if (extension_loaded('newrelic')) {
    newrelic_ignore_transaction();
}
print 'OK';
