FROM node:20-alpine
WORKDIR /
ADD package.json .
RUN npm i --force
ADD . .
RUN npm run build
CMD ["npm", "run", "start"]
