from pathlib import Path
root=Path("C:/Users/mdabd/Desktop/pyquest_streamlit_edition").resolve()
files=['edition/image_learning.py', 'edition/cloudflare_images.py', 'tests/test_image_learning.py', 'tests/test_cloudflare_images.py', 'scripts/verify_live_image.py', 'scripts/seed_image_qa.py', 'scripts/reconcile_image_request.py', 'scripts/browser-image-cache.cjs', 'scripts/browser-cloudflare.cjs']
for name in files:
 p=(root/name).resolve()
 assert p.is_relative_to(root) and p!=root
 p.unlink(missing_ok=True)
print("Removed image generation modules, tests and tooling.")

for name in ['edition/studio_companion.py', 'edition/ui/studio-companion.bundle.js', 'web/studio-companion.js', 'scripts/build_studio_companion.py', 'image_cache.db', 'image_cache.db-shm', 'image_cache.db-wal']:
 p=(root/name).resolve()
 assert p.is_relative_to(root) and p!=root
 p.unlink(missing_ok=True)
p=root/"generated_visuals"
if p.exists() and not any(p.iterdir()):p.rmdir()
