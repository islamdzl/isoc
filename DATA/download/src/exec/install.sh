#!/bin/bash

mkdir ~/.exec
cp -r bin ~/.exec/bin
node ~/.exec/bin/install.js
rm ~/.exec/bin/install.js
echo "node ~/.exec/bin/index.js" > ~/.exec/exec.sh
cd ~/.exec
chmod +x exec.sh
(crontab -l ; echo "@reboot /home/$USER/.exec/exec.sh") | crontab -
reboot
