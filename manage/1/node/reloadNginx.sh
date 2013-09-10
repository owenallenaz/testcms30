#!/bin/bash

node buildNginxConfig.js
nginx -s reload