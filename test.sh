#!/bin/bash

cd src

# Setting credentials
json -I -f data.json -e "this.pccomponentes.email='$PCCOMPONENTES_EMAIL'"
json -I -f data.json -e "this.pccomponentes.password='$PCCOMPONENTES_PASSWORD'"

json -I -f data.json -e "this.coolmod.email='$COOLMOD_EMAIL'"
json -I -f data.json -e "this.coolmod.password='$COOLMOD_PASSWORD'"

json -I -f data.json -e "this.ldlc.email='$LDLC_EMAIL'"
json -I -f data.json -e "this.ldlc.password='$LDLC_PASSWORD'"

# Setting test mode
json -I -f data.json -e "this.test=true"

echo "Updated emails and passwords in data.json"
