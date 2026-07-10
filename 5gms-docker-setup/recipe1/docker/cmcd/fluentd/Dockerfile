FROM alpine/git AS source

ARG CMCD_TOOLKIT_REF=a3b8ab7ebd8b492bb8a944b71b011e5d49224318

RUN git clone https://github.com/5G-MAG/cmcd-toolkit.git /cmcd-toolkit && \
    git -C /cmcd-toolkit checkout ${CMCD_TOOLKIT_REF}

FROM fluent/fluentd:v1.16-1

USER root

COPY --from=source /cmcd-toolkit/fluentd/fluent.conf /fluentd/etc/fluent.conf

RUN fluent-gem install fluent-plugin-influxdb && \
    chown -R fluent:fluent /fluentd/etc /fluentd/log && \
    rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

USER fluent
