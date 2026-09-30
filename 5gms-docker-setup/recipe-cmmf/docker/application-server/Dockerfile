# Use Ubuntu 22.04 as a parent image
FROM ubuntu:22.04

# Install dependencies
RUN rm -rf /var/lib/apt/lists/* && apt-get clean && \
    apt-get update -o Acquire::Check-Valid-Until=false && \
    apt-get install -y \
    git \
    python3-pip \
    python3-venv \
    wget \
    default-jdk \
    && apt-get clean

# Install Openresty
RUN apt-get -y install --no-install-recommends wget gnupg ca-certificates lsb-release && \
    wget -O - https://openresty.org/package/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/openresty.gpg && \
    ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then \
        echo "deb [arch=$ARCH signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/arm64/ubuntu $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/openresty.list > /dev/null; \
    else \
        echo "deb [arch=$ARCH signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/ubuntu $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/openresty.list > /dev/null; \
    fi && \
    apt-get update  && \
    apt-get -y install openresty

# Add Openresty version of nginx to the path
ENV PATH="/usr/local/openresty/nginx/sbin:$PATH"

# Disable and stop nginx and openresty services
RUN systemctl disable --now nginx.service openresty.service || true

# Multi-Application-Server support is pending upstream review, see recipe-cmmf/Readme.md.
RUN git clone --recurse-submodules --branch feature/multi-application-server-support \
    https://github.com/5G-MAG/rt-5gms-application-server.git /5gms-application-server

# Set the working directory
WORKDIR /5gms-application-server

# Install Python dependencies
RUN python3 -m pip install --upgrade pip setuptools && \
    python3 -m pip install .

# Report healthy once the M3 port is accepting connections, so the AF (which pushes
# Content Hosting Configurations to every configured AS at startup) can wait for this.
HEALTHCHECK --interval=2s --timeout=2s --retries=30 --start-period=2s \
    CMD bash -c "(exec 3<>/dev/tcp/127.0.0.1/7777)" 2>/dev/null || exit 1

# Command to run the application
CMD ["5gms-application-server","-c","/etc/5gmag/as/conf/application-server.conf"]
