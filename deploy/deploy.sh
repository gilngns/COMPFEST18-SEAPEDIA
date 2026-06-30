#!/usr/bin/env bash
# Script deploy yang dijalanin di VPS oleh GitHub Actions.
# Bisa juga dijalanin manual: bash deploy/deploy.sh
set -e

echo "==> [1/5] Pull kode terbaru"
cd /var/www/seapedia
git pull origin master

echo "==> [2/5] Backend: install dep + sync schema"
cd /var/www/seapedia/SEAPEDIA-BE
npm install --omit=dev
npx prisma generate
npx prisma db push

echo "==> [3/5] Backend: restart PM2"
pm2 restart seapedia-be --update-env

echo "==> [4/5] Frontend: install dep + build"
cd /var/www/seapedia/SEAPEDIA-FE
npm install
npm run build

echo "==> [5/5] Reload Nginx (serve dist baru)"
sudo systemctl reload nginx

echo "==> Deploy selesai: $(date)"
