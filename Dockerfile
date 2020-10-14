FROM node:12-alpine AS build
WORKDIR /app
COPY / /app
RUN npm i
RUN npm run build
RUN npm prune --production

FROM node:12-alpine
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/static /app/static
COPY --from=build /app/.nuxt /app/.nuxt
COPY --from=build /app/nuxt.config.js /app
