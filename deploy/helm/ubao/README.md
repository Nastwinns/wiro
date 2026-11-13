# Ubao Helm chart (Tier P — production)

Skeleton chart per ADR-0011: server Deployment (N replicas), Service, Ingress (sticky WebSocket), ConfigMap, Secret *reference*, NetworkPolicy, PodDisruptionBudget, ServiceAccount, optional CloudNativePG `Cluster`, optional ServiceMonitor / PrometheusRule / Grafana dashboard.

The image is a placeholder (`appVersion 0.0.0-placeholder`) until the first release.

```sh
kubectl create secret generic ubao-secrets \
  --from-literal=TOKEN_SIGNING_KEY=... --from-literal=ENCRYPTION_KEY=... \
  --from-literal=S3_ACCESS_KEY=... --from-literal=S3_SECRET_KEY=... --from-literal=DATABASE_URL=...
helm install ubao deploy/helm/ubao -n ubao --create-namespace \
  --set publicUrl=https://ubao.example.org --set ingress.host=ubao.example.org
helm lint deploy/helm/ubao && helm template ubao deploy/helm/ubao
```
- HA: `replicaCount >= 2`, `pdb`, topology spread; keep cookie/IP affinity on the Ingress (nginx annotations are added when `className: nginx`; configure the equivalent on other controllers).
- `cnpg.enabled=true` needs the CloudNativePG operator (Apache-2.0) installed first; the app reads `<fullname>-db-app` secret key `uri`. Verify the exact secret name against your operator version.
- Air-gapped: set `image.digest`, `cnpg.imageName`, `imagePullSecrets` to your private registry (see `deploy/airgap`).
- Secrets: never in `values.yaml`; use External Secrets / Sealed Secrets.
