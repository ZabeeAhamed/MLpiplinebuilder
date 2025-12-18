import uuid
import pandas as pd
from fastapi import HTTPException
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# In-memory session store
sessions = {}

def create_session(df: pd.DataFrame):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"df": df}
    return session_id

def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(400, "Invalid session. Please upload again.")
    return sessions[session_id]

def preprocess(session_id: str, standardize: bool, normalize: bool, target: str):
    s = get_session(session_id)
    df = s.get("df")
    if df is None:
        raise HTTPException(400, "No dataset uploaded.")
    if target not in df.columns:
        raise HTTPException(400, "Please provide a valid target column.")

    X = df.drop(columns=[target])
    y = df[target]
    non_numeric = [col for col in X.columns if not pd.api.types.is_numeric_dtype(X[col])]
    if non_numeric:
        raise HTTPException(
            400,
            f"Features must be numeric. Please encode or remove: {', '.join(non_numeric)}"
        )

    X_proc = X.copy()
    if standardize:
        X_proc = pd.DataFrame(StandardScaler().fit_transform(X_proc), columns=X.columns)
    if normalize:
        X_proc = pd.DataFrame(MinMaxScaler().fit_transform(X_proc), columns=X.columns)

    s.update({"X": X_proc, "y": y})
    return X_proc.columns.tolist()

def split(session_id: str, test_size: float):
    s = get_session(session_id)
    X, y = s.get("X"), s.get("y")
    if X is None or y is None:
        raise HTTPException(400, "Please preprocess first.")
    stratify = y if len(y.unique()) > 1 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=stratify
    )
    s.update({"X_train": X_train, "X_test": X_test, "y_train": y_train, "y_test": y_test})
    return len(X_train), len(X_test)

def train(session_id: str, model_name: str):
    s = get_session(session_id)
    X_train, X_test, y_train, y_test = (
        s.get("X_train"), s.get("X_test"), s.get("y_train"), s.get("y_test")
    )
    if any(v is None for v in [X_train, X_test, y_train, y_test]):
        raise HTTPException(400, "Please run train-test split first.")

    if model_name == "logistic":
        clf = LogisticRegression(max_iter=1000)
    elif model_name == "decision_tree":
        clf = DecisionTreeClassifier(random_state=42)
    else:
        raise HTTPException(400, "Model not supported.")

    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    cm = confusion_matrix(y_test, preds).tolist()
    s["model"] = model_name
    return acc, cm