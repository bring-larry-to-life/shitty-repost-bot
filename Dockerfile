FROM molecularplayground/node-js

COPY . /src

WORKDIR /src

RUN npm install

CMD ["npm", "start"]
