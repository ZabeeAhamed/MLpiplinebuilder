from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    UploadResponse, PreprocessRequest, PreprocessResponse,
    SplitRequest, SplitResponse, TrainRequest, TrainResponse
)
from utils import read_uploaded_file
import pipeline
import pandas as pd

app = FastAPI(title="No-Code ML Pipeline Builder", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    df = read_uploaded_file(file)
    rows, cols = df.shape
    session_id = pipeline.create_session(df)
    numeric_cols = sum(pd.api.types.is_numeric_dtype(dt) for dt in df.dtypes)
    non_numeric_cols = cols - numeric_cols
    preview = df.head(10).to_dict(orient="records")
    return UploadResponse(
        session_id=session_id,
        rows=rows,
        cols=cols,
        columns=df.columns.tolist(),
        numeric_cols=numeric_cols,
        non_numeric_cols=non_numeric_cols,
        preview=preview,
    )

@app.post("/preprocess", response_model=PreprocessResponse)
async def preprocess(req: PreprocessRequest):
    columns = pipeline.preprocess(
        req.session_id, req.standardize, req.normalize, req.target
    )
    return PreprocessResponse(status="preprocessed", columns=columns)

@app.post("/split", response_model=SplitResponse)
async def split(req: SplitRequest):
    if req.test_size not in [0.2, 0.3, 0.4]:
        raise HTTPException(400, "test_size must be 0.2, 0.3, or 0.4")
    train_n, test_n = pipeline.split(req.session_id, req.test_size)
    return SplitResponse(train_samples=train_n, test_samples=test_n)

@app.post("/train", response_model=TrainResponse)
async def train(req: TrainRequest):
    acc, cm = pipeline.train(req.session_id, req.model)
    return TrainResponse(
        status="Model trained successfully ✔",
        model=req.model,
        accuracy=acc,
        confusion_matrix=cm,
    )

