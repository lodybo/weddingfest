# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /weddingfest

ADD package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /weddingfest

COPY --from=deps /weddingfest/node_modules /weddingfest/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /weddingfest

COPY --from=deps /weddingfest/node_modules /weddingfest/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /weddingfest

COPY --from=production-deps /weddingfest/node_modules /weddingfest/node_modules
COPY --from=build /weddingfest/node_modules/.prisma /weddingfest/node_modules/.prisma

COPY --from=build /weddingfest/build /weddingfest/build
COPY --from=build /weddingfest/public /weddingfest/public
ADD . .

CMD ["npm", "start"]
