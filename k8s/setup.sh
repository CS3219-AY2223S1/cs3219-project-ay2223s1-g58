# apply all the yaml files in the directory
kubectl apply manifests

kubectl apply ./manifests/frontend-deployment.yaml
kubectl apply ./manifests/frontend-cluster-ip-service.yaml

# create config maps for the env

# create secrets required (Acutal secrets will be different from the following)
kubectl create secret generic cs3219 --from-literal ACCESS_TOKEN_SECRET=7c0dd92cafc2537595f48eca543a45e38e25b0322c558b8cb44907db49726b54a0809709c4491cbc086187009367ac4febfb8d5db310320c16d510818d833ad9
kubectl create secret generic cs3219 --from-literal REFRESH_TOKEN_SECRET=d094b5d45a93e9b1f9bc6dee9aff27e26bf7a875333db0df955415e87151c16a49a72b6ee85ce483e6a243a0fbf8b93989dc150cacdd970c29053a650d4fb908
kubectl create secret generic cs3219 --from-literal POSTGRES_PASSWORD=postgres

# https required setup

# populate question bank
