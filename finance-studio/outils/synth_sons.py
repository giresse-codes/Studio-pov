#!/usr/bin/env python3
"""Sons de secours générés en code, utilisés UNIQUEMENT si le fichier correspondant manque dans sons/.
(Les vrais sons à télécharger sont listés dans sons/LISTE.md.)
Usage : synth_sons.py dossier_sortie
"""
import os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def save(path, y):
    y = np.clip(y / (np.max(np.abs(y)) + 1e-9) * 0.9, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def lowpass(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def t(d):
    return np.arange(int(d * SR)) / SR


def whoosh():
    d = 0.45; tt = t(d)
    n = rng.standard_normal(len(tt))
    env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    # balayage : filtre passe-bas dont la coupure monte puis redescend
    out = np.zeros_like(n); acc = 0.0
    for i, v in enumerate(n):
        a = 0.02 + 0.25 * env[i]
        acc += a * (v - acc); out[i] = acc
    return out * env


def impact():
    d = 1.4; tt = t(d)
    f = 70 * np.exp(-tt * 3) + 38
    ph = 2 * np.pi * np.cumsum(f) / SR
    boom = np.sin(ph) * np.exp(-tt * 3.2)
    hit = lowpass(rng.standard_normal(len(tt)), 0.3) * np.exp(-tt * 28)
    return boom * 1.0 + hit * 0.8


def boing():
    d = 0.6; tt = t(d)
    f = 180 + 140 * np.exp(-tt * 6) * np.sin(2 * np.pi * 14 * tt) + 120 * tt
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 5) * np.minimum(1, tt * 200)


def pop():
    d = 0.12; tt = t(d)
    f = 900 * np.exp(-tt * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35)


def caisse():
    d = 0.9; tt = t(d)
    y = np.zeros_like(tt)
    for k, fr in enumerate([1318.5, 1760.0]):
        st = int(k * 0.08 * SR)
        seg = tt[: len(tt) - st]
        y[st:] += np.sin(2 * np.pi * fr * seg) * np.exp(-seg * 7) + 0.3 * np.sin(2 * np.pi * fr * 2.76 * seg) * np.exp(-seg * 12)
    return y


def musique(duree=80.0):
    """Boucle lo-fi douce : accords Am9 - Fmaj7 - Cmaj7 - G6, 80 bpm, kick/charleston feutrés."""
    bpm = 80; beat = 60 / bpm; bar = 4 * beat
    tt = t(duree); y = np.zeros_like(tt)
    def hz(m): return 440 * 2 ** ((m - 69) / 12)
    accords = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [48, 55, 59, 64, 67], [55, 59, 62, 64, 67]]
    basses = [45, 41, 36, 43]
    nbar = int(duree / bar) + 1
    for b in range(nbar):
        t0 = b * bar
        i0 = int(t0 * SR); i1 = min(len(tt), int((t0 + bar) * SR))
        if i0 >= len(tt): break
        seg = tt[i0:i1] - t0
        env = np.minimum(1, seg / 0.25) * np.exp(-seg * 0.35)
        ch = accords[b % 4]
        for m in ch:
            f = hz(m)
            y[i0:i1] += 0.09 * env * (np.sin(2 * np.pi * f * seg) + 0.25 * np.sin(2 * np.pi * 2 * f * seg + 0.3 * np.sin(2 * np.pi * 0.7 * seg)))
        fb = hz(basses[b % 4])
        y[i0:i1] += 0.28 * np.minimum(1, seg / 0.02) * np.exp(-seg * 0.9) * np.sin(2 * np.pi * fb * seg)
        for k in range(4):
            tk = t0 + k * beat
            j0 = int(tk * SR)
            if j0 >= len(tt): break
            if k in (0, 2):
                s = np.arange(min(int(0.35 * SR), len(tt) - j0)) / SR
                y[j0:j0 + len(s)] += 0.45 * np.sin(2 * np.pi * (50 + 60 * np.exp(-s * 30)) * s) * np.exp(-s * 9)
            for h in (0, 0.5):
                jh = int((tk + h * beat) * SR)
                if jh >= len(tt): continue
                s = np.arange(min(int(0.06 * SR), len(tt) - jh)) / SR
                y[jh:jh + len(s)] += 0.05 * rng.standard_normal(len(s)) * np.exp(-s * 70)
    # grain « vinyle » léger + lissage lo-fi
    y += 0.004 * rng.standard_normal(len(y))
    y = np.convolve(y, np.ones(6) / 6, mode="same")
    fade = np.minimum(1, tt / 1.5) * np.minimum(1, (duree - tt) / 2.0)
    return y * fade


if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for nom, fn in [("whoosh", whoosh), ("impact", impact), ("gag-boing", boing), ("pop", pop), ("caisse", caisse), ("lofi-finance", musique)]:
        save(os.path.join(out, nom + ".wav"), fn())
        print("ok", nom)
