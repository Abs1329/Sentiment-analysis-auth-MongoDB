import pandas as pd
import string
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import datetime


# MongoDB connection (local or Atlas)
client = MongoClient("mongodb+srv://abasits1329_db_user:71141329%40Abs@cluster0.tdchzgd.mongodb.net/")  
db = client["sentiment_db"]  
collection = db["predictions"]  

# -------------------------------
# Custom Roman Urdu stopwords
# -------------------------------
STOP_WORDS = set([
    "ka", "ki", "kaun", "kon", "kya", "aur", "se", "mein", "tu", "tum", "main", "wo", "woh",
    "to", "mn", "ja", "rha", "ye", "yeh", "is", "ko", "tha", "thi", "ke", "ho", "raha", "rahe",
    "bhi", "par", "ab", "hain", "hun", "tak", "jab", "sirf", "liye", "chal", "gaya", "gayi", "gai", 
    "wahan", "ahan", "kyun", "kis", "hona", "hoti", "hota", "kar", "karo", "karta", "karte"
])

# -------------------------------
# Preprocessing
# -------------------------------
def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\d+', '', text)
    words = [w for w in text.split() if w not in STOP_WORDS]
    return " ".join(words)

# -------------------------------
# Load dataset & train model
# -------------------------------
dataset_path = r"C:\Users\hp\OneDrive\Desktop\ABS\POF(IT)\Sentiment_Analysis\Dataset 11000 Reviewss.csv"
df = pd.read_csv(dataset_path, encoding="latin1")

# Ensure columns are named correctly
df = df.rename(columns={'label': 'sentiment', 'review': 'review'})
df['cleaned_review'] = df['review'].apply(preprocess_text)

# TF-IDF with unigrams + bigrams
vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=2)
X = vectorizer.fit_transform(df['cleaned_review'])
y = df['sentiment']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Logistic Regression with stronger regularization
model = LogisticRegression(max_iter=2000, C=5, class_weight="balanced")
model.fit(X_train, y_train)


# -------------------------------
# Prediction function
# -------------------------------
def predict_sentiment(text: str) -> str:
    cleaned = preprocess_text(text)
    vec = vectorizer.transform([cleaned])
    return model.predict(vec)[0]

# -------------------------------
# Flask API
# -------------------------------
app = Flask(__name__)
CORS(app)  # Allow frontend requests (Next.js etc.)

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        # Accept ?text=... in URL
        text = request.args.get("text", "")
        if not text:
            return jsonify({"message": "Use ?text=your_sentence or send JSON { text: ... }"})
    else:
        # Accept JSON or form-data
        if request.is_json:
            data = request.get_json()
            text = data.get("text", "")
        else:
            text = request.form.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    cleaned = preprocess_text(text)
    vec = vectorizer.transform([cleaned])
    prediction = model.predict(vec)[0]

    # Save in MongoDB
    record = {
        "text": text,
        "cleaned_text": cleaned,
        "prediction": prediction,
        "timestamp": datetime.datetime.utcnow()
    }
    collection.insert_one(record)

    return jsonify({"result": prediction})


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running. Use POST /predict with {text: '...'}"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
