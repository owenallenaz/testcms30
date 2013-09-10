#!/bin/bash

. /sv/cms30/manage/1/lib.sh

# git
git=$(program_is_installed git)
if [ $git == 1 ]; then
	echo "Git already installed"
else
	echo "Installing Git"
	sudo apt-get update
	sudo apt-get install --yes --force-yes git-core
fi

# mongodb
mongo=$(program_is_installed mongo)
if [ $mongo == 1 ]; then
	echo "Mongodb already installed"
else
	echo "Installing Mongodb"
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
	echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
	sudo apt-get update
	sudo apt-get install mongodb-10gen
fi