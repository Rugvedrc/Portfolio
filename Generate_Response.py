import streamlit as st
import google.generativeai as genai

api_key = st.secrets["general"]["api_key"]

# Configure API key for Google Generative AI
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Define function to generate responses based on personal information
def generate_response(question: str) -> str:
    # Define personal information in a structured dictionary
    personal_info = {
        "name": "Rugved Chandekar",
        "email": "rugved.rc1@gmail.com",
        "linkedin": "https://www.linkedin.com/in/rugvedchandekar/",
        "github": "https://github.com/Rugvedrc",
        "portfolio": "https://jarvis-rugvedrc.streamlit.app/",
        "skills": [
            "Python (PyTorch, TensorFlow, scikit-learn)", "Streamlit",
             "Natural Language Processing", "YOLO Object Detection", 
            "Image Augmentation", "OpenCV", "Object Detection & Tracking", "Image Processing"
        ],
        "education": {
            "degree": "Information Technology",
            "college": "GECA, Aurangabad",
            "cgpa": 7.2,
            "duration": "Nov 2022 - June 2026",
            "school_12": {"name": "Sarosh Junior College, Aurangabad", "percentage": "87.17%", "year": 2022},
            "school_10": {"name": "Ryan International School, Aurangabad", "percentage": "84.20%", "year": 2020},
        },
        "projects": {
            "AI Assistant JARVIS": {
                "description": "An AI assistant for task automation and enhanced productivity through text commands.",
                "skills": ["Python", "Natural Language Processing", "Machine Learning"],
                "deployment": "https://github.com/Rugvedrc/JARVIS/"
            },
            "Object Detection Web App": {
                "description": "A Streamlit app for real-time object detection using YOLO and webcam integration.",
                "skills": ["Python", "OpenCV", "YOLO", "Streamlit"],
                "deployment": "https://huggingface.co/spaces/rugvedrc/object_Detection"
            },
            "Creative Caption Generator": {
                "description": "An AI-powered app for generating creative captions using Google Generative AI.",
                "skills": ["Python", "Streamlit", "Google Generative AI API", "Natural Language Processing"],
                "deployment": "https://huggingface.co/spaces/rugvedrc/AI-captionGenerator"
            }
        },
        "responsibility": {
            "position": "CP and DSA Team Lead",
            "organization": "Hackslash, GECA, Aurangabad",
            "duration": "Sep 2024 - Present",
            "description": "Organized hackathons & conducted sessions for 300+ college students."
        }
    }

    # Prepare context (combine all structured info into a paragraph)
    context = (
        f"My name is {personal_info['name']}. You can contact me at {personal_info['email']}"
        f"My LinkedIn profile is {personal_info['linkedin']}, and my GitHub can be found at {personal_info['github']}. "
        f"My portfolio is available at {personal_info['portfolio']}. "
        f"I am skilled in {', '.join(personal_info['skills'])}. "
        f"I am pursuing {personal_info['education']['degree']} from {personal_info['education']['college']} "
        f"with a CGPA of {personal_info['education']['cgpa']}, expected to graduate in {personal_info['education']['duration']}. "
        f"I completed my XII from {personal_info['education']['school_12']['name']} with {personal_info['education']['school_12']['percentage']} in {personal_info['education']['school_12']['year']}, "
        f"and X from {personal_info['education']['school_10']['name']} with {personal_info['education']['school_10']['percentage']} in {personal_info['education']['school_10']['year']}. "
        f"My notable projects include:\n"
        f"- {', '.join([f'{proj}: {details['description']} (Skills: {', '.join(details['skills'])}). Deployment: {details['deployment']}' for proj, details in personal_info['projects'].items()])}\n"
        f"I am currently the {personal_info['responsibility']['position']} at {personal_info['responsibility']['organization']} since {personal_info['responsibility']['duration']}, "
        f"where I {personal_info['responsibility']['description']}."
    )

    # Generate response using the provided question and context
    response = model.generate_content(f"you are acting as a chatbot assistant on Rugved Chandekar's portfolio website so based on the {context} answer {question}").text.strip()

    return response
