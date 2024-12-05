FROM python:3.10-slim AS base

WORKDIR /app

# Copy the source code
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

EXPOSE 5000

# Run the application
CMD ["python", "run.py"]
