FROM stanleyrya/alpine-node
MAINTAINER Ryan Stanley <ryan.stanley@alum.cs.umass.edu>

COPY . /src

WORKDIR /src

RUN npm install

CMD ["npm", "start"]
