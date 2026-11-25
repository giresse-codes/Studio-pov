import sys, json, subprocess
import numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True,check=True).stdout
audio = np.frombuffer(raw, np.float32)
m = WhisperModel(sys.argv[3] if len(sys.argv)>3 else "small", device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, language="fr", word_timestamps=True, beam_size=5)
mots=[]
for s in segs:
    for w in s.words:
        mots.append({"t": w.word.strip(), "d": round(w.start,3), "f": round(w.end,3)})
json.dump(mots, open(sys.argv[2],"w"), ensure_ascii=False, indent=0)
print(len(mots))
