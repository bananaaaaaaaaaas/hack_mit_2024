from PIL import Image
import time
import sys
from manga_ocr import MangaOcr
from pathlib import Path
from vlm_listener import run

image_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCqSomI84vz7ZJdNYHvnJPOOe9Z_-AcO6Pfa4pPPMD3tJ19L907tLv0quBWIFEdZoWbY&usqp=CAU"

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
                    question = f"Ignore the image. First, just translate {text} to English. Then describe the Japanese connotations behind the text in a way that would help someone learning Japanese, but keep the explanation relatively short."
                    image_url = "https://m.media-amazon.com/images/I/71vMGRog+iL._AC_UF1000,1000_QL80_.jpg"
                    text = run(image_url, question).text

                    if text == "それでも、":
                        print("Error: selection too large")
                    else:
                        print(text)
                    new_path = "../assets/working_out/" + path.stem + ".txt"
                    with Path(new_path).open("w") as f:
                        f.write(text)
                    print("wrote to", new_path)
        time.sleep(0.1)