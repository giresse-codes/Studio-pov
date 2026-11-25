"""
Aligne la transcription whisper (mots + temps) sur le texte exact du script.
Usage : python3 outils/aligner.py scripts/devsteach/1.md mots-brut.json videos/devsteach-1/mots.json
Sortie : liste de phrases [{balise, mots:[{t, d, f}]}] (temps en secondes, voix originale),
         + "pause" = temps (s) où placer l'écran de choix (fin de la phrase avant [pause]).
Les balises entre crochets ne sont jamais affichées.
"""
import json, re, sys, unicodedata, difflib

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z0-9]", '', s)

script = open(sys.argv[1], encoding='utf-8').read()
bloc = re.search(r"```\n(.*?)```", script, re.S).group(1)
phrases = []
for ligne in bloc.strip().split('\n'):
    ligne = ligne.strip()
    if not ligne:
        continue
    m = re.match(r"\[([^\]]+)\]\s*(.*)", ligne)
    balise, texte = (m.group(1), m.group(2)) if m else ('', ligne)
    texte = re.sub(r"\[[^\]]*\]", ' ', texte).strip()
    # la ponctuation isolée (« : ? ! » à la française) est collée au mot voisin
    toks = []
    for t in texte.split():
        if t in ('«',) :
            toks.append(t + '\u00a0')
        elif not norm(t) and toks:
            toks[-1] = toks[-1] + '\u00a0' + t
        elif toks and toks[-1].endswith('\u00a0') and not norm(toks[-1]):
            toks[-1] = toks[-1] + t
        else:
            toks.append(t)
    phrases.append({'balise': balise, 'mots': [{'t': t} for t in toks] if toks else []})

brut = json.load(open(sys.argv[2], encoding='utf-8'))
# éclate les mots whisper composés (« l'ouvres » reste un mot ; « 1998. » ok)
w_norm = [norm(w['t']) for w in brut]
s_tokens = [(pi, mi) for pi, p in enumerate(phrases) for mi, _ in enumerate(p['mots'])]
s_norm = [norm(phrases[pi]['mots'][mi]['t']) for pi, mi in s_tokens]

sm = difflib.SequenceMatcher(a=s_norm, b=w_norm, autojunk=False)
temps = [None] * len(s_tokens)
for op, a1, a2, b1, b2 in sm.get_opcodes():
    if op == 'equal':
        for k in range(a2 - a1):
            temps[a1 + k] = (brut[b1 + k]['d'], brut[b1 + k]['f'])
    elif op == 'replace' and b2 > b1:
        # répartit les mots du script sur la plage whisper correspondante
        d, f = brut[b1]['d'], brut[b2 - 1]['f']
        n = a2 - a1
        for k in range(n):
            temps[a1 + k] = (d + (f - d) * k / n, d + (f - d) * (k + 1) / n)
# interpole les trous
for i in range(len(temps)):
    if temps[i] is None:
        prev = next((temps[j][1] for j in range(i - 1, -1, -1) if temps[j]), 0)
        nxt = next((temps[j][0] for j in range(i + 1, len(temps)) if temps[j]), prev + 0.3)
        temps[i] = (prev, max(prev + 0.05, min(nxt, prev + 0.35)))
for (pi, mi), (d, f) in zip(s_tokens, temps):
    phrases[pi]['mots'][mi]['d'] = round(d, 3)
    phrases[pi]['mots'][mi]['f'] = round(f, 3)

pause = None
for i, p in enumerate(phrases):
    if p['balise'] == 'pause':
        avant = next(q for q in reversed(phrases[:i]) if q['mots'])
        apres = next((q for q in phrases[i + 1:] if q['mots']), None)
        fin = avant['mots'][-1]['f']
        debut_suivant = apres['mots'][0]['d'] if apres else fin
        pause = round(fin + min(0.25, (debut_suivant - fin) / 2), 3)
sortie = {'pause': pause, 'phrases': [p for p in phrases if p['mots']], 'non_alignes': sum(1 for op in sm.get_opcodes() if op[0] != 'equal')}
json.dump(sortie, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for p in sortie['phrases']:
    print(f"{p['mots'][0]['d']:6.2f}-{p['mots'][-1]['f']:6.2f} [{p['balise']}] " + ' '.join(m['t'] for m in p['mots']))
print('pause :', pause)
