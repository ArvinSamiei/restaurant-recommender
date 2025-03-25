FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install

ARG VITE_API_URL
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && npm install && npm run build


RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
