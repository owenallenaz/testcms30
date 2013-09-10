#!/bin/bash

nginx -s stop
echo "Nginx Stopped"
/sv/cms30/forever/1/node_modules/forever/bin/forever stopall
echo "Nodes Stopped"
