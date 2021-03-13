# Heavy installation done in a first stage to lighten the final container
FROM arm64v8/node:current AS node_builder
WORKDIR /usr/preparation
ENV NPM_CONFIG_LOGLEVEL warn

# Prisma CLI installation
RUN npm install -g @prisma/cli

# Node dependencies / install
COPY package*.json ./
RUN npm install --production

# Prisma model definition / generation
ADD prisma/schema.prisma ./prisma/schema.prisma
ADD prisma/.env.example ./prisma/.env
COPY src ./src

RUN npx prisma generate

# App builder - final container
# Rebuilding the pm2 image for ARM architecture
FROM arm64v8/node:current-alpine

# Install pm2
RUN npm install pm2@3 -g

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

WORKDIR /usr/shopping-list

# Copy from previous stage
COPY --from=node_builder /usr/preparation/node_modules/ ./node_modules
COPY --from=node_builder /usr/preparation/prisma/ ./prisma
COPY --from=node_builder /usr/preparation/src ./src

# Bundle APP files
COPY pm2-ecosystem.json ./

CMD [ "pm2-runtime", "start", "pm2-ecosystem.json" ]