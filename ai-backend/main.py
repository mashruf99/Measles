import io
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

class SafeDense(Dense):
    @classmethod
    def from_config(cls, config):
        config.pop('quantization_config', None) 
        return super().from_config(config)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "best_measles_model_final.h5"
CLASS_NAMES = ['Healthy', 'Measles', 'Non-Measles']

def load_final_model(path):
    try:
        print("Attempting to load full model...")
        loaded = tf.keras.models.load_model(
            path, 
            custom_objects={'Dense': SafeDense}, 
            compile=False
        )
        print("Full model loaded successfully!")
        return loaded
    except Exception as e:
        print(f"Full model load failed: {e}")
        return None

model = load_final_model(MODEL_PATH)

def prepare_image(img_bytes):
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img).astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"Image processing error: {e}")
        return None

def safe_float(val):
    """float32 → Python float, NaN/Inf → 0.0"""
    f = float(val)
    if not (f == f) or f == float('inf') or f == float('-inf'):
        return 0.0
    return f

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    fever: str = Form("না"),
    cough: str = Form("না"),
    runnyNose: str = Form("না"),
    redEyes: str = Form("না"),
    koplikSpots: str = Form("না"),
):
    if model is None:
        return {"error": "Model failed to load. Check terminal logs."}

    try:
        contents = await file.read()
        processed_image = prepare_image(contents)
        if processed_image is None:
            return {"error": "Image processing failed."}

        predictions = model.predict(processed_image)
        predictions = np.nan_to_num(predictions, nan=0.0, posinf=0.0, neginf=0.0)

        if predictions.sum() == 0:
            return {"error": "Model prediction failed — weights not loaded correctly."}

        pred_idx = int(np.argmax(predictions[0]))
        label = CLASS_NAMES[pred_idx]
        
        fever_score = 2 if fever == "তীব্র" else (1 if fever == "মৃদু" else 0)
        
        other_symptoms = [cough, runnyNose, redEyes, koplikSpots]
        other_score = sum(1 for s in other_symptoms if s == "হ্যাঁ")
        
        score = fever_score + other_score
        has_koplik = (koplikSpots == "হ্যাঁ") 

        status_color = "green"
        recommendation = "পরামর্শ: আপনার ত্বক স্বাভাবিক দেখাচ্ছে এবং উল্লেখযোগ্য কোনো অসুস্থতার লক্ষণ নেই। চিন্তার কারণ নেই।"
        precautions = ["নিয়মিত পরিষ্কার-পরিচ্ছন্নতা বজায় রাখুন", "পুষ্টিকর খাবার খান"]
        
        display_status = "স্বাভাবিক / ঝুঁকি নেই"

        if label == 'Measles':
            if score >= 3 or has_koplik:
                status_color = "red"
                display_status = "হামের সম্ভাবনা রয়েছে"
                recommendation = "পরামর্শ: আপনার ছবি এবং শারীরিক লক্ষণগুলো হামের (Measles) দিকে নির্দেশ করছে। তবে এটি চূড়ান্ত নয়, তাই নিশ্চিত হওয়ার জন্য একজন চিকিৎসকের মাধ্যমে সরাসরি পরীক্ষা করানো অত্যন্ত জরুরি।"
                precautions = ["অবিলম্বে আইসোলেশনে থাকুন", "প্রচুর তরল খাবার পান করুন", "ডাক্তারের পরামর্শ ছাড়া কোনো ওষুধ খাবেন না"]
            else:
                status_color = "orange"
                display_status = "হামের প্রাথমিক লক্ষণ"
                recommendation = "পরামর্শ: আপনার ছবিতে হামের মতো কিছু লক্ষণ থাকলেও, অন্যান্য শারীরিক সমস্যা বেশ কম। তাই নিশ্চিতভাবে কিছু বলা যাচ্ছে না। সঠিক রোগ নির্ণয়ের জন্য দ্রুত একজন চিকিৎসকের পরামর্শ নিন।"
                precautions = ["র‍্যাশ বা দানাগুলো চুলকাবেন না", "অন্যদের থেকে কিছুটা দূরত্ব বজায় রাখুন", "ত্বক পরিষ্কার রাখুন"]

        elif label == 'Non-Measles' or label == 'Healthy':
            if score >= 2:
                status_color = "orange"
                display_status = "অসুস্থতার লক্ষণ রয়েছে"
                recommendation = "পরামর্শ: ছবিতে হামের স্পষ্ট লক্ষণ নেই, তবে আপনার শরীরে বেশ কিছু অসুস্থতার লক্ষণ রয়েছে (যেমন ভাইরাল ফিভার বা ফ্লু)। দয়া করে একজন ডাক্তার দেখান।"
                precautions = ["পর্যাপ্ত বিশ্রাম নিন", "প্রচুর পানি ও তরল পান করুন", "লক্ষণ বাড়লে চিকিৎসকের কাছে যান"]
            elif label == 'Non-Measles' and score < 2:
                status_color = "green"
                display_status = "সাধারণ র‍্যাশ / সুস্থ"
                recommendation = "পরামর্শ: এটি হাম নয়, সম্ভবত সাধারণ র‍্যাশ, ঘামাচি বা অ্যালার্জি। তবে সতর্কতার জন্য শারীরিক অবস্থা পর্যবেক্ষণ করুন।"
                precautions = ["ত্বক পরিষ্কার ও শুষ্ক রাখুন", "প্রয়োজনে অ্যালার্জির মলম ব্যবহার করতে পারেন", "র‍্যাশ বাড়লে ডাক্তার দেখান"]

        return {
            "prediction": display_status,
            "clinical_score": f"{score}/6",
            "status_color": status_color,
            "recommendation": recommendation,
            "precautions": precautions
        }

    except Exception as e:
        print(f"Logic error: {str(e)}")
        return {"error": str(e)}
