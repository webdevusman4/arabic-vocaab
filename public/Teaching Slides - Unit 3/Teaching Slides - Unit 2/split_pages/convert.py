import os
from PIL import Image

image_dir = r"d:\DOWNLOADS\Compressed\Teaching Slides - Unit 3\Teaching Slides - Unit 2\split_pages"

# List all webp files
files = [f for f in os.listdir(image_dir) if f.endswith('.webp')]

for file in files:
    filepath = os.path.join(image_dir, file)
    with Image.open(filepath) as img:
        rgb_im = img.convert('RGB')
        # Save as jpg
        new_filename = file.replace('.webp', '.jpg')
        rgb_im.save(os.path.join(image_dir, new_filename), 'JPEG')
    
    # Optionally remove the original webp file
    os.remove(filepath)

print(f"Successfully converted {len(files)} files to JPG format.")
