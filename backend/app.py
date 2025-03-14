import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import docx
import nltk
import json
import re
from dotenv import load_dotenv
from openai import OpenAI

# Import error handler
from error_handler import register_error_handlers, APIError

# Load environment variables from .env file
load_dotenv()

# Download NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

app = Flask(__name__)
CORS(app)

# Register error handlers
register_error_handlers(app)

# Set up OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    try:
        document = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page in document:
            text += page.get_text()
        return text
    except Exception as e:
        raise APIError(f"Failed to extract text from PDF: {str(e)}", status_code=400)

# Function to extract text from DOCX
def extract_text_from_docx(docx_file):
    try:
        doc = docx.Document(docx_file)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        raise APIError(f"Failed to extract text from DOCX: {str(e)}", status_code=400)

# Function to analyze resume with OpenAI API
def analyze_resume(resume_text, job_description):
    if not os.getenv("OPENAI_API_KEY"):
        # No API key provided, use fallback
        return fallback_analysis(resume_text, job_description)
        
    try:
        prompt = f"""
        Please analyze this resume:
        
        {resume_text}
        
        Against this job description:
        
        {job_description}
        
        Provide the following information in JSON format:
        1. "extracted_skills": [list of skills found in resume]
        2. "missing_skills": [important skills in job description missing from resume]
        3. "match_percentage": numerical percentage of resume match to job description
        4. "improvement_suggestions": [list of specific suggestions to improve resume]
        5. "summary": brief summary of analysis
        """
        
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=prompt,
            max_tokens=800,
            temperature=0.2,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        
        # Parse the JSON response
        analysis_text = response.choices[0].text.strip()
        return json.loads(analysis_text)
    except json.JSONDecodeError:
        # Handle case where OpenAI doesn't return valid JSON
        raise APIError("Failed to parse analysis result. Please try again.", status_code=500)
    except Exception as e:
        # Log the error but use fallback instead of failing
        print(f"Error in OpenAI analysis: {str(e)}")
        return fallback_analysis(resume_text, job_description)

def fallback_analysis(resume_text, job_description):
    """Fallback analysis when OpenAI API is unavailable"""
    extracted_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # Calculate missing skills
    missing_skills = [skill for skill in job_skills if skill not in extracted_skills]
    
    # Calculate a simple match percentage
    if len(job_skills) > 0:
        match_percentage = round((len(extracted_skills) / len(job_skills)) * 100)
        # Cap at 100%
        match_percentage = min(match_percentage, 100)
    else:
        match_percentage = 0
        
    return {
        "extracted_skills": extracted_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "improvement_suggestions": [
            "Add the missing skills to your resume if you have them",
            "Tailor your experience section to highlight relevant experiences",
            "Use keywords from the job description in your resume",
            "Consider using a professional resume template",
        ],
        "summary": "This is an automated analysis. For better results, please set up your OpenAI API key."
    }

# Simple skill extraction function (fallback)
def extract_skills(text):
    # A more comprehensive list of common skills
    common_skills = [
        "python", "javascript", "typescript", "java", "c\\+\\+", "c#", "react", "angular", "vue", 
        "node", "express", "flask", "django", "spring", "sql", "postgresql", "mysql", "mongodb",
        "nosql", "rest api", "graphql", "docker", "kubernetes", "aws", "azure", "gcp", 
        "ci/cd", "jenkins", "github actions", "git", "agile", "scrum", "machine learning",
        "data analysis", "data science", "tensorflow", "pytorch", "nlp", "computer vision",
        "html", "css", "sass", "less", "bootstrap", "tailwind", "responsive design",
        "mobile development", "react native", "flutter", "swift", "kotlin", "android",
        "ios", "devops", "sre", "testing", "test automation", "junit", "selenium",
        "project management", "leadership", "communication", "problem solving"
    ]
    
    skills_found = []
    
    for skill in common_skills:
        if re.search(r'\b' + skill + r'\b', text.lower()):
            skills_found.append(skill)
            
    return skills_found

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'resume' not in request.files or 'job_description' not in request.form:
        raise APIError('Missing resume file or job description', status_code=400)
    
    resume_file = request.files['resume']
    job_description = request.form['job_description']
    
    if resume_file.filename == '':
        raise APIError('No selected file', status_code=400)
    
    # Check file extension
    file_ext = os.path.splitext(resume_file.filename)[1].lower()
    
    if file_ext == '.pdf':
        resume_text = extract_text_from_pdf(resume_file)
    elif file_ext == '.docx':
        resume_text = extract_text_from_docx(resume_file)
    else:
        raise APIError('Unsupported file format. Please upload PDF or DOCX', status_code=400)
    
    # Analyze the resume
    analysis_result = analyze_resume(resume_text, job_description)
    
    return jsonify(analysis_result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'api_key_configured': bool(os.getenv("OPENAI_API_KEY"))})

if __name__ == '__main__':
    app.run(debug=os.getenv("FLASK_ENV") == "development", 
            host='0.0.0.0', 
            port=int(os.environ.get('PORT', 5000)))
