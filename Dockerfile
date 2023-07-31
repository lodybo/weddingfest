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

# Create the ssh directory
RUN mkdir /root/.ssh

# Set SSH user
ENV REPLICATOR_SSH_USER root

# Save the public and private ssh key for the server
RUN --mount=type=secret,id=replicator_private_ssh_key \
  cat /run/secrets/replicator_private_ssh_key > /root/.ssh/id_rsa
RUN --mount=type=secret,id=replicator_public_ssh_key \
  cat /run/secrets/replicator_public_ssh_key > /root/.ssh/id_rsa.pub

# Add newline to the end of the private key
RUN echo "" >> /root/.ssh/id_rsa

# Set the permissions for the ssh keys
RUN chmod 700 /root/.ssh
RUN chmod 600 /root/.ssh/id_rsa

# Add the public key to the authorized keys
RUN cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys

# Set the permissions for the authorized keys
RUN chmod 600 /root/.ssh/authorized_keys

# Copy the sshd config file
COPY deploy/ssh_config/ssh_weddingfest.conf /etc/ssh/sshd_config.d/ssh_weddingfest.conf

# Copy the start script
COPY deploy/start.sh ./start.sh

# Creating privileged separation directory
RUN mkdir /run/sshd

CMD ["./start.sh"]
