place your ssl _.key and ssl _.crt files inside sslcert folder
on EC2 home directory
using volume settings on docker-compose.yml file:
-v "~/sslcert:/usr/src/app/sslcert"

without theese files server will not run.
In order for users app to open video camera device
it has to be openet from https:// address

Create ssl sertivifate steps on Ubuntu:

`openssl req -newkey rsa:4096 -x509 -sha256 -days 9999 -nodes -out ./ssl/certificate.crt -keyout ./ssl/private.key`

Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Texas
Locality Name (eg, city) []:Austin
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Library App
Organizational Unit Name (eg, section) []:QA test practice
Common Name (e.g. server FQDN or YOUR name) []:amd-linux.local
Email Address []:sobirjon001@gmail.com
