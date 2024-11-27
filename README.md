# SecondBrain-BE

SecondBrain-BE is the backend for a web application designed to allow users to organize and save important YouTube videos and tweets securely. The application supports different user roles, including **Admin**, **Moderator**, and **User**, each with unique permissions and access levels.

---

## Features

- **Role-Based Authentication**  
  - **Admin**: Username must start with `admin`.  
  - **Moderator**: Username must start with `moderator`.  
  - **User**: Can sign up with any username.

- **JWT Authentication**  
  - Secure login and session handling with JSON Web Tokens.  
  - Passwords are encrypted using industry-standard hashing.

- **Schema Validation with Zod**  
  - Ensures robust and error-free API request validation.

- **Save Important Links**  
  - Users can save YouTube video links or tweets to their account for later reference.

- **Admin and Moderator Endpoints**  
  - Special endpoints for Admins and Moderators to manage and maintain the website.

---

## Installation and Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Cloud)
- **Git**

### To Run Locally
**Clone the Repository**:
   ```bash
   git clone https://github.com/Ayushsinha2629/SecondBrain-BE.git
   cd SecondBrain-BE
