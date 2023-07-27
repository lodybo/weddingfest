# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl openssh-server openssh-client

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /weddingfest

ADD package.json package-lock.json postinstall.js ./
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
COPY --from=deps /weddingfest/public/tinymce /weddingfest/public/tinymce

ADD . .

# Set environment variables for the username and password
# These values will be replaced with the actual values provided at runtime
ENV REPLICATOR_SSH_USER=weddingfest-replicator
ENV SSH_PORT=3022

# Add a new user based on the provided username
RUN useradd -m -s /bin/bash $REPLICATOR_SSH_USER

# Set the password for the new user based on the provided password
RUN --mount=type=secret,id=ssh_password echo "$REPLICATOR_SSH_USER:$(cat /run/secrets/ssh_password)" | chpasswd

COPY deploy/ssh_config/server_password_auth.conf /etc/ssh/sshd_config.d/password_auth.conf
COPY deploy/ssh_config/client_password_auth.conf /etc/ssh/ssh_config.d/password_auth.conf

# Add the start script
COPY deploy/start.sh /start.sh

CMD ["/start.sh"]
