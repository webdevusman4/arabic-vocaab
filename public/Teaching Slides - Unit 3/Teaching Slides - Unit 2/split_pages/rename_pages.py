import os

folder = r"d:\DOWNLOADS\Compressed\Teaching Slides - Unit 3\Teaching Slides - Unit 2\split_pages"

for i in range(1, 29):
    old_name = f"page_{i:02d}.jpg"
    old_path = os.path.join(folder, old_name)
    
    if not os.path.exists(old_path):
        print(f"File not found: {old_name}")
        continue
        
    if i % 2 != 0:
        # odd (left page)
        new_num = 75 + i
    else:
        # even (right page)
        new_num = 75 + i - 2
        
    new_name = f"{new_num}.jpg"
    new_path = os.path.join(folder, new_name)
    
    os.rename(old_path, new_path)
    print(f"Renamed {old_name} -> {new_name}")

print("Done renaming!")
