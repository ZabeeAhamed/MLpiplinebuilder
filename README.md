# No-Code ML Pipeline Builder

A polished, step-based no-code ML pipeline web app. Upload data, apply preprocessing, split, choose a model, and view accuracy & confusion matrix — all in-browser with a guided UI.

## Features
- **Upload CSV/XLSX** with instant shape, column names, numeric/non-numeric counts, and a 10-row preview.
- **Preprocessing**: Standardization (StandardScaler) and Normalization (MinMaxScaler) via checkboxes; target selection.
- **Train/Test Split**: 80/20, 70/30, 60/40 options with a visual split bar and sample counts.
- **Models**: Logistic Regression and Decision Tree.
- **Results**: Status, accuracy bar, shaded confusion matrix, train/test counts.
- **Guardrails**: Clear errors for bad file types, empty files, non-numeric features; steps are disabled until prerequisites are met.
- **In-memory**: No database — fast and lightweight.

## Tech Stack
- Frontend: React (Vite) + Bootstrap 5 + Inter font
- Backend: FastAPI, pandas, scikit-learn
- Data: In-memory sessions (session_id)

## Project Structure
```
backend/
  main.py
  pipeline.py
  models.py
  utils.py
  requirements.txt
frontend/
  package.json
  vite.config.js
  index.html
  src/
    main.jsx
    App.jsx
    api.js
    styles.css
    components/
      Stepper.jsx
      UploadCard.jsx
      PreprocessCard.jsx
      SplitCard.jsx
      ModelCard.jsx
      ResultsCard.jsx
.gitignore
```

## Prerequisites
- Python 3.9+
- Node.js 18+ (npm included)

## Setup & Run
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # opens http://localhost:5173
```

Ensure backend runs on `http://localhost:8000` (default in `src/api.js`).

## Usage Flow
1) **Upload** CSV/XLSX → see rows/cols, numeric/non-numeric counts, and preview.
2) **Preprocess** → select Standardize/Normalize and choose a target column.
   - Note: All feature columns must be numeric; pick the categorical column (e.g., `variety` in iris) as the target.
3) **Split** → choose a ratio (80/20, 70/30, 60/40) → see train/test counts.
4) **Model** → pick Logistic Regression or Decision Tree → run pipeline.
5) **Results** → view status, accuracy, confusion matrix.

## Notes & Tips
- If you get “Features must be numeric…”, your remaining feature columns include non-numeric data. Make the categorical column the target, or encode/drop non-numeric features before preprocessing.
- Sessions are in-memory; restarting the backend clears them.
- CORS is enabled for local dev.

## Troubleshooting Git Push (if needed)
- Use a GitHub Personal Access Token (PAT) with `repo` scope for HTTPS, or set up SSH keys.
- Update remote:
  - HTTPS: `git remote set-url origin https://github.com/<user>/<repo>.git`
  - SSH: `git remote set-url origin git@github.com:<user>/<repo>.git`

## License
MIT
