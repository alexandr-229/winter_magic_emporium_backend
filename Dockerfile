FROM node:20-alpine
WORKDIR /app
ADD package.json .
RUN npm i --force
ADD . .
RUN npm run build
RUN npm prune --production --force
CMD ["npm", "run", "start"]
