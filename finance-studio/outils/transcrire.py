import sys,json
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8")
import numpy as np,subprocess
raw=subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
aud=np.frombuffer(raw,np.int16).astype(np.float32)/32768
segs,_=m.transcribe(aud,language="fr",word_timestamps=True,initial_prompt=sys.argv[3] if len(sys.argv)>3 else None)
out=[]
for s in segs:
  for w in s.words: out.append({"w":w.word.strip(),"s":round(w.start,3),"e":round(w.end,3)})
json.dump(out,open(sys.argv[2],"w"),ensure_ascii=False,indent=0)
print(" ".join(f"{x['w']}@{x['s']}" for x in out))
