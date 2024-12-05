build:
  docker build --push -t ghcr.io/ndi-tty/frontend-2024/frontend:latest frontend
  docker build --push -t ghcr.io/ndi-tty/frontend-2024/backend:latest captcha-api

deploy:
  helmfile sync -f kubernetes/helmfile.yaml
