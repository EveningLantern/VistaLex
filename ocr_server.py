from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import easyocr
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['en'], gpu=False)

@app.route('/ocr-image', methods=['POST'])
@app.route('/ocr-image', methods=['POST'])
def ocr_image():
    print("Image OCR request received")
    file = request.files.get('image')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(file.stream).convert("RGB")
    print("Image received. Running OCR...")
    result = reader.readtext(np.array(image), detail=0)
    print("OCR result:", result)
    return jsonify({"text": "\n".join(result)})

from pdf2image import convert_from_bytes

@app.route('/ocr-pdf', methods=['POST'])
def ocr_pdf():
    file = request.files.get('pdf')
    if not file:
        return jsonify({"error": "No PDF uploaded"}), 400

    try:
        # Convert PDF pages to images
        pages = convert_from_bytes(file.read(), dpi=300)

        all_text = []
        for i, page in enumerate(pages):
            result = reader.readtext(np.array(page), detail=0)
            text = "\n".join(result)
            all_text.append(f"Page {i+1}:\n{text}")

        return jsonify({"text": "\n\n".join(all_text)})
    except Exception as e:
        print("PDF OCR error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

