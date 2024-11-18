import streamlit as st
from PIL import Image
import pandas as pd
import time
from streamlit_lottie import st_lottie
import requests
import streamlit.components.v1 as components
import urllib.parse
from model_train import generate_response

# Page configuration
st.set_page_config(
    page_title="My Portfolio",
    page_icon="👨‍💻",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS with improved styling
st.markdown("""
    <style>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
    
    .main {
        padding: 2rem;
    }
    .chat-window {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 1000;
        backdrop-filter: blur(10px);
    }
    
    .chat-window.active {
        display: block;
    }
    
    .chat-header {
        padding: 1rem;
        background: #2b2d42;
        color: white;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chat-messages {
        height: 380px;
        padding: 1rem;
        overflow-y: auto;
    }
    
    .chat-input {
        padding: 1rem;
        border-top: 1px solid #eee;
    }
    
    /* Chat Toggle Button */
    .chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #2b2d42;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        z-index: 1001;
    }
    
    .chat-toggle:hover {
        transform: scale(1.1);
    }
    
    .message {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        max-width: 80%;
    }
    
    .user-message {
        background: #e9ecef;
        margin-left: auto;
    }
    
    .bot-message {
        background: #2b2d42;
        color: white;
    }
           
    /* Fixed Navigation Bar */
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background-color: rgba(30, 41, 59, 0.95);
        padding: 1rem;
        z-index: 9999;
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .nav-button {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        background-color: transparent;
        color: white !important;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .nav-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    /* Skills Section */
    .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: center;
        padding: 2rem 0;
    }
    
    .skill-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.3s ease;
    }
    
    .skill-item:hover {
        transform: translateY(-5px);
    }
    
    .skill-icon {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }
    
    /* Project Cards */
    .project-card {
        padding: 1.5rem;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
        transition: all 0.3s ease;
        height: 100%;
    }
    
    .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    /* Education Cards */
.education-card {
    padding: 1.5rem;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.education-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
    
    /* Resume Button */
    .resume-btn-container {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .resume-btn {
        background: linear-gradient(45deg, #2b2d42, #8d99ae);
        color: white !important;
        padding: 10px 24px;
        border-radius: 25px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .resume-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    /* Social Links */
    .social-links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .social-icon {
        color: #2b2d42 !important;
        font-size: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .social-icon:hover {
        transform: translateY(-3px);
        color: #8d99ae !important;
    }
    
    /* Contact Form */
    .contact-form {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
    }
    
    .stButton > button {
        background: linear-gradient(45deg, #2b2d42, #8d99ae);
        color: white;
        border: none;
        padding: 0.5rem 2rem;
        border-radius: 25px;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    </style>
""", unsafe_allow_html=True)
st.markdown("""
    <style>
    /* Hide Streamlit's default header and menu */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Adjust padding for Streamlit's default container */
    .main > div:first-child {
        padding-top: 80px;
    }
    

    
    [data-testid="stHeader"] {
        display: none;
    }
    
    /* Add padding to the top of the page */
    .block-container {
        padding-top: 80px !important;
    }
    body {
        overflow-y: scroll !important;
        scroll-behavior: smooth;
    }
    </style>
    
    
""", unsafe_allow_html=True)
# Navigation Bar
def create_navbar():
    current_section = st.session_state.get('current_section', 'home')
    st.markdown(f"""
        <div class="navbar">
            <a href="#home" class="nav-button {'active' if current_section == 'home' else ''}" 
               onclick="handleNavClick('home')">Home</a>
            <a href="#about" class="nav-button {'active' if current_section == 'about' else ''}"
               onclick="handleNavClick('about')">About</a>
            <a href="#education" class="nav-button {'active' if current_section == 'education' else ''}"
               onclick="handleNavClick('education')">Education</a>
            <a href="#skills" class="nav-button {'active' if current_section == 'skills' else ''}"
               onclick="handleNavClick('skills')">Skills</a>
            <a href="#projects" class="nav-button {'active' if current_section == 'projects' else ''}"
               onclick="handleNavClick('projects')">Projects</a>
            <a href="#contact" class="nav-button {'active' if current_section == 'contact' else ''}"
               onclick="handleNavClick('contact')">Contact</a>
            <a href="#chat" class="nav-button {'active' if current_section == 'chat' else ''}"
               onclick="handleNavClick('chat')">
                <i class="fas fa-robot"></i> Chat
            </a>
        </div>
    """, unsafe_allow_html=True)

# Load Lottie Animation
def load_lottieurl(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()
# Initialize session state for chat
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'chat_visible' not in st.session_state:
    st.session_state.chat_visible = False

# AI Assistant functions

def get_ai_response(message):
    return "answer"

# Header Section
def header_section():
    st.markdown('<div id="home">', unsafe_allow_html=True)
    col1, col2 = st.columns([1, 2])
    
    lottie_coding = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json")
    
    with col1:
        st_lottie(lottie_coding, height=300, key="coding")
    
    with col2:
        st.markdown('<h1>Rugved Chandekar</h1>', unsafe_allow_html=True)
        st.markdown('<h3>Aspiring ML Engineer Exploring Intelligent Solutions</h3>', unsafe_allow_html=True)
        st.markdown("""
        🚀 Eager to apply AI and ML concepts to hands-on projects
        🌟 Focused on Machine Learning and Data Science
        🎯 Driven by curiosity and continuously learning
        """, unsafe_allow_html=True)
        
        # Social Links
        st.markdown("""
            <div class="social-links">
                <a href="https://github.com/Rugvedrc" target="_blank" class="social-icon">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/rugvedchandekar/" target="_blank" class="social-icon">
                    <i class="fab fa-linkedin"></i>
                </a>
                <a href="https://twitter.com/yourusername" target="_blank" class="social-icon">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="mailto:rugved.rc1@gmail.com" class="social-icon">
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
        """, unsafe_allow_html=True)
        
        # Resume Button
        
        with open("Rugved_Chandekar_Resume.pdf", "rb") as file:
            st.download_button(label="Download Resume", data=file, file_name="Rugved_Chandekar_Resume.pdf", mime="application/pdf")
def education_section():
    st.markdown('<div id="education">', unsafe_allow_html=True)
    st.header("Education")
    
    educations = [
        {
            "degree": "B.Tech in Information Technology",
            "school": "GECA, Aurangabad",
            "year": "Nov 2022 - June 2026",
            "score": "CGPA: 7.2",
            "icon": "🎓"
        },
        {
            "degree": "XII (HSC)",
            "school": "Sarosh Junior College, Aurangabad",
            "year": "2020 - 2022",
            "score": "87.17%",
            "icon": "📚"
        },
        {
            "degree": "X (ICSE)",
            "school": "Ryan International School, Aurangabad",
            "year": "2010 - 2020",
            "score": "84.20%",
            "icon": "🎯"
        }
    ]
    
    for edu in educations:
        st.markdown(f"""
            <div class="education-card">
                <h3>{edu['icon']} {edu['degree']}</h3>
                <p><strong>{edu['school']}</strong></p>
                <p>{edu['year']} | {edu['score']}</p>
            </div>
        """, unsafe_allow_html=True)
# Skills Section with Technology Logos
def skills_section():
    st.markdown('<div id="skills">', unsafe_allow_html=True)
    st.header("Skills & Technologies")
    
    skills = {
        "Programming Languages": {
            "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
            "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
            "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
            "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
        },
        "ML Libraries": {
            "TensorFlow": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
            "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
            "scikit-learn": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
            "Keras": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg"
        },

        "Data Analysis": {
            "Numpy": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
            "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
            "Seaborn":"https://seaborn.pydata.org/_images/logo-mark-lightbg.svg",
            "SciPy": "https://seeklogo.com/images/S/scipy-logo-7D9F267684-seeklogo.com.png"
        },
        
        "Others": {
            "Streamlit":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg",
            "OpenCV": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
            "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
        }
    }
    
    for category, tech_skills in skills.items():
        st.subheader(category)
        cols = st.columns(len(tech_skills))
        
        for idx, (skill, logo_url) in enumerate(tech_skills.items()):
            with cols[idx]:
                st.markdown(f"""
                    <div class="skill-item">
                        <img src="{logo_url}" alt="{skill}" class="skill-icon">
                        <p style="text-align: center;">{skill}</p>
                    </div>
                """, unsafe_allow_html=True)

# Projects Section
def projects_section():
    st.markdown('<div id="projects">', unsafe_allow_html=True)
    st.header("Featured Projects")
    
    projects = [
        {
            "title": "AI Assistant",
            "description": "AI assistant that uses text commands to streamline tasks, provide information, and boost productivity.",
            "tech": ["Python", "Streamlit", "Google Gemini API"],
            "github": "https://github.com/Rugvedrc/JARVIS",
            "demo": "https://jarvis-rugvedrc.streamlit.app/",
            "icon": "🤖"
        },
        {
            "title": "Object Detection Web App",
            "description": "Developed a Streamlit app for real-time object detection using YOLO model.",
            "tech": ["Python", "OpenCV", "YOLO", "Streamlit"],
            "github": "https://github.com/Rugvedrc/Object_Detection",
            "demo": "https://huggingface.co/spaces/rugvedrc/object_Detection",
            "icon": "🔍"
        },
        {
            "title": "AI Caption Generator",
            "description": "AI-powered app to generate creative captions for images using Google Generative AI and gemini API.",
            "tech": ["Python", "Streamit","Pillow (PIL)","Google Gemini API"],
            "github": "https://github.com/Rugvedrc/AI_captionGenerator",
            "demo": "https://huggingface.co/spaces/rugvedrc/AI-captionGenerator",
            "icon": "🎨"
        },
        
    ]
    
    cols = st.columns(3)
    for idx, project in enumerate(projects):
        with cols[idx]:
            st.markdown(f"""
                <div class="project-card">
                    <h3>{project['icon']} {project['title']}</h3>
                    <p>{project['description']}</p>
                    <p><strong>Tech Stack:</strong> {', '.join(project['tech'])}</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <a href="{project['github']}" target="_blank" class="nav-button">
                            <i class="fab fa-github"></i> View Code
                        </a>
                        <a href="{project['demo']}" target="_blank" class="nav-button">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            """, unsafe_allow_html=True)

# Contact Form
def contact_form():
    st.markdown('<div id="contact">', unsafe_allow_html=True)
    st.header("Get In Touch")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        lottie_contact = load_lottieurl("https://assets9.lottiefiles.com/packages/lf20_u25cckyh.json")
        st_lottie(lottie_contact, height=300, key="contact")
    
    with col2:
        st.markdown('<div class="contact-form">', unsafe_allow_html=True)
        with st.form("contact_form"):
            name=st.text_input("Name")
            email=st.text_input("Email")
            message=st.text_area("Message")
            submitted = st.form_submit_button("Send Message")
            if submitted:
                # Check if the required fields are filled
                if name and email and message:
            # Prepare the email subject and body
                    subject = "New Contact Message from Portfolio"
                    body = f"{message}"
            
            # URL encode the subject and body text for a mailto link
                    encoded_subject = urllib.parse.quote(subject)
                    encoded_body = urllib.parse.quote(body)
            
            # Construct the gmail link
                    gmail_link = f"https://mail.google.com/mail/?view=cm&fs=1&to=rugved.rc1@gmail.com&su={encoded_subject}&body={encoded_body}"
            
            # Display the mailto link as a button
                    st.markdown(f'<a href="{gmail_link}" target="_blank"><button style="background-color: #4CAF50; color: white; padding: 10px 24px; border: none; cursor: pointer;">Send Message</button></a>', unsafe_allow_html=True)
                    st.success("Click the button to send the email.")
            else:
                st.error("Please fill in all fields.")
        st.markdown('</div>', unsafe_allow_html=True)

def chat_interface():
    st.markdown('<div id="chat" class="chat-section">', unsafe_allow_html=True)
    st.subheader("💬 Chat with AI Assistant")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])

    # Chat input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message to state and display
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.write(prompt)
#here
        # Add assistant response to state and display
        response = generate_response(prompt)
        st.session_state.messages.append({"role": "assistant", "content": response})
        with st.chat_message("assistant"):
            st.write(response)

    st.markdown('</div>', unsafe_allow_html=True)

# Modified main function
def main():
    create_navbar()
    
    # Get the current section from URL fragment or session state
    current_section = st.session_state.get('current_section', 'home')
    
    header_section()
    st.markdown("---")
    education_section()  
    st.markdown("---")
    skills_section()
    st.markdown("---")
    projects_section()
    st.markdown("---")
    contact_form()
    st.markdown("---")
    chat_interface()  # Add chat interface at the bottom

if __name__ == "__main__":
    main()
