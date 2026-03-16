import shutil, os

brain = r'C:\Users\Lenovo\.gemini\antigravity\brain\c1519246-342d-40ee-87d5-ba09c3a10e5f'
dest  = r'C:\Users\Lenovo\Desktop\hhh anti\assets'

os.makedirs(dest, exist_ok=True)

files = [
    ('hero_hero_image_1773504582421.png',    'hero.jpg'),
    ('property_interior_1773504627268.png',  'property.jpg'),
    ('property_interior_1773504627268.png',  'interior.jpg'),
    ('jebel_jais_1773504652596.png',         'jebel.jpg'),
    ('al_marjan_island_1773504956015.png',   'island.jpg'),
]

for src_name, dst_name in files:
    src = os.path.join(brain, src_name)
    dst = os.path.join(dest, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'[OK]  {dst_name}')
    else:
        print(f'[ERR] Source not found: {src_name}')

print('\nAssets ready! Open index.html in your browser.')
