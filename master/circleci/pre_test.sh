#/!bin/bash

rm -rf $HOME/.node-gyp
rm -rf node_modules
rm -rf $HOME/.yarn-cache

g++ -v
gcc -v

# sudo apt-key list | grep "expired:" | xargs apt-key adv --keyserver keys.gnupg.net --recv-keys 
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6B73A36E6026DFCA
sudo rm /etc/apt/sources.list.d/google.list

expect -c "
set timeout 5
spawn sudo add-apt-repository ppa:ubuntu-toolchain-r/test
expect \"Press [ENTER] to continue or ctrl-c to cancel adding it\"
send \"\r\"
expect \"$\"
exit 0
"
sudo apt-get update && apt-get upgrade
sudo apt-get install -y gcc-5 g++-5

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 10
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 30

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 10
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-5 30

g++ -v
gcc -v
