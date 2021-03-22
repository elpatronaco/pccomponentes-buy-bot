#!/bin/bash

pccomponentes_email=${pccomponentes_email:-}
pccomponentes_password=${pccomponentes_password:-}

coolmod_email=${coolmod_email:-}
coolmod_password=${coolmod_password:-}

ldlc_email=${ldlc_email:-}
ldlc_password=${ldlc_password:-}

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
        # echo $1 $2 // Optional to see the parameter:value result
   fi

  shift
done

cd src

# Setting credentials
json -I -f data.json -e "this.pccomponentes.email='$pccomponentes_email'"
json -I -f data.json -e "this.pccomponentes.password='$pccomponentes_password'"

json -I -f data.json -e "this.coolmod.email='$coolmod_email'"
json -I -f data.json -e "this.coolmod.password='$coolmod_password'"

json -I -f data.json -e "this.ldlc.email='$ldlc_email'"
json -I -f data.json -e "this.ldlc.password='$ldlc_password'"

# Setting test mode
json -I -f data.json -e "this.test=true"

echo "Updated emails and passwords in data.json"

less data.json
