# App builder - final container
# Rebuilding the pm2 image for ARM architecture
FROM arm64v8/node:18-alpine
# FROM node:current
ENV NPM_CONFIG_LOGLEVEL warn

# Install pm2
RUN npm install pm2@3 -g

WORKDIR /usr/shopping-list

# Database persitency mount point
RUN mkdir dbfile
VOLUME /dbfile

COPY pm2-ecosystem.json ./

# Node dependencies / install
COPY package*.json ./
RUN npm ci

# Prisma model definition / generation
ADD prisma/schema.prisma ./prisma/schema.prisma
ADD prisma/.env.example ./prisma/.env
COPY src ./src

RUN npx prisma generate

CMD [ "pm2-runtime", "start", "pm2-ecosystem.json" ]