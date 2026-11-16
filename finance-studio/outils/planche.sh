#!/usr/bin/env bash
# Planche de captures d'une vidéo (4 colonnes) aux instants donnés.
# Usage : planche.sh video.mp4 sortie.png t1 t2 ...
set -e
V=$1; O=$2; shift 2
T=$(mktemp -d); i=0
for t in "$@"; do ffmpeg -v error -y -ss $t -i "$V" -frames:v 1 -vf scale=270:480 "$T/$(printf %03d $i).png"; i=$((i+1)); done
ffmpeg -v error -y -pattern_type glob -i "$T/*.png" -vf "tile=4x$(( (i+3)/4 ))" -frames:v 1 "$O"
rm -rf "$T"
