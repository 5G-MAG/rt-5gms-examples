#!/bin/sh

# Set right port and IP
m1-session configure set m1_port $M1_PORT
m1-session configure set m1_address application-function

# Run the msaf-configuration tool if the flag is set
if [ "$RUN_MSAF_CONFIGURATION_TOOL" = "true" ]; then
    msaf-configuration
else
    echo "RUN_MSAF_CONFIGURATION_TOOL flag disabled, not executing msaf configuration"
fi

# Run the management UI if the flag is set
if [ "$RUN_MANAGEMENT_UI" = "true" ]; then
    cd management-ui/
    uvicorn server:app --reload --host 0.0.0.0 --port 8000
else
    echo "RUN_MANAGEMENT_UI flag disabled, not executing management UI"
fi
