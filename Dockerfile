FROM node:lts AS builder
ARG PROVIDER_SOCKET=ws://127.0.0.1:9944
ENV REACT_APP_PROVIDER_SOCKET=$PROVIDER_SOCKET

WORKDIR /cockpit
COPY . /cockpit

RUN yarn install
RUN yarn build

FROM nginx:stable-alpine

COPY --from=builder /cockpit/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
