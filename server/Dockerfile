FROM node:22
WORKDIR /app
COPY package.json /app/
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only-production; \
        fi
# RUN npm install
COPY . ./
ENV PORT=3000
EXPOSE $PORT
CMD [ "node", "server.js" ]