#!/usr/bin/env python3
"""
Run this script from the repo root on your local machine:
    python3 fetch-posters-local.py

Requires: pip install Pillow
Writes .image-slots.project-*.state.json files and updates .image-slots.state.json
"""
import urllib.request, json, base64, io, os, sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing Pillow — run: pip install Pillow")

POSTERS = [
    ("working-man",      "https://m.media-amazon.com/images/M/MV5BYmQxZGIxNTYtYTQwMy00ODdkLWI0MmQtM2E0ZmIyNmYzMGMzXkEyXkFqcGc@._V1_.jpg"),
    ("stone-cold-fox",   "https://m.media-amazon.com/images/M/MV5BYmIwMzMzNGQtMzdhZi00N2I3LWEwZjgtMjBhOGJkOWFkZjljXkEyXkFqcGc@._V1_FMjpg_UY337_.jpg"),
    ("hollywood-grit",   "https://m.media-amazon.com/images/M/MV5BODZhOGEwNTEtZDc1NC00YTgwLTk4OTctYmQwODgwZGI0NWQzXkEyXkFqcGc@._V1_.jpg"),
    ("fallout",          "https://m.media-amazon.com/images/M/MV5BYzE1MTZmY2ItMTgxNi00OGU5LTk4NTItMmY2ODFhYzhjZjRkXkEyXkFqcGc@._V1_.jpg"),
    ("smile2",           "https://m.media-amazon.com/images/M/MV5BNTU4ZDUzNDQtYTY1NC00ZDg4LWFlOGMtYmI5MmE2ZTkzOTM2XkEyXkFqcGc@._V1_.jpg"),
    ("kingdom",          "https://m.media-amazon.com/images/M/MV5BZDRlZTc3YTItOTk3Yi00NmU4LWFiOGUtNjgwMDZjNjIzNTU1XkEyXkFqcGc@._V1_.jpg"),
    ("musica",           "https://m.media-amazon.com/images/M/MV5BMGRkOTVhMjctYTY4ZC00MTAxLWFiYzItNTc2ZmZmMTAxMmJhXkEyXkFqcGc@._V1_.jpg"),
    ("winner",           "https://m.media-amazon.com/images/M/MV5BZGY1NTZhMDUtMzJhNi00ZWZiLWJkZDMtNmVlMmM2ZTdjYzg1XkEyXkFqcGc@._V1_FMjpg_UY576_.jpg"),
    ("monster-summer",   "https://m.media-amazon.com/images/M/MV5BN2ExNDg1MTMtOTliOC00OWFjLWFlNTktOTZhYjUzNzk3ZTFhXkEyXkFqcGc@._V1_.jpg"),
    ("war-is-over",      "https://m.media-amazon.com/images/M/MV5BY2I1NTEyM2UtMDYzMS00NTYwLWE3ZDEtNjIzMWQ1MWY5NDAyXkEyXkFqcGc@._V1_FMjpg_UY480_.jpg"),
    ("peripheral",       "https://m.media-amazon.com/images/M/MV5BODE1NmJiMzAtYmRmZi00ZjkzLWJhZjctNGU0YmFjZWI5NzZmXkEyXkFqcGc@._V1_.jpg"),
    ("downfall",         "https://m.media-amazon.com/images/M/MV5BYTQzZjhjMGYtOTAyZi00NmI3LTllMGQtYTg3NTIzMWM1YTI4XkEyXkFqcGc@._V1_.jpg"),
    ("after-antarctica", "https://m.media-amazon.com/images/M/MV5BMTUzZmNiMjItMTMwYy00NmI4LWIyNGMtYjU4MzQxNWJlZDMzXkEyXkFqcGc@._V1_.jpg"),
    ("chef-show",        "https://m.media-amazon.com/images/M/MV5BYmExZTE3YzYtZTk2ZC00YTEzLWFmZmYtMDgwMGMzYjQwYjU5XkEyXkFqcGc@._V1_.jpg"),
    ("theyll-love-me",   "https://m.media-amazon.com/images/M/MV5BMjEwNzExNzU2Ml5BMl5BanBnXkFtZTgwMjIyNDI0NjM@._V1_FMjpg_UY473_.jpg"),
    ("lost-treasure",    "https://m.media-amazon.com/images/M/MV5BMjgxM2M5ZjQtMDc1MC00MzFiLThmMDctNGRlYTJkNjQ4ZGNhXkEyXkFqcGc@._V1_.jpg"),
    ("diagnosis",        "https://m.media-amazon.com/images/M/MV5BN2Y2NzEzY2QtOTgwOS00OGU2LTgyZTctZDZmY2I1ZGNmY2I1XkEyXkFqcGc@._V1_FMjpg_UY711_.jpg"),
    ("rm-crossroads",    "https://m.media-amazon.com/images/M/MV5BMDQ4MGU5MjQtZTNhZi00NDBlLTk4MjctNDEyM2FiMGFjYjU3XkEyXkFqcGc@._V1_.jpg"),
    ("rm-miami",         "https://m.media-amazon.com/images/M/MV5BYzQwNWMxODUtYzZiMi00MjYyLTkxMzEtOTgzZjMzMzY5OGRiXkEyXkFqcGc@._V1_.jpg"),
    ("rm-sam-cooke",     "https://m.media-amazon.com/images/M/MV5BZmZmNzI3MWEtYmFiNS00NjIzLWI2ZmYtZDBlNTY4NDNjMTM3XkEyXkFqcGc@._V1_FMjpg_UY597_.jpg"),
    ("rm-stadium",       "https://m.media-amazon.com/images/M/MV5BMWU2M2M3ZjQtNmE5My00MTY4LTliMDItOWQwNDhjYjkzZmIwXkEyXkFqcGc@._V1_.jpg"),
    ("rm-tricky-dick",   "https://m.media-amazon.com/images/M/MV5BY2MyMjI5MDUtODMwYi00OTY3LTgxMmUtZDJkNDA4NDEyMWQxXkEyXkFqcGc@._V1_.jpg"),
    ("rm-lions-share",   "https://m.media-amazon.com/images/M/MV5BYWMxODI3MjgtOTY1NS00N2M5LTliYWMtZjEyODA5MzBmMGNhXkEyXkFqcGc@._V1_.jpg"),
    ("rm-jam-master",    "https://m.media-amazon.com/images/M/MV5BZmQ4NmE4NDgtYjIzYS00NjE0LWI4OTAtNjE5NWQwOTU4MWFhXkEyXkFqcGc@._V1_.jpg"),
    ("rm-sheriff",       "https://m.media-amazon.com/images/M/MV5BNWQ5MGIyMWMtOTAxNi00YmQ4LTlkMGEtMDY1YjZhYzZjNmFmXkEyXkFqcGc@._V1_.jpg"),
    ("year-of-the-scab", "https://m.media-amazon.com/images/M/MV5BOTJlNGQ5NWItMWU5Ni00OGZhLWIwMzktMTJlNWJlOGNkYWI3XkEyXkFqcGc@._V1_.jpg"),
    ("hodges",           "https://m.media-amazon.com/images/M/MV5BZjRhYmYzMjUtNmMwMy00YjI4LThjYjAtYzA5MTIzMTEzZmJkXkEyXkFqcGc@._V1_FMjpg_UY426_.jpg"),
    ("lost-memories",    "https://m.media-amazon.com/images/M/MV5BMWJkOTVlMTAtMDRiZi00M2U3LTliNjQtOWFjNzU4YWNkMjJhXkEyXkFqcGc@._V1_.jpg"),
    ("in-absentia",      "https://m.media-amazon.com/images/M/MV5BN2Y4NDk2NzEtZGQ3YS00YTkyLWEyYTMtNmVkMzA2NzlhMDE5XkEyXkFqcGc@._V1_.jpg"),
    ("deadly-dance",     "https://m.media-amazon.com/images/M/MV5BZjY5N2EwM2QtZjRiMi00NDAzLTlmNzEtZmI5OTkxZTFjNjRmXkEyXkFqcGc@._V1_.jpg"),
    ("perfect-lineup",   "https://m.media-amazon.com/images/M/MV5BMDZlZDAxYWQtYzI2NS00MmFmLTllNTUtNGI5MjhhOTE2ODcyXkEyXkFqcGc@._V1_.jpg"),
    ("family-weekends",  "https://m.media-amazon.com/images/M/MV5BMTk1NDc5NDI1MF5BMl5BanBnXkFtZTgwMDMzNzMwODE@._V1_.jpg"),
    ("im-gabrielle",     "https://m.media-amazon.com/images/M/MV5BOWY4OTExN2UtOTdkZC00NDFmLWFkZmUtMDExNWI4MjI1ZjcyXkEyXkFqcGc@._V1_FMjpg_UY640_.jpg"),
    ("her-first",        "https://m.media-amazon.com/images/M/MV5BNDg5MTQyNzgzNV5BMl5BanBnXkFtZTgwOTkxNjUyNjE@._V1_FMjpg_UY7560_.jpg"),
    ("arthur",           "https://m.media-amazon.com/images/M/MV5BMTcwNDMxNTc2OV5BMl5BanBnXkFtZTgwNjY5MDc1MjE@._V1_.jpg"),
    ("cry-now",          "https://m.media-amazon.com/images/M/MV5BNTQ4MDM2ZDAtYTg3Yi00YjllLThlYjYtMjBhMzU1ZmVmMDYwXkEyXkFqcGc@._V1_FMjpg_UY475_.jpg"),
    ("snowflake",        "https://m.media-amazon.com/images/M/MV5BMjcxMTQwNzc0M15BMl5BanBnXkFtZTgwMDM3MzY1MjE@._V1_FMjpg_UY456_.jpg"),
]

TARGET_SIZE = 600
QUALITY = 85

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.imdb.com/",
}

ok, fail = [], []

for film_id, url in POSTERS:
    slot_id = f"project-{film_id}"
    out_path = f".image-slots.{slot_id}.state.json"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read()
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        w, h = img.size
        scale = TARGET_SIZE / max(w, h)
        if scale < 1:
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=QUALITY, optimize=True)
        b64 = base64.b64encode(buf.getvalue()).decode()
        data_url = f"data:image/jpeg;base64,{b64}"
        with open(out_path, "w") as f:
            json.dump({"u": data_url, "s": 1, "x": 0, "y": 0}, f)
        kb = len(buf.getvalue()) // 1024
        print(f"  OK  {slot_id} ({kb}KB)")
        ok.append(slot_id)
    except Exception as e:
        print(f"FAIL  {slot_id}: {e}", file=sys.stderr)
        fail.append(slot_id)

# Update manifest
manifest_path = ".image-slots.state.json"
try:
    with open(manifest_path) as f:
        manifest = json.load(f)
except Exception:
    manifest = {"ids": []}

existing = set(manifest.get("ids", []))
for sid in ok:
    existing.add(sid)
manifest["ids"] = sorted(existing)
with open(manifest_path, "w") as f:
    json.dump(manifest, f)

print(f"\nDone: {len(ok)}/37 OK, {len(fail)} failed")
if fail:
    print("Failed:", [f.replace("project-","") for f in fail])
if ok:
    print("\nNext: git add .image-slots.*.state.json && git commit -m 'Add project posters' && git push")
