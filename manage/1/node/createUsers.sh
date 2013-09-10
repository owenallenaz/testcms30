#!/bin/bash

. /sv/cms30/manage/1/lib.sh

sv=$(user_exists sv)
if [ $sv == 1 ]; then
	echo "sv user exists"
else
	echo "creating sv user"
	adduser --disabled-password --gecos "sv,,," sv
	usermod -a -G admin,adm sv
fi