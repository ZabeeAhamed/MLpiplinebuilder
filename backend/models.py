from pydantic import BaseModel, Field
from typing import List, Dict

class UploadResponse(BaseModel):
    session_id: str
    rows: int
    cols: int
    columns: List[str]
    numeric_cols: int
    non_numeric_cols: int
    preview: List[Dict]

class PreprocessRequest(BaseModel):
    session_id: str
    standardize: bool = False
    normalize: bool = False
    target: str

class PreprocessResponse(BaseModel):
    status: str
    columns: List[str]

class SplitRequest(BaseModel):
    session_id: str
    test_size: float = Field(0.2, description="Fraction for test split (0.2, 0.3, 0.4).")

class SplitResponse(BaseModel):
    train_samples: int
    test_samples: int

class TrainRequest(BaseModel):
    session_id: str
    model: str  # "logistic" or "decision_tree"

class TrainResponse(BaseModel):
    status: str
    model: str
    accuracy: float
    confusion_matrix: List[List[int]]