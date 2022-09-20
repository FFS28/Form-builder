# stage build
FROM node:16-alpine

WORKDIR /app

# copy everything to the container
COPY . .

# clean install all dependencies
RUN npm ci

# ENV
ENV PUBLIC_API_ROOT=""

# build SvelteKit app
RUN npm run build

# stage run
FROM node:16-alpine

WORKDIR /app

# copy dependency list
COPY --from=0 /app/package*.json ./

# clean install dependencies, no devDependencies, no prepare script
RUN npm ci --production --ignore-scripts

# copy built SvelteKit app to /app
COPY --from=0 /app/build ./

EXPOSE 3000

CMD ["node", "./index.js"]
