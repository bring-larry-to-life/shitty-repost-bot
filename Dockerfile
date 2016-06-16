# For x86 architectures
FROM stanleyrya/alpine-node

# For Raspberry Pi architectures
#FROM hypriot/rpi-node:6.1-slim

MAINTAINER Ryan Stanley <ryan.stanley@alum.cs.umass.edu>

COPY . /src

WORKDIR /src

RUN npm install

CMD ["npm", "start"]
