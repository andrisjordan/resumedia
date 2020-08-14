FROM node:12.16.3

# for caching optimisations
COPY package*.json /
RUN npm install

COPY . /app
WORKDIR /app

ENV PATH=/node_modules/.bin:$PATH

EXPOSE 5000

CMD ["npm", "start"]
