#!/usr/bin/env python3
"""Alignement mot à mot par DTW (méthode « aeneas ») : synthèse espeak-ng du texte du script,
mot par mot, puis alignement MFCC de la synthèse sur la vraie voix. Les frontières tombant
près d'un silence sont recalées sur ce silence. Sans modèle de reconnaissance à télécharger.

Dépendances : espeak-ng, ffmpeg, numpy, librosa.
Usage : aligner_dtw.py voix.wav script.txt sortie.json
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import librosa
sys.path.insert(0, os.path.dirname(__file__))
from aligner import tokens, silences

SR = 16000
HOP = 160  # 10 ms


def synth(word, rate, tmp):
    p = os.path.join(tmp, "w.wav")
    subprocess.run(["espeak-ng", "-v", "fr", "-s", str(rate), "-w", p, word], check=True, capture_output=True)
    y, _ = librosa.load(p, sr=SR)
    y, _ = librosa.effects.trim(y, top_db=35)
    return y


def feats(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=13, hop_length=HOP, n_fft=400)
    m = (m - m.mean(axis=1, keepdims=True)) / (m.std(axis=1, keepdims=True) + 1e-6)
    return m


def main(wav, txt, sortie, rate=175):
    toks = tokens(open(txt, encoding="utf-8").read())
    real, _ = librosa.load(wav, sr=SR)
    sil, dur = silences(wav)
    tmp = tempfile.mkdtemp()
    parts, bounds, cur = [], [], 0
    for t in toks:
        y = synth(t["text"].replace("-", " "), rate, tmp)
        bounds.append((cur, cur + len(y)))
        parts.append(y); cur += len(y)
        gap = {0: 0.02, 1: 0.18, 2: 0.4}[t["punct"]]
        g = np.zeros(int(gap * SR)); parts.append(g); cur += len(g)
    synth_y = np.concatenate(parts)
    A, B = feats(synth_y), feats(real)
    D, wp = librosa.sequence.dtw(X=A, Y=B, metric="cosine", step_sizes_sigma=np.array([[1, 1], [0, 1], [1, 0]]),
                                 weights_add=np.array([0, 0, 0]), weights_mul=np.array([1, 1, 1]))
    wp = wp[::-1]
    mp = np.zeros(A.shape[1])
    for i, j in wp:
        mp[i] = j  # dernier j atteint pour chaque trame de synthèse
    # moyenne des j pour chaque i (plus stable)
    acc = {}
    for i, j in wp:
        acc.setdefault(i, []).append(j)
    for i, js in acc.items():
        mp[i] = float(np.mean(js))

    def tmap(sample):
        f = min(int(sample / HOP), len(mp) - 1)
        return mp[f] * HOP / SR

    def snap(t, kind):
        # recale un début/fin de mot sur le bord d'un silence proche (< 0.18 s)
        best, bd = t, 0.18
        for s, e in sil:
            edge = e if kind == "start" else s
            if abs(edge - t) < bd:
                best, bd = edge, abs(edge - t)
        return best

    words = []
    for t, (a, b) in zip(toks, bounds):
        st, en = tmap(a), tmap(b)
        words.append({"text": t["text"], "start": round(snap(st, "start"), 3), "end": round(snap(en, "end"), 3), "punct": t["punct"]})
    # un mot court ne dure pas 1 s : si le début est trop tôt (rire, souffle), on le rapproche du mot suivant
    from aligner import syllabes
    for k in range(len(words) - 1):
        maxd = 0.2 + 0.14 * syllabes(words[k]["text"])
        if words[k + 1]["start"] - words[k]["start"] > maxd + 0.25 and words[k]["punct"] == 0:
            words[k]["start"] = round(words[k + 1]["start"] - maxd, 3)
    for k in range(1, len(words)):
        if words[k]["start"] < words[k - 1]["start"] + 0.05:
            words[k]["start"] = round(words[k - 1]["start"] + 0.05, 3)
    json.dump({"duration": dur, "words": words, "method": "espeak-dtw"}, open(sortie, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(words)} mots alignés (DTW), synthèse {len(synth_y)/SR:.1f}s vs voix {dur:.1f}s")


if __name__ == "__main__":
    main(*sys.argv[1:4])
