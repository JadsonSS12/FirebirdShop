# FirebirdShop

A modern e-commerce application built with FastAPI backend.

## Project Structure

```
FirebirdShop/
├── backend/          # FastAPI backend application
│   ├── main.py      # Main application entry point
│   └── __pycache__/ # Python cache files
├── LICENSE          # Project license
└── README.md        # This file
```

## Backend Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation and Setup

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone https://github.com/Raylandson/FirebirdShop.git
   cd FirebirdShop
   ```

2. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

3. **Create a virtual environment**:

   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment**:

   On Linux/macOS:

   ```bash
   source venv/bin/activate
   ```

   On Windows:

   ```bash
   venv\Scripts\activate
   ```

5. **Install required dependencies**:

   ```bash
   pip install "fastapi[standard]"
   ```

6. **Run the development server**:

   ```bash
   fastapi dev main.py
   ```

   The API will be available at: `http://127.0.0.1:8000`

7. **Access the interactive API documentation**:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

### Quick Start Commands

For a quick setup, run these commands in sequence:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Linux/macOS
pip install "fastapi[standard]"
fastapi dev main.py
```

### Development

- The backend uses FastAPI framework
- Hot reload is enabled with the `--reload` flag
- Make sure to activate the virtual environment before running any Python commands
- Install additional packages using `pip install <package-name>` while the virtual environment is activated

### Deactivating Virtual Environment

When you're done working, you can deactivate the virtual environment:

```bash
deactivate
```

## API Endpoints

Currently available endpoints:

- `GET /` - Returns a simple "Hello World" message
