#!/bin/bash

# FirebirdShop Backend Setup Script

echo "🔥 Setting up FirebirdShop Backend..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"

# Create virtual environment
echo "🐍 Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the development server:"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "🌐 The API will be available at: http://127.0.0.1:8000"
echo "📖 API docs will be available at: http://127.0.0.1:8000/docs"
