"""Aligne le texte du script (sans balises) sur le timing mot à mot de whisper.
Usage : python3 aligner.py <numero> <whisper.json> <sortie.json>
Le texte affiché vient du script ; les temps viennent de whisper.
Les mots non reconnus (nombres écrits en lettres…) reçoivent un temps interpolé."""
import sys, json, re, unicodedata, difflib

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z0-9]", '', s)

num, wpath, out = sys.argv[1], sys.argv[2], sys.argv[3]
readme = open(__file__.rsplit('/', 3)[0] + '/finance/README.md', encoding='utf-8').read()
m = re.search(r'### Script %s —.*?\*\*Voix off[^*]*\*\*(.*?)\n\n' % num, readme, re.S)
texte = re.sub(r'\\?\[[^\]]*\\?\]', ' ', m.group(1))
texte = texte.replace('\\', '')
mots = texte.split()

# whisper : recolle les fragments ('utilises, -pro…)
ww = []
for x in json.load(open(wpath)):
    if ww and (x['w'].startswith("'") or x['w'].startswith('-')):
        ww[-1]['w'] += x['w']; ww[-1]['e'] = x['e']
    else:
        ww.append(dict(x))

# découpe les élisions du script pour mieux matcher (l'utilises -> l utilises) : on compare sur norm du mot entier
A = [norm(w) for w in mots]
B = [norm(x['w']) for x in ww]
res = [None] * len(mots)
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1):
            res[i1 + k] = (ww[j1 + k]['s'], ww[j1 + k]['e'])
    elif tag == 'replace' or tag == 'delete':
        if j2 > j1:
            s0, e0 = ww[j1]['s'], ww[j2 - 1]['e']
        else:
            s0 = ww[j1 - 1]['e'] if j1 > 0 else 0
            e0 = ww[j1]['s'] if j1 < len(ww) else s0 + 0.3
        n = i2 - i1
        # répartit au prorata de la longueur des mots
        L = [max(2, len(A[i])) for i in range(i1, i2)]
        tot = sum(L); acc = 0
        for k in range(n):
            a = s0 + (e0 - s0) * acc / tot; acc += L[k]
            b = s0 + (e0 - s0) * acc / tot
            res[i1 + k] = (round(a, 3), round(b, 3))
mots_out = []
for w, (s, e) in zip(mots, res):
    mots_out.append({'t': w, 's': s, 'e': e})
# monotonie
for i in range(1, len(mots_out)):
    if mots_out[i]['s'] < mots_out[i-1]['s']:
        mots_out[i]['s'] = mots_out[i-1]['s']
json.dump(mots_out, open(out, 'w'), ensure_ascii=False, indent=1)
print(' '.join(f"{x['t']}@{x['s']}" for x in mots_out))
