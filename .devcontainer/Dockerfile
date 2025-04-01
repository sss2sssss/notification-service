FROM node:lts-slim

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && rm -rf /var/lib/apt/lists/*

# CA certificates
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -r /var/cache/* /var/lib/apt/lists/*

# Timezone
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends tzdata procps ssh && \
    rm -r /var/cache/* /var/lib/apt/lists/*
ENV TZ=

# Setup Git and SSH
# Workaround for older Debian in order to be able to sign commits
RUN echo "deb https://deb.debian.org/debian trixie main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends -t trixie git git-man && \
    rm -r /var/cache/* /var/lib/apt/lists/*
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends -t trixie libc6 libc6-dev man && \
    rm -r /var/cache/* /var/lib/apt/lists/*
COPY .ssh.sh /root/
RUN chmod +x /root/.ssh.sh
COPY start.sh /root/
RUN chmod +x /root/start.sh

# Retro-compatibility symlink
RUN  ln -s /root/.ssh.sh /root/.windows.sh

RUN git config --global advice.detachedHead true
RUN git config --global core.autocrlf input
RUN git config --global --add safe.directory /workspace 

# Sets directories for NPM global packages
ENV NODE_PATH="/root/.npm-packages/lib/node_modules" \
    MANPATH="/root/.npm-packages/share/man"
RUN echo "prefix = /root/.npm-packages" >> /root/.npmrc && \
    chmod 600 /root/.npmrc
ENV PATH=/root/.npm-packages/bin:$PATH
# Fix ownership and permissions of anonymous volume 'node_modules'
VOLUME [ "/workspace/node_modules" ]
RUN mkdir -p /workspace/node_modules && \
    chmod 700 /workspace/node_modules

