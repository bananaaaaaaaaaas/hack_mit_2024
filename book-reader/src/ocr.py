from PIL import Image
import time
import sys
from manga_ocr import MangaOcr
from pathlib import Path

def get_path_key(path):
    return path, path.lstat().st_mtime

if __name__ == "__main__":
    mocr = MangaOcr()
    print("loaded")
    read_from = Path("../assets/working_temp")
    print(read_from.is_dir())
    old_paths = set()
    while True:
        for path in read_from.iterdir():
            path_key = get_path_key(path)
            if path_key not in old_paths:
                print(path)
                old_paths.add(path_key)
                try:
                    img = Image.open(path)
                    img.load()
                except (UnidentifiedImageError, OSError) as e:
                    logger.warning(f"Error while reading file {path}: {e}")
                else:
                    text = mocr(img)
                    
                    if text == "それでも、":
                        print("Error: selection too large")
                    else:
                        print(text)
                    new_path = "../assets/working_out/" + path.stem + ".txt"
                    with Path(new_path).open("w") as f:
                        f.write(text)
                    print("wrote to", new_path)
        time.sleep(0.1)