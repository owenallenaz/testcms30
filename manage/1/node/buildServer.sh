#!/bin/bash

bash /sv/cms30/manage/1/node/createUsers.sh
bash /sv/cms30/manage/1/node/installPackages.sh
bash /sv/cms30/manage/1/makeRepo.sh
bash /sv/cms30/manage/1/node/startServer.sh
