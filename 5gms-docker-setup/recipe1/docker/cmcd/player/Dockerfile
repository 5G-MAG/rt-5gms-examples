FROM node:18-alpine

ARG CMCD_TOOLKIT_REF=a3b8ab7ebd8b492bb8a944b71b011e5d49224318

RUN apk add --no-cache git && \
    git clone https://github.com/5G-MAG/cmcd-toolkit.git /cmcd-toolkit && \
    git -C /cmcd-toolkit checkout ${CMCD_TOOLKIT_REF}

WORKDIR /cmcd-toolkit/player

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
