
## Frontend
kubectl apply -f k8s/manifests/frontend-deployment.yaml
kubectl apply -f k8s/manifests/frontend-cluster-ip-service.yaml

## User Service
kubectl apply -f k8s/manifests/mongo-deployment.yaml
kubectl apply -f k8s/manifests/mongo-cluster-ip-service.yaml

kubectl apply -f k8s/manifests/redis-deployment.yaml
kubectl apply -f k8s/manifests/redis-cluster-ip-service.yaml

## Secrets
kubectl create secret generic access-token-secret --from-literal ACCESS_TOKEN_SECRET=7c0dd92cafc2537595f48eca543a45e38e25b0322c558b8cb44907db49726b54a0809709c4491cbc086187009367ac4febfb8d5db310320c16d510818d833ad9
kubectl create secret generic refresh-token-secret --from-literal REFRESH_TOKEN_SECRET=d094b5d45a93e9b1f9bc6dee9aff27e26bf7a875333db0df955415e87151c16a49a72b6ee85ce483e6a243a0fbf8b93989dc150cacdd970c29053a650d4fb908
kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=postgres

## User
kubectl apply -f k8s/manifests/user-deployment.yaml
kubectl apply -f k8s/manifests/user-cluster-ip-service.yaml

## Question
kubectl apply -f k8s/manifests/postgres-deployment.yaml
kubectl apply -f k8s/manifests/postgres-cluster-ip-service.yaml
kubectl apply -f k8s/manifests/postgres-persistent-volume-claim.yaml

kubectl apply -f k8s/manifests/question-deployment.yaml
kubectl apply -f k8s/manifests/question-cluster-ip-service.yaml

## Room
kubectl apply -f k8s/manifests/room-deployment.yaml
kubectl apply -f k8s/manifests/room-cluster-ip-service.yaml

## Matching
kubectl apply -f k8s/manifests/matching-deployment.yaml
kubectl apply -f k8s/manifests/matching-cluster-ip-service.yaml

## Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl apply -f k8s/manifests/ingress-service.yaml
