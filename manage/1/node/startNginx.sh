#!/bin/bash

node /sv/cms30/manage/1/node/buildNginxConfig.js
nginx -c /sv/nginx.config
echo "Nginx Started"
