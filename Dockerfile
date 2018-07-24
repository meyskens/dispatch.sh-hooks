ARG ARCHREPO
FROM ${ARCHREPO}/node:10-stretch

ARG QEMU_ARCH
COPY qemu-${QEMU_ARCH}-static /usr/bin/

COPY ./ /opt/hooks/
WORKDIR /opt/hooks/

RUN npm install

ENV DOCKER_TOKEN=""
ENV MONGODB_HOST=""
ENV MONGODB_DB=""
ENV HELMET_URL=""
ENV HELMET_TOKEN=""

CMD node app.js