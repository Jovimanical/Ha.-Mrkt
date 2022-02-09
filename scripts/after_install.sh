#!/bin/bash
cd ~
sudo chown -R ubuntu /var/www/html
sudo chmod -R 0777 /var/www/html/

cd /var/www/html

npm install
#npm install pm2 -g

sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 0777 /var/www/html/