#!/usr/bin/env python3
"""Alignement mot à mot voix <-> texte du script, sans modèle (fallback quand whisper est indisponible).

Principe : on détecte les silences (ffmpeg silencedetect), puis une programmation dynamique
répartit les mots du script dans les segments de parole en respectant la ponctuation et un
débit de parole constant. Dans chaque segment, les mots sont répartis selon leur nombre de syllabes.

Usage : aligner.py voix.wav script.txt sortie.json
"""
import json, re, subprocess, sys

VOY = "aeiouyéèêëàâäîïôöûüùœæ"


def silences(wav, noise="-35dB", d=0.12):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()[2]) + 60 * float(re.search(r"Duration: (\d+):(\d+)", out).group(2))
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    sil = []
    for k, e in enumerate(ends):
        s = starts[k] if k < len(starts) else 0.0
        sil.append((s, e))
    if len(starts) > len(ends):
        sil.append((starts[-1], dur))
    return sil, dur


def syllabes(w):
    w = w.lower()
    w = re.sub(r"(es|ent|e)$", "", w) or w
    n = len(re.findall(f"[{VOY}]+", w))
    return max(1, n)


def tokens(texte):
    texte = re.sub(r"\[[^\]]*\]", " ", texte)  # balises de jeu
    toks = []
    for m in re.finditer(r"[^\s]+", texte):
        raw = m.group(0)
        word = raw.strip(" ,.;:!?«»\"")
        if not word:
            if toks:
                toks[-1]["punct"] = max(toks[-1]["punct"], 2 if re.search(r"[.!?:;]", raw) else 1)
            continue
        p = 2 if re.search(r"[.!?:;]$", raw) else (1 if raw.endswith(",") else 0)
        toks.append({"text": word, "punct": p, "w": syllabes(word) + 0.35})
    return toks


def aligner(wav, texte):
    sil, dur = silences(wav)
    toks = tokens(texte)
    n = len(toks)
    # bornes de parole : début = fin du 1er silence s'il commence à 0
    if sil and sil[0][0] <= 0.01:
        t0 = sil[0][1]; sil = sil[1:]
    else:
        t0 = 0.0
    if sil and sil[-1][1] >= dur - 0.01:
        t1 = sil[-1][0]; sil = sil[:-1]
    else:
        t1 = dur
    B = [(t0, t0)] + sil + [(t1, t1)]  # frontières candidates (indice 0 = début, dernier = fin)
    m = len(B)
    parole = t1 - t0 - sum(e - s for s, e in sil)
    W = [0.0]
    for t in toks:
        W.append(W[-1] + t["w"])
    rate = parole / W[-1]  # s par unité de poids (estimation initiale, corrigée ci-dessous)
    INF = float("inf")

    def solve(rate):
        best = [[INF] * (n + 1) for _ in range(m)]
        back = [[None] * (n + 1) for _ in range(m)]
        best[0][0] = 0.0
        for j in range(m - 1):
            for i in range(n + 1):
                c0 = best[j][i]
                if c0 == INF:
                    continue
                skipped = 0.0
                for j2 in range(j + 1, min(m, j + 9)):
                    if j2 > j + 1:
                        s, e = B[j2 - 1]
                        L = e - s
                        skipped += 0.0 if L < 0.2 else (L - 0.2) * 25
                    seg = B[j2][0] - B[j][1] - sum(B[k][1] - B[k][0] for k in range(j + 1, j2))
                    last = j2 == m - 1
                    for i2 in range(i + 1, min(n, i + 30) + 1):
                        if last and i2 != n:
                            continue
                        exp = rate * (W[i2] - W[i])
                        c = ((seg - exp) / (0.25 + 0.15 * exp)) ** 2
                        if not last:
                            L = B[j2][1] - B[j2][0]
                            p = toks[i2 - 1]["punct"]
                            if p == 0:
                                c += 2.0 + 6.0 * max(0.0, L - 0.15)
                            elif p == 1:
                                c += 0.3 if L > 0.15 else 0.6
                            else:
                                c += 0.0 if L > 0.3 else 0.8
                        tot = c0 + c + skipped
                        if tot < best[j2][i2]:
                            best[j2][i2] = tot
                            back[j2][i2] = (j, i)
        segs = []
        j, i = m - 1, n
        while back[j][i] is not None:
            pj, pi = back[j][i]
            segs.append((pj, j, pi, i))
            j, i = pj, pi
        return best[m - 1][n], segs[::-1]

    cost, segs = solve(rate)
    out = []
    for (j, j2, i, i2) in segs:
        a, b = B[j][1], B[j2][0]
        inner = [B[k] for k in range(j + 1, j2)]  # silences internes non retenus : on les retire du temps de parole
        speech = []
        cur = a
        for s, e in inner:
            speech.append((cur, s)); cur = e
        speech.append((cur, b))
        total = sum(y - x for x, y in speech)
        wsum = W[i2] - W[i]

        def at(f):  # fraction de parole -> temps absolu
            r = f * total
            for x, y in speech:
                if r <= (y - x) + 1e-9:
                    return x + r
                r -= (y - x)
            return b
        acc = 0.0
        for k in range(i, i2):
            st = at(acc / wsum)
            acc += toks[k]["w"]
            en = at(acc / wsum)
            out.append({"text": toks[k]["text"], "start": round(st, 3), "end": round(en, 3), "punct": toks[k]["punct"]})
    return {"duration": dur, "words": out, "cost": cost}


if __name__ == "__main__":
    wav, txt, sortie = sys.argv[1:4]
    res = aligner(wav, open(txt, encoding="utf-8").read())
    json.dump(res, open(sortie, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(res['words'])} mots, durée {res['duration']:.2f}s, coût {res['cost']:.1f}")
