from fastapi import FastAPI
import pickle

app = FastAPI()

model = pickle.load(open("model.pkl","rb"))

@app.get("/")
def home():
    return {"message": "ML service running"}

@app.post("/predict")
def predict(data: dict):

    reading_speed = data["reading_speed"]
    spelling_errors = data["spelling_errors"]
    prefix_errors = data["prefix_errors"]
    suffix_errors = data["suffix_errors"]

    result = model.predict([[reading_speed, spelling_errors, prefix_errors, suffix_errors]])

    return {"recommended_level": result[0]}