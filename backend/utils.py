import io
import pandas as pd
from fastapi import HTTPException, UploadFile

SUPPORTED_TYPES = {
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

def read_uploaded_file(file: UploadFile) -> pd.DataFrame:
    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(400, "Unsupported file type. Please upload CSV or Excel.")
    content = file.file.read()
    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception:
        raise HTTPException(400, "Invalid or unreadable file.")
    if df.empty:
        raise HTTPException(400, "Invalid dataset: file is empty.")
    return df