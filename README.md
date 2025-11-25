## Chimera Gen
ChimeraGen provides an automated ecosystem where users can generate privacy safe synthetic data for fraud detection, analyse dataset quality, handle class imbalance, and build ML ready datasets. Users can upload real transactional datasets, get profiling, generate 10× synthetic data, validate it with statistical tests, and receive a complete AI generated report. It targets Fintech companies, banks, fraud detection teams etc.


# Tech Stack Overview

| Category | Tools / Technologies | Purpose |
|---------|-----------------------|---------|
| **Frontend** | React / Next.js | User interface for dataset upload & report viewing |
| | Tailwind CSS | Fast, responsive UI styling |
| | Charts.js / Recharts | Visualizing validation metrics |
| **Backend** | Python (FastAPI / Flask) | Core API for data processing |
| | CTGAN, TVAE, VAE (SDV Library) | Synthetic data generation |
| | Pandas, NumPy, Scikit-learn | Data profiling & preprocessing |
| | SciPy, StatsModels | Statistical validation (KS, Chi-square, JS divergence) |
| **AI & Automation** | Google AI Studio (Gemini API) | AI-driven insights & automation |
| **Database & Storage** | Firebase / Firestore | Store sessions, metadata, reports |
| | Cloud Storage (GCP) | Store uploaded datasets & synthetic outputs |
| **Deployment** | GCP Cloud Run | Backend hosting & autoscaling |

# Features

1. DATASET PROFILING → UPLOAD DATASETS AND GET SCHEMA, DISTRIBUTION, ANOMALIES, AND INSIGHTS.
2. SYNTHETIC DATA GENERATOR → CREATES REALISTIC, SCALABLE SYNTHETIC DATA USING CTGAN/VAE.
3. VALIDATION REPORTS → REAL VS SYNTHETIC COMPARISONS VIA CHARTS, METRICS, AND STATISTICAL TESTS.
4. FRAUD BALANCING MODULE → GENERATES RARE FRAUD CASES TO IMPROVE FRAUD-DETECTION MODEL TRAINING.
5. PRIVACY & COMPLIANCE LAYER → ENSURES SYNTHETIC OUTPUTS REMAIN GDPR/RBI COMPLIANT WITH NO SENSITIVE LEAKAGE.

# Dataset 
