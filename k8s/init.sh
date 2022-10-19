# Initialization for PRODUCTION environment

## setup the google cloud via the cloud terminal
gcloud config set project cs3219-365909
gcloud config set compute/zone asia-southeast1-a
gcloud container clusters get-credentials cs3219-cluster

## Create secrets (actual secrets will not be the following)
kubectl create secret generic access-token-secret --from-literal ACCESS_TOKEN_SECRET=7c0dd92cafc2537595f48eca543a45e38e25b0322c558b8cb44907db49726b54a0809709c4491cbc086187009367ac4febfb8d5db310320c16d510818d833ad9
kubectl create secret generic refresh-token-secret --from-literal REFRESH_TOKEN_SECRET=d094b5d45a93e9b1f9bc6dee9aff27e26bf7a875333db0df955415e87151c16a49a72b6ee85ce483e6a243a0fbf8b93989dc150cacdd970c29053a650d4fb908
kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=postgres

## Install Helm https://helm.sh/docs/intro/install/#from-script
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh

## Install ingress-nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install my-release ingress-nginx/ingress-nginx

## Install https cert manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.8.0 \
  --set installCRDs=true

## get certificates
kubectl get certificates
kubectl describe certificates

################################################################################################################
################################################################################################################

# Initialization for LOCAL environment
kind create cluster --name kind-1 --config k8s/kind/cluster-config.yaml

## Create secrets (actual secrets will not be the following)
kubectl create secret generic access-token-secret --from-literal ACCESS_TOKEN_SECRET=7c0dd92cafc2537595f48eca543a45e38e25b0322c558b8cb44907db49726b54a0809709c4491cbc086187009367ac4febfb8d5db310320c16d510818d833ad9
kubectl create secret generic refresh-token-secret --from-literal REFRESH_TOKEN_SECRET=d094b5d45a93e9b1f9bc6dee9aff27e26bf7a875333db0df955415e87151c16a49a72b6ee85ce483e6a243a0fbf8b93989dc150cacdd970c29053a650d4fb908
kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=postgres

## Install ingress-nginx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

## Apply all manifests

# (Note that may need to wait a few minutes for the above ingress-nginx to be ready)
# use the following to check status
kubectl -n ingress-nginx get deploy
# finally apply all
kubectl apply -f k8s/manifests
# check status (Took about 4 mintues for me)
kubectl get all
# visit http://localhost !!!!

## Clean up
# delete deployments
kubectl delete -f k8s/manifests
# delete ingress-nginx
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
# delete kind cluster
kind delete cluster --name kind-1
