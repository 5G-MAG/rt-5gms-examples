FROM alpine/git:2.47.2 AS source

WORKDIR /src

RUN git clone --depth 1 https://github.com/5G-MAG/rt-common-shared.git .

FROM node:20-alpine

WORKDIR /opt/simple-express-server

COPY --from=source /src/simple-express-server/package*.json ./
RUN npm ci --omit=dev

COPY --from=source /src/simple-express-server/ ./
COPY docker/simple-express-server/entrypoint.sh /usr/local/bin/simple-express-server-entrypoint.sh

RUN chmod +x /usr/local/bin/simple-express-server-entrypoint.sh \
	&& mkdir -p /etc/5gmag/ses/conf /opt/simple-express-server/public

CMD ["/usr/local/bin/simple-express-server-entrypoint.sh"]
