import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle

data = pd.read_csv("dataset.csv")

X = data[["reading_speed","spelling_errors","prefix_errors","suffix_errors"]]
y = data["level"]

model = DecisionTreeClassifier()
model.fit(X,y)

pickle.dump(model, open("model.pkl","wb"))

print("Model trained")