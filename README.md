# Research Paper RAG — Frontend

A web interface for evidence-grounded research paper analysis.

Research Paper RAG transforms a research paper into a structured evidence map, helping users explore what a paper covers, what evidence supports it, which methods are discussed, and where the research points next.


## Features

* PDF upload with drag-and-drop support
* Structured research paper analysis
* Evidence coverage overview
* Visual research map
* Section-aware evidence retrieval
* Evidence strength and confidence indicators
* Expandable evidence and alternative sources
* Page and section references
* Evidence gaps
* "Ask the Paper" question interface
* Responsive interface for desktop and mobile

## Analysis Categories

The application analyses evidence across seven research dimensions:

1. Research Aim / Scope
2. Key Concepts / Definitions
3. Theoretical Framework
4. Research Areas / Themes
5. Methods Discussed
6. Evidence / Studies Reviewed
7. Conclusions / Research Directions

The results are presented as an interactive evidence map rather than a conventional document summary.

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **FastAPI backend**

## How It Works

```text
Research Paper (PDF)
        ↓
PDF Parsing
        ↓
Section-Aware Chunking
        ↓
Semantic + Keyword Retrieval
        ↓
Evidence Analysis
        ↓
Research Map
        ↓
Evidence & Paper Questions
```

The frontend communicates with a separate FastAPI backend for PDF processing, evidence retrieval, analysis, and paper-specific questions.

## Project Structure

```text
app/
├── globals.css
├── layout.tsx
└── page.tsx

components/
└── research-rag/
    └── EvidenceCard.tsx

lib/
└── api.ts

types/
└── rag.ts
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend URL

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend expects the Research Paper RAG FastAPI backend to be running at:

```text
http://localhost:8000
```

### 3. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

To verify the application before deployment:

```bash
npm run lint
npm run build
```

## Screenshot 

<img width="1356" height="661" alt="1 1" src="https://github.com/user-attachments/assets/2287eeeb-6b13-4985-a153-209274078f2c" />

<img width="1203" height="662" alt="1 2" src="https://github.com/user-attachments/assets/85ca9f9b-4a5d-464e-a78e-9b3989615d3b" />

<img width="1227" height="639" alt="1 3" src="https://github.com/user-attachments/assets/8c5ca6dc-b016-46d4-be67-e857a7bf8649" />

<img width="1229" height="643" alt="1 4" src="https://github.com/user-attachments/assets/cbac2be7-8628-47a3-a216-138f1921d50d" />




## Backend

The frontend is designed to work with the separate Research Paper RAG FastAPI backend.

The backend provides:

* PDF parsing
* Section-aware chunking
* Semantic evidence retrieval
* Research category analysis
* Evidence scoring
* Evidence-grounded paper questions

## Purpose

This project was developed as a research-to-software portfolio project, combining software engineering, information retrieval, natural language processing, and evidence-grounded AI.

The focus is on making research papers easier to explore while keeping generated answers connected to retrieved evidence and page-level sources.



