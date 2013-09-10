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

# node
node=$(program_is_installed node)
if [ $node == 1 ]; then
	echo "Node already installed"
else
	echo "Installing Node"
	sudo apt-get update
	sudo apt-get install --yes --force-yes python-software-properties python g++ make
	sudo add-apt-repository -y ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install --yes --force-yes nodejs
fi

# nginx
nginx=$(program_is_installed nginx)
if [ $nginx == 1 ]; then
	echo "Nginx already installed"
else
	echo "Installing Nginx"
	sudo add-apt-repository -y ppa:nginx/stable
	sudo apt-get update
	sudo apt-get install --yes --force-yes nginx
fi

# ab
ab=$(program_is_installed ab)
if [ $ab == 1 ]; then
	echo "ab already installed"
else
	echo "Installing ab"
	sudo apt-get update
	sudo apt-get install apache2-utils
fi

# iperf
iperf=$(program_is_installed iperf)
if [ $iperf == 1 ]; then
	echo "Iperf already installed"
else
	echo "Installing Iperf"
	sudo apt-get update
	sudo apt-get install iperf
fi