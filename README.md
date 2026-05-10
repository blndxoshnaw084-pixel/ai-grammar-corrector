# AI Grammar Corrector ✍️

## Project Overview
[cite_start]This is an individual mini-project for the **CED 318 Project Based Learning** course[cite: 1, 3]. [cite_start]It is a simple, responsive web application that takes user text input, sends it to an AI API (Groq API using the Llama 3.1 model), and returns a grammatically corrected professional version of the text[cite: 72, 73]. 

## Features
* [cite_start]**AI-Powered Correction:** Fixes grammar, spelling, and punctuation errors instantly[cite: 76].
* [cite_start]**Secure API Handling:** Uses a PHP backend proxy to keep the AI API key completely hidden and secure[cite: 66].
* [cite_start]**Clean UI/UX:** Styled with Tailwind CSS for a modern, responsive design[cite: 56].
* [cite_start]**Interactive Elements:** Includes loading states, error handling, and a one-click "Copy to Clipboard" bonus feature[cite: 54, 55, 59].

## Technologies Used
* [cite_start]**Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript[cite: 28, 34].
* [cite_start]**Backend Proxy:** Pure PHP[cite: 35].
* **AI Service:** Groq API (llama-3.1-8b-instant model).

## How to Run the Project Locally
Because this project uses a PHP backend proxy to protect the API key, it must be run on a local server environment (like Laragon).

1. Clone or download this repository.
2. Place the project folder into your local server's root directory (`www` for Laragon).
3. Open `api.php` and insert your own API key on line 14:
   `$apiKey = 'YOUR_API_KEY_HERE';`
4. Start your local server (Apache and PHP).
5. Open your browser and navigate to `http://localhost/ai-grammar-corrector/`.