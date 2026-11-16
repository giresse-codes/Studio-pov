#!/usr/bin/env bash
# Planche de comparaison : rangée du haut = vidéo A, rangée du bas = vidéo B, aux instants donnés.
# Usage : comparer.sh A.mp4 B.mp4 sortie.png t1 t2 ...
set -e
A=$1; B=$2; O=$3; shift 3
T=$(mktemp -d)
i=0
for t in "$@"; do
  ffmpeg -v error -y -ss $t -i "$A" -frames:v 1 -vf scale=360:640 "$T/a$i.png"
  ffmpeg -v error -y -ss $t -i "$B" -frames:v 1 -vf scale=360:640 "$T/b$i.png"
  i=$((i+1))
done
n=$i
ffmpeg -v error -y $(for k in $(seq 0 $((n-1))); do echo -n "-i $T/a$k.png "; done) $(for k in $(seq 0 $((n-1))); do echo -n "-i $T/b$k.png "; done) \
  -filter_complex "xstack=inputs=$((2*n)):layout=$(for k in $(seq 0 $((n-1))); do echo -n "$((k*360))_0|"; done)$(for k in $(seq 0 $((n-1))); do echo -n "$((k*360))_640"; [ $k -lt $((n-1)) ] && echo -n "|"; done)" "$O"
rm -rf "$T"
