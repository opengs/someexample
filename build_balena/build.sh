cd ..
docker build -t modulsoft/carguard/device_panel:latest -f Dockerfile .
cd build_balena

rm -rf dist_package.tar
rm -rf html

id=$(docker create modulsoft/carguard/device_panel:latest)
docker cp $id:/usr/share/nginx/html - > dist_package.tar
docker rm -v $id

tar -C . -xvf dist_package.tar

balena build --emulated --tag modulsoft/carguard_device_integrator_panel:rpi-1.0 --deviceType raspberrypi4 --arch aarch64 --nogitignore

docker tag build_balena_main modulsoft/carguard_device_integrator_panel:rpi-1.0