#!/bin/sh
set -e
cd /var/www/html
php artisan migrate --force
exec /usr/bin/supervisord -c /etc/supervisord.conf
