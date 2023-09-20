FROM node:16-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .

FROM base AS build
WORKDIR /build
COPY --from=base ./app .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=build ./build/package*.json ./
COPY --from=build ./build/.next ./.next
COPY --from=build ./build/public ./public
RUN npm install next

EXPOSE 3000
CMD npm run start