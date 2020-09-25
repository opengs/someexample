FROM node:14.2 as carguard-camera_integrator_panel-build-stage
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build


FROM nginx:1.17.10-alpine as production-stage
COPY --from=carguard-camera_integrator_panel-build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8007
CMD ["nginx", "-g", "daemon off;"]