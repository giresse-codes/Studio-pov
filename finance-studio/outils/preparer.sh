#!/usr/bin/env bash
# Prépare public/ (non versionné) : voix des vidéos, sons, voix de la référence.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/finance public/voix public/sons
[ -f public/finance/reference-voix.wav ] || ffmpeg -v error -y -i ../finance/reference.mp4 -vn -ac 1 -ar 44100 public/finance/reference-voix.wav
for d in ../videos/finance-*/; do
  n=$(basename "$d")
  for ext in wav mp3; do
    [ -f "$d/voix.$ext" ] && cp -u "$d/voix.$ext" "public/voix/$n.$ext"
  done
done
cp -ru ../sons/. public/sons/
ls -R public | head -40
