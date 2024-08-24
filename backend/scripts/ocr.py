import sys
import re
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_core(filename):
    """
    This function will handle the core OCR processing of images.
    """
    text = pytesseract.image_to_string(Image.open(filename))
    filtered_text = re.sub(r'[^a-zA-Z0-9\s\.,;:!@#\$%\^\&\*\(\)_\+\-=\[\]\{\}\|\\\'\"\<\>\/\?]', '', text)
    return filtered_text

if __name__ == "__main__":
    path_to_image = sys.argv[1]
    print(ocr_core(path_to_image))
