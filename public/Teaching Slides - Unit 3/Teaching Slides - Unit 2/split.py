import os
from PIL import Image

image_dir = r"d:\DOWNLOADS\Compressed\Teaching Slides - Unit 3\Teaching Slides - Unit 2"
output_dir = os.path.join(image_dir, "split_pages")
os.makedirs(output_dir, exist_ok=True)

# List and sort the files
files = [f for f in os.listdir(image_dir) if f.endswith('.webp')]
files.sort()

page_num = 1
for file in files:
    filepath = os.path.join(image_dir, file)
    with Image.open(filepath) as img:
        w, h = img.size
        # Left half
        left = img.crop((0, 0, w//2, h))
        left.save(os.path.join(output_dir, f"page_{page_num:02d}.webp"))
        page_num += 1
        
        # Right half
        right = img.crop((w//2, 0, w, h))
        right.save(os.path.join(output_dir, f"page_{page_num:02d}.webp"))
        page_num += 1

print(f"Successfully processed {len(files)} images and saved {page_num-1} pages.")
