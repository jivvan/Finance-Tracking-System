import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from random_forest import RandomForest
from sklearn.metrics import classification_report
import pickle

# Step 1: Load dataset
data = pd.read_csv('transactions.csv')  # Columns: ['description', 'category']

# Step 2: Split the data
X = data['description']  # Input: Descriptions
y = data['category']     # Output: Categories

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Step 3: Vectorize the text using TF-IDF
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
X_test_tfidf = tfidf_vectorizer.transform(X_test)

# Label encode the categories
label_encoder = LabelEncoder()
y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.fit_transform(y_test)

# Step 4: Train the Random Forest Classifier
rf_classifier = RandomForest(n_trees=100, max_depth=10, random_state=42)
rf_classifier.fit(X_train_tfidf, y_train_encoded)

# Step 5: Evaluate the model
y_pred = label_encoder.inverse_transform(rf_classifier.predict(X_test_tfidf))
print(classification_report(y_test, y_pred))

# Step 6: Save the TF-IDF vectorizer and Random Forest model
with open('tfidf_vectorizer.pkl', 'wb') as vec_file:
    pickle.dump(tfidf_vectorizer, vec_file)

with open('random_forest_model.pkl', 'wb') as model_file:
    pickle.dump(rf_classifier, model_file)

print("Model and vectorizer saved successfully!")
