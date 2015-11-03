Application Cron Jobs
======

This directory is included to allow developers to add scripts to the project which can be run at scheduled intervals using the [DeSman](https://desman.smehost.net) interface. You can write your cron jobs in any of the following languages.

+ bash
+ perl
+ php
+ python

Any files added to the directory should include the proper `shebang` line to indicate the proper interpreter to use. For shell (bash) scripts for example you would use:

```bash
#!/usr/bin/env bash

echo "test"
```

You could also use `/bin/bash` for this but using env will find bash wherever it exists on the system while calling bash directly could result in failure if it's installed in an alternative location.

File extensions don't matter since the job will scheduled to execute the file directly, but they could serve as a visual indicator if you prefer to show what language is used for your script. For example, simple shell scripts (`bash`) are commonly suffixed with a <kbd>.sh</kbd> while `perl` scripts are named with a <kbd>.pl</kbd>.

If you plan to write your task in php, keep in mind that you may need to import your desired frameworks which could be tricky since this directory is not in the normal php include path. Alternatively you could create an endpoint in your application and then use a script in this directory to call your app at the specified path using `curl` or `wget` at scheduled intervals.

```bash
#!/usr/bin/env bash

curl -sL "http://0.0.0.0:80/my-example-cron.php?now=$(date)"

```

If your framework supports running commands from the command line (`php-cli`) such as <kbd>CakePHP</kbd> or <kbd>Drupal</kbd>, you can create your tasks using the framework and then call them using a simple shell script.

```bash
#!/usr/bin/env bash

cd /var/www/repo && cake cron taskName

```

Keep in mind that these scheduled tasks are run in a newly created temporary instance of your application which will not be part of the cluster serving web traffic. As such, these tasks will need to operate on shared data such as the object-storage and database elements of your application. The only files available will be the ones that get added to the container during the build process. 
