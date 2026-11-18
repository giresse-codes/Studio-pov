"""Timing mot à mot de la voix off.

Usage : python3 -I outils/timing.py videos/devsteach-1a/voix.wav scripts/devsteach/1a.md videos/devsteach-1a/mots.json
1. transcrit la voix avec faster-whisper (mots horodatés) -> <dossier>/whisper.json (cache)
2. aligne les mots du script (sans les balises [..]) sur ceux de whisper
3. écrit mots.json : [{"w": mot du script, "s": début, "e": fin, "p": n° de phrase}]
"""
import json, os, re, subprocess, sys, unicodedata, difflib

voix, script, out = sys.argv[1:4]
cache = os.path.join(os.path.dirname(out), "whisper.json")

if not os.path.exists(cache):
    import numpy as np
    from faster_whisper import WhisperModel
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", voix, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    m = WhisperModel(os.environ.get("WHISPER_MODEL", "medium"), device="cpu", compute_type="int8")
    segs, _ = m.transcribe(audio, language="fr", word_timestamps=True, beam_size=5)
    ws = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for sg in segs for w in sg.words]
    json.dump(ws, open(cache, "w"), ensure_ascii=False, indent=0)
ws = json.load(open(cache))

txt = open(script, encoding="utf-8").read()
bloc = re.search(r"## Voix off\s*```(.*?)```", txt, re.S).group(1)
bloc = re.sub(r"\[[^\]]*\]", " ", bloc)
toks, phr = [], []
p = 0
for ligne in bloc.splitlines():
    for t in ligne.split():
        if re.fullmatch(r"[«»:…—–-]+", t):
            continue
        if re.fullmatch(r"[?!;]+", t) and toks:
            toks[-1] += "\u00a0" + t
            if p == phr[-1]:
                p += 1
            continue
        toks.append(t)
        phr.append(p)
        if re.search(r"[.?!]$", t) or t.endswith("…"):
            p += 1
    if ligne.strip():
        p += 1 if (toks and not re.search(r"[.?!…]$", toks[-1])) else 0

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)

a = [norm(t) for t in toks]
b = [norm(w["w"]) for w in ws]
res = [None] * len(toks)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            res[i1 + k] = (ws[j1 + k]["s"], ws[j1 + k]["e"])
    elif j2 > j1:  # remplacement : on répartit le temps
        s0, e0 = ws[j1]["s"], ws[j2 - 1]["e"]
        n = i2 - i1
        for k in range(n):
            res[i1 + k] = (s0 + (e0 - s0) * k / n, s0 + (e0 - s0) * (k + 1) / n)
# trous : interpolation
for i, r in enumerate(res):
    if r is None:
        prev = next((res[j][1] for j in range(i - 1, -1, -1) if res[j]), 0)
        nxt = next((res[j][0] for j in range(i + 1, len(res)) if res[j]), prev + 0.3)
        res[i] = (prev, max(prev + 0.05, nxt))
mots = [{"w": t, "s": round(r[0], 3), "e": round(r[1], 3), "p": ph} for t, r, ph in zip(toks, res, phr)]
json.dump(mots, open(out, "w"), ensure_ascii=False, indent=1)
print(f"{len(mots)} mots, {sum(1 for x in a if x in b)} reconnus")
