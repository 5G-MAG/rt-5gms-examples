FROM alpine/git AS source

ARG CMCD_TOOLKIT_REF=a3b8ab7ebd8b492bb8a944b71b011e5d49224318

RUN git clone https://github.com/5G-MAG/cmcd-toolkit.git /cmcd-toolkit && \
    git -C /cmcd-toolkit checkout ${CMCD_TOOLKIT_REF}

FROM grafana/grafana

COPY --from=source /cmcd-toolkit/grafana/local-stack/datasource.yml /etc/grafana/provisioning/datasources/datasource.yml
COPY --from=source /cmcd-toolkit/grafana/local-stack/dashboards /etc/grafana/provisioning/dashboards
