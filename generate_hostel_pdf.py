import sys
import os
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Skip header and footer on cover page
            return
        
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header
        self.drawString(54, letter[1] - 36, "HOSTELHUB — MERN STACK COMPLETE ARCHITECTURE & INTERVIEW GUIDE")
        self.setFont("Helvetica", 8)
        self.drawRightString(letter[0] - 54, letter[1] - 36, "Dharmsinh Desai University (MCA)")
        
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
        
        # Footer
        self.line(54, 48, letter[0] - 54, 48)
        self.drawString(54, 34, "Confidential — Comprehensive Technical Report & Job Interview Guide")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 34, page_str)
        
        self.restoreState()

def esc(text):
    """Utility to escape HTML characters for ReportLab Paragraphs."""
    if not isinstance(text, str):
        text = str(text)
    return html.escape(text)

def build_pdf():
    pdf_filename = r"d:\use\MCA\HostelManagement_final_final\MERN-HostelManagement\HostelManagement_MERN_Complete_Guide.pdf"
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0f172a")     # Slate 900
    c_secondary = colors.HexColor("#1e3a8a")   # Blue 900
    c_accent = colors.HexColor("#2563eb")      # Blue 600
    c_dark = colors.HexColor("#334155")        # Slate 700
    c_body = colors.HexColor("#1e293b")        # Slate 800
    c_light_bg = colors.HexColor("#f8fafc")    # Slate 50
    c_border = colors.HexColor("#cbd5e1")      # Slate 300
    c_teal = colors.HexColor("#0d9488")        # Teal 600

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=0,
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_accent,
        spaceAfter=24
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_secondary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Header3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_teal,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_body,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e3a8a"),
        backColor=colors.HexColor("#eff6ff"),
        borderColor=colors.HexColor("#3b82f6"),
        borderWidth=1,
        borderPadding=8,
        spaceBefore=8,
        spaceAfter=10
    )

    qa_q_style = ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=3,
        keepWithNext=True
    )

    qa_a_style = ParagraphStyle(
        'QAAnswer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_body,
        spaceAfter=8
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("HOSTELHUB MANAGEMENT SYSTEM", title_style))
    story.append(Paragraph("Full-Stack MERN Architecture, Complete Function Reference, End-to-End Workflows & Comprehensive Job Interview Masterclass", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=3, color=c_accent, spaceBefore=0, spaceAfter=20))
    
    meta_text = """
    <b>Project Title:</b> HostelHub Management System<br/>
    <b>Technology Stack:</b> MERN (MongoDB, Express.js, React 18, Node.js)<br/>
    <b>Target Domain:</b> Enterprise Student & Hostel Lifecycle Automation<br/>
    <b>Institution context:</b> Dharmsinh Desai University (Master of Computer Applications - MCA)<br/>
    <b>Author / Candidate:</b> Job Interview Candidate Master Reference Document<br/>
    <b>Document Version:</b> 2.0 (Production Architecture Edition)<br/>
    <b>Generated Date:</b> October 2026
    """
    story.append(Paragraph(meta_text, callout_style))
    story.append(Spacer(1, 20))

    exec_summary = """
    <b>Executive Overview & Purpose of this Document:</b><br/>
    This master document provides an exhaustive, end-to-end breakdown of the <b>HostelHub Management System</b>, a production-ready web application built using the MERN stack. Designed specifically for job interview representation, this guide assumes zero prior knowledge of MERN and systematically builds your expertise from core concepts to advanced production architecture.<br/><br/>
    Every single file, controller function, Mongoose model hook, React component, state workflow, JWT auth loop, database fallback mechanism, and REST API endpoint is analyzed in precise detail. By reading this document, you will gain full technical fluency to explain, defend, and demonstrate this project with absolute confidence before senior technical interviewers.
    """
    story.append(Paragraph(exec_summary, body_style))
    story.append(Spacer(1, 30))

    # Table of Contents Summary Table
    toc_data = [
        [Paragraph("<b>Chapter</b>", h3_style), Paragraph("<b>Focus Area & Key Content</b>", h3_style)],
        [Paragraph("<b>Chapter 1</b>", body_style), Paragraph("Project High-Level Architecture & Repository Structure", body_style)],
        [Paragraph("<b>Chapter 2</b>", body_style), Paragraph("MERN Stack Foundations (Zero-Knowledge Conceptual Primer)", body_style)],
        [Paragraph("<b>Chapter 3</b>", body_style), Paragraph("Backend Code Deep Dive (Models, Controllers, Middleware & Functions)", body_style)],
        [Paragraph("<b>Chapter 4</b>", body_style), Paragraph("Frontend Code Deep Dive (React, Context API, Components & Routes)", body_style)],
        [Paragraph("<b>Chapter 5</b>", body_style), Paragraph("Complete System Workflows & Data Lifecycles (Step-by-Step)", body_style)],
        [Paragraph("<b>Chapter 6</b>", body_style), Paragraph("Essential & Advanced MERN Concepts (Beyond Project Scope)", body_style)],
        [Paragraph("<b>Chapter 7</b>", body_style), Paragraph("Master Job Interview Guide & 25 High-Yield Technical Q&A", body_style)],
    ]
    toc_table = Table(toc_data, colWidths=[90, 414])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), c_light_bg),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1: PROJECT OVERVIEW & ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("Chapter 1: Project Overview & System Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch1_text = """
    <b>1.1 System Objective & Core Vision</b><br/>
    HostelHub is a centralized hostel management platform designed to replace legacy manual paper-based processes with an automated, role-based web solution. The application handles student boarding, room allocation and bed capacity, leave request workflows, student complaint resolution, and daily mess menu scheduling.
    <br/><br/>
    <b>1.2 Dual-Role Permission Model</b><br/>
    The system strictly segregates capabilities between two distinct user roles:
    """
    story.append(Paragraph(ch1_text, body_style))

    roles_data = [
        [Paragraph("<b>Role</b>", h3_style), Paragraph("<b>Key Responsibilities & Permissions</b>", h3_style)],
        [
            Paragraph("<b>Admin (Warden / Management)</b>", body_style),
            Paragraph("Full platform control. Can register new students, edit student profiles, create rooms, set capacities, allocate/deallocate beds, review & approve/reject leave requests with remarks, update complaint resolution statuses with resolution notes, and manage the weekly 7-day mess menu schedule.", body_style)
        ],
        [
            Paragraph("<b>Student (Resident)</b>", body_style),
            Paragraph("Restricted self-service access. Can log in, view personal room allocation and room-mates list, edit personal profile details, apply for leaves, track leave approval status, lodge complaints with priority levels, track complaint resolution, and view the weekly mess menu.", body_style)
        ]
    ]
    roles_table = Table(roles_data, colWidths=[150, 354])
    roles_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), c_light_bg),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(roles_table)
    story.append(Spacer(1, 10))

    ch1_arch = """
    <b>1.3 High-Level Technical Architecture Diagram</b><br/>
    The project follows a standard 3-tier client-server decoupling model:
    """
    story.append(Paragraph(ch1_arch, body_style))

    arch_diagram_box = """
    +-----------------------------------------------------------------------------------+<br/>
    |                                FRONTEND TIER                                      |<br/>
    | React 18 SPA (Vite) | React Router DOM v6 | React Context API (AuthContext)       |<br/>
    | Custom UI Styling (index.css) | Axios Client with Request Interceptor             |<br/>
    +-----------------------------------------+-----------------------------------------+<br/>
                                              | HTTP REST API Calls (JSON / Bearer JWT)<br/>
                                              v<br/>
    +-----------------------------------------------------------------------------------+<br/>
    |                                BACKEND TIER                                       |<br/>
    | Express.js Web Application | Node.js Runtime Server (Port 5000)                   |<br/>
    | Routes -> Middleware (Auth/Role) -> Controllers (Business Logic)                 |<br/>
    +-----------------------------------------+-----------------------------------------+<br/>
                                              | Mongoose ODM Drivers / MongoDB Wire Protocol<br/>
                                              v<br/>
    +-----------------------------------------------------------------------------------+<br/>
    |                               DATABASE TIER                                       |<br/>
    | Local MongoDB Database (port 27017) OR MongoMemoryServer (In-Memory Fallback)      |<br/>
    | Collections: users | rooms | complaints | leaves | messmenus                   |<br/>
    +-----------------------------------------------------------------------------------+
    """
    story.append(Paragraph(arch_diagram_box, code_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>1.4 Directory & Codebase Layout Walkthrough</b>", h2_style))
    dir_text = """
    The codebase is organized into two primary root folders: <code>backend/</code> and <code>frontend/</code>. Below is the complete directory structure mapping:
    """
    story.append(Paragraph(dir_text, body_style))

    dir_code = """
    MERN-HostelManagement/
    ├── backend/
    │   ├── config/
    │   │   └── db.js                 # Mongo connection with MongoMemoryServer fallback
    │   ├── controllers/
    │   │   ├── authController.js     # Login, get profile, update profile
    │   │   ├── studentController.js  # Register student, search, edit, delete, room sync
    │   │   ├── roomController.js     # Room CRUD, allocate student, deallocate student
    │   │   ├── complaintController.js# Submit, list (admin/student query), update status, delete
    │   │   ├── leaveController.js    # Apply leave, list leaves, admin approve/reject, delete
    │   │   └── messController.js     # Get weekly mess menu, update day menu, delete menu
    │   ├── middleware/
    │   │   └── authMiddleware.js     # Protect route (JWT verify) & adminOnly role check
    │   ├── models/
    │   │   ├── User.js               # User schema (Bcrypt pre-save hook, matchPassword method)
    │   │   ├── Room.js               # Room schema (Pre-save hook calculating occupiedBeds & status)
    │   │   ├── Complaint.js          # Complaint schema with category, priority & resolution
    │   │   ├── Leave.js              # Leave schema with reason, dates & admin remarks
    │   │   └── MessMenu.js           # Mess menu schema for Monday - Sunday meals
    │   ├── routes/
    │   │   ├── authRoutes.js         # POST /login, GET /me, PUT /profile
    │   │   ├── studentRoutes.js      # Student management REST endpoints
    │   │   ├── roomRoutes.js         # Room management & allocation endpoints
    │   │   ├── complaintRoutes.js    # Complaint processing endpoints
    │   │   ├── leaveRoutes.js        # Leave request endpoints
    │   │   └── messRoutes.js         # Mess schedule endpoints
    │   ├── seed.js                   # Initial admin, room & mess menu seeder
    │   └── server.js                 # Express server bootstrap & API mount
    └── frontend/
        ├── src/
        │   ├── api/
        │   │   └── axios.js          # Axios instance with auto Bearer token interceptor
        │   ├── components/
        │   │   ├── Navbar.jsx        # Top header with user profile & logout
        │   │   └── Sidebar.jsx       # Dynamic role-based navigation bar
        │   ├── context/
        │   │   └── AuthContext.jsx   # Global auth state, login/logout & profile updater
        │   ├── pages/
        │   │   ├── Home.jsx          # Public landing page showcasing HostelHub
        │   │   ├── Login.jsx         # Authentication form with quick-login presets
        │   │   ├── admin/            # Admin pages (Dashboard, Student, Room, Mess, Complaint, Leave)
        │   │   └── student/          # Student pages (Dashboard, Profile, Complaints, Leave, Mess)
        │   ├── App.jsx               # React Router configuration & ProtectedRoute wrapper
        │   ├── main.jsx              # React app entry point rendering DOM
        │   └── index.css             # Glassmorphism design system & utility classes
    """
    story.append(Paragraph(esc(dir_code), code_style))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 2: MERN STACK FOUNDATIONS (ZERO KNOWLEDGE PRIMER)
    # =========================================================================
    story.append(Paragraph("Chapter 2: MERN Stack Foundations (Zero-Knowledge Primer)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch2_intro = """
    If you are completely new to MERN or preparing for a job interview where you must explain the underlying technologies from scratch, this chapter provides the foundational knowledge required. MERN stands for <b>MongoDB</b>, <b>Express.js</b>, <b>React.js</b>, and <b>Node.js</b>. Together, they form an end-to-end JavaScript technology stack for building modern single-page applications.
    """
    story.append(Paragraph(ch2_intro, body_style))

    story.append(Paragraph("2.1 Node.js — The JavaScript Runtime Environment", h2_style))
    node_desc = """
    <b>What is Node.js?</b><br/>
    Traditionally, JavaScript could only run inside web browsers (like Chrome or Firefox). Node.js is an open-source, cross-platform runtime environment built on Google Chrome's V8 JavaScript Engine that allows developers to execute JavaScript code on the server side (outside the browser).<br/><br/>
    <b>Key Node.js Core Concepts to Explain in an Interview:</b>
    """
    story.append(Paragraph(node_desc, body_style))
    story.append(Paragraph("• <b>Asynchronous & Non-Blocking I/O:</b> Node.js processes database queries, file reading, and network requests asynchronously without blocking the main execution thread.", bullet_style))
    story.append(Paragraph("• <b>Single-Threaded Event Loop:</b> Node.js uses a single thread to handle thousands of concurrent requests by delegating heavy I/O tasks to system kernel workers via libuv.", bullet_style))
    story.append(Paragraph("• <b>CommonJS Module System:</b> Backend Node.js applications use <code>require('package')</code> to import modules and <code>module.exports = ...</code> to export functions and objects.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.2 Express.js — The Backend Web Application Framework", h2_style))
    express_desc = """
    <b>What is Express.js?</b><br/>
    Express is a minimal, fast, and unopinionated web application framework for Node.js. It simplifies routing, HTTP request handling, middleware integration, and server configuration.<br/><br/>
    <b>Core Express Concepts:</b>
    """
    story.append(Paragraph(express_desc, body_style))
    story.append(Paragraph("• <b>Request (<code>req</code>) & Response (<code>res</code>):</b> <code>req</code> contains incoming HTTP data (headers, query string <code>req.query</code>, route params <code>req.params</code>, body JSON <code>req.body</code>). <code>res</code> handles sending data back to the client (e.g. <code>res.json()</code>, <code>res.status(400)</code>).", bullet_style))
    story.append(Paragraph("• <b>Middleware Pipeline:</b> A middleware function is a function with access to <code>(req, res, next)</code>. It can execute code, modify <code>req</code> or <code>res</code>, end the cycle, or pass control to the next middleware using <code>next()</code>.", bullet_style))
    story.append(Paragraph("• <b>REST API Architecture:</b> Express routes map standard HTTP methods to resource actions: <code>GET</code> (read), <code>POST</code> (create), <code>PUT</code> (update), <code>DELETE</code> (remove).", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.3 MongoDB & Mongoose ODM — The Database Layer", h2_style))
    mongo_desc = """
    <b>What is MongoDB?</b><br/>
    MongoDB is a NoSQL document-oriented database. Unlike relational databases (like MySQL) that store data in rigid tables with rows and columns, MongoDB stores data in flexible JSON-like documents called BSON (Binary JSON).<br/><br/>
    <b>What is Mongoose?</b><br/>
    Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It defines schemas for database collections, enforces data validation, handles entity relationships via ObjectIds, and provides helper query methods.<br/><br/>
    <b>Key Database Terms:</b>
    """
    story.append(Paragraph(mongo_desc, body_style))
    story.append(Paragraph("• <b>Collection vs Document:</b> A <i>Collection</i> is equivalent to a SQL Table (e.g., <code>users</code>). A <i>Document</i> is equivalent to a SQL Row (a single record containing fields and values).", bullet_style))
    story.append(Paragraph("• <b>Schema & Model:</b> A <i>Schema</i> defines document fields, types, default values, and validations. A <i>Model</i> is a compiled constructor derived from the schema used to query database collections.", bullet_style))
    story.append(Paragraph("• <b>Population (<code>.populate()</code>):</b> Mongoose feature that replaces document ObjectId references with actual data from referenced collections (similar to a SQL JOIN).", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.4 React.js — The Frontend User Interface Library", h2_style))
    react_desc = """
    <b>What is React.js?</b><br/>
    React is an open-source JavaScript library developed by Meta for building user interfaces. React applications are built using declarative, component-driven architecture.<br/><br/>
    <b>Core React Concepts:</b>
    """
    story.append(Paragraph(react_desc, body_style))
    story.append(Paragraph("• <b>JSX (JavaScript XML):</b> A syntax extension allowing HTML-like markup directly inside JavaScript components.", bullet_style))
    story.append(Paragraph("• <b>Virtual DOM:</b> React maintains a lightweight copy of the real DOM in memory. When state changes occur, React compares the Virtual DOM with the real DOM using a 'reconciliation diffing algorithm' and updates only changed elements.", bullet_style))
    story.append(Paragraph("• <b>React Hooks:</b> Functions allowing functional components to use state and lifecycle features (e.g. <code>useState</code> for local component state, <code>useEffect</code> for side effects like API fetching, <code>useContext</code> for global state access).", bullet_style))
    story.append(Paragraph("• <b>Context API:</b> Built-in React mechanism for sharing global state across components without passing props down through every level of the component tree ('prop drilling').", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3: BACKEND CODE DEEP DIVE & FUNCTIONS
    # =========================================================================
    story.append(Paragraph("Chapter 3: Backend Code Deep Dive & Function Explanations", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch3_intro = """
    This chapter dissects every single backend file in the project. Every controller function, database connection strategy, security middleware, and Mongoose schema hook is explained with its exact purpose and code implementation.
    """
    story.append(Paragraph(ch3_intro, body_style))

    story.append(Paragraph("3.1 Express Bootstrap & Database Fallback Architecture", h2_style))
    
    db_explain = """
    <b>File: <code>backend/config/db.js</code> — Dual Database Connection Strategy</b><br/>
    To guarantee high reliability during demonstration, testing, or deployment in environments where local MongoDB may not be running, the database connection uses a unique automatic fallback mechanism:
    """
    story.append(Paragraph(db_explain, body_style))

    db_code = """
    const mongoose = require('mongoose');

    const connectDB = async () => {
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
      try {
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`[MongoDB] Connected to local database: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (err) {
        console.log(`[MongoDB Local] Failed. Starting MongoMemoryServer fallback...`);
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB Memory] In-Memory MongoDB running at: ${mongoUri}`);
        return conn;
      }
    };
    """
    story.append(Paragraph(esc(db_code), code_style))
    
    db_notes = """
    <b>Function Explanation (<code>connectDB</code>):</b><br/>
    1. First attempts connection to local MongoDB instance on port 27017 with a 2-second timeout (<code>serverSelectionTimeoutMS: 2000</code>).<br/>
    2. If local MongoDB is running, it logs host details and returns the active connection.<br/>
    3. If local connection fails (e.g. MongoDB service is stopped), the catch block dynamically initializes <code>MongoMemoryServer</code>, launching an in-memory MongoDB database instance in Node.js RAM and connects seamlessly.<br/>
    4. This ensures the project <b>NEVER crashes on initial startup</b> regardless of system setup!
    """
    story.append(Paragraph(db_notes, body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.2 Authentication & Authorization Middleware", h2_style))
    mid_explain = """
    <b>File: <code>backend/middleware/authMiddleware.js</code> — Route Protection & Role Control</b><br/>
    Security is maintained using JSON Web Tokens (JWT) and role validation middleware:
    """
    story.append(Paragraph(mid_explain, body_style))

    mid_code = """
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');

    // Protect routes - verifies JWT token from HTTP Authorization Header
    const protect = async (req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          token = req.headers.authorization.split(' ')[1]; // Extract token after 'Bearer '
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hostel_management_super_secret_jwt_key_2026');
          req.user = await User.findById(decoded.id).select('-password').populate('room');
          if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
          return next(); // Proceed to controller
        } catch (error) {
          return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      }
      if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    };

    // Role-based Guard - restricts route access to Admin role only
    const adminOnly = (req, res, next) => {
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
      }
    };
    """
    story.append(Paragraph(esc(mid_code), code_style))

    story.append(Paragraph("<b>Middleware Function Breakdown:</b>", h3_style))
    story.append(Paragraph("• <code>protect(req, res, next)</code>: Extracts the Bearer token from incoming request headers, decodes the JWT using the secret key to obtain the payload user ID, fetches the user from MongoDB omitting the password hash (<code>select('-password')</code>), populates room details, attaches the user object to <code>req.user</code>, and calls <code>next()</code>.", bullet_style))
    story.append(Paragraph("• <code>adminOnly(req, res, next)</code>: Checks if <code>req.user.role</code> equals <code>'admin'</code>. If true, calls <code>next()</code>; otherwise returns HTTP 403 Forbidden status.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.3 Mongoose Schemas & Pre-Save Lifecycle Hooks", h2_style))
    model_text = """
    The backend contains 5 core Mongoose models located in <code>backend/models/</code>:
    """
    story.append(Paragraph(model_text, body_style))

    models_table_data = [
        [Paragraph("<b>Model File</b>", h3_style), Paragraph("<b>Schema Fields & Internal Hooks/Methods</b>", h3_style)],
        [
            Paragraph("<b>User.js</b>", body_style),
            Paragraph("Fields: <code>fullName, email, password (select: false), role (admin/student), phone, rollNumber, collegeName, course, semester, fatherName, fatherPhone, dateOfBirth, room (ref: Room), status</code>.<br/>"
                      "• <b>Pre-Save Hook (<code>userSchema.pre('save')</code>):</b> Intercepts document saves. If password is modified, generates a 10-round salt via <code>bcrypt.genSalt(10)</code> and hashes the password before writing to DB.<br/>"
                      "• <b>Instance Method (<code>matchPassword</code>):</b> Asynchronously compares plaintext password against stored hash using <code>bcrypt.compare()</code>.", body_style)
        ],
        [
            Paragraph("<b>Room.js</b>", body_style),
            Paragraph("Fields: <code>number (unique), block, type (AC/Non-AC), capacity, occupiedBeds, occupants ([ref: User]), status (available/full/maintenance)</code>.<br/>"
                      "• <b>Pre-Save Hook (<code>roomSchema.pre('save')</code>):</b> Automatically computes room status before save. Sets status to <code>'full'</code> if <code>occupiedBeds >= capacity</code>, else <code>'available'</code>.", body_style)
        ],
        [
            Paragraph("<b>Complaint.js</b>", body_style),
            Paragraph("Fields: <code>student (ref: User), title, category (Maintenance/Electrical/Plumbing/Cleanliness/Mess/Wifi/Other), description, priority (low/medium/high), status (pending/in-progress/resolved), resolutionNote, resolutionDate</code>.", body_style)
        ],
        [
            Paragraph("<b>Leave.js</b>", body_style),
            Paragraph("Fields: <code>student (ref: User), reason, startDate, endDate, status (pending/approved/rejected), adminRemark</code>.", body_style)
        ],
        [
            Paragraph("<b>MessMenu.js</b>", body_style),
            Paragraph("Fields: <code>day (Monday-Sunday, unique), breakfast, lunch, snacks, dinner</code>.", body_style)
        ],
    ]
    models_table = Table(models_table_data, colWidths=[110, 394])
    models_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), c_light_bg),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(models_table)
    story.append(PageBreak())

    # CONTINUATION OF CHAPTER 3: CONTROLLERS AND FUNCTIONS
    story.append(Paragraph("3.4 Comprehensive Backend Controllers & Functions Reference", h2_style))
    ctrl_intro = """
    Below is the complete function inventory across all 6 backend controllers. Every function is documented with its HTTP route, permissions, arguments, logic execution flow, and database queries:
    """
    story.append(Paragraph(ctrl_intro, body_style))

    # AUTH CONTROLLER
    story.append(Paragraph("Auth Controller (<code>backend/controllers/authController.js</code>)", h3_style))
    story.append(Paragraph("1. <code>generateToken(id)</code>: Synchronously signs a JWT payload containing the user ID using <code>jwt.sign()</code> with a 30-day expiration window.", bullet_style))
    story.append(Paragraph("2. <code>loginUser(req, res)</code> [POST /api/auth/login]: Accepts email and password. Queries <code>User.findOne({ email }).select('+password').populate('room')</code> to retrieve the user along with the hidden password field. Invokes <code>user.matchPassword(password)</code>. If valid, generates a JWT token and responds with user data (password excluded).", bullet_style))
    story.append(Paragraph("3. <code>getMe(req, res)</code> [GET /api/auth/me]: Protected endpoint. Returns current user profile details using <code>req.user._id</code> populated with room info.", bullet_style))
    story.append(Paragraph("4. <code>updateProfile(req, res)</code> [PUT /api/auth/profile]: Protected endpoint. Allows users to update personal details (fullName, phone, parent info, course, semester) or change password. Saves updated document.", bullet_style))
    story.append(Spacer(1, 6))

    # STUDENT CONTROLLER
    story.append(Paragraph("Student Controller (<code>backend/controllers/studentController.js</code>)", h3_style))
    story.append(Paragraph("1. <code>registerStudent(req, res)</code> [POST /api/students] (Admin Only): Registers a new student account. Checks if email already exists. If <code>roomId</code> is provided, validates that target room capacity is not exceeded, creates user with role <code>'student'</code>, pushes student ID to <code>room.occupants</code>, updates <code>occupiedBeds</code> count, and saves both documents.", bullet_style))
    story.append(Paragraph("2. <code>getAllStudents(req, res)</code> [GET /api/students] (Admin Only): Retrieves all student records. Supports dynamic filtering via query parameters: <code>search</code> (case-insensitive regex search using <code>$or</code> matching name, email, roll number), <code>course</code>, and <code>semester</code>. Populates room details.", bullet_style))
    story.append(Paragraph("3. <code>getStudentById(req, res)</code> [GET /api/students/:id]: Fetches single student profile by ID.", bullet_style))
    story.append(Paragraph("4. <code>updateStudent(req, res)</code> [PUT /api/students/:id] (Admin Only): Updates student details. Includes <b>Room Re-allocation Engine</b>: If <code>newRoomId</code> differs from current room, it pulls student ID from old room using <code>Room.findByIdAndUpdate(oldRoom, { $pull: { occupants: id }, $inc: { occupiedBeds: -1 } })</code>, checks target room capacity, pushes student ID to new room, and updates student document.", bullet_style))
    story.append(Paragraph("5. <code>deleteStudent(req, res)</code> [DELETE /api/students/:id] (Admin Only): Deletes student record. Automatically releases allocated bed in the assigned room by pulling student ID from room occupants array and decrementing <code>occupiedBeds</code> count.", bullet_style))
    story.append(Spacer(1, 6))

    # ROOM CONTROLLER
    story.append(Paragraph("Room Controller (<code>backend/controllers/roomController.js</code>)", h3_style))
    story.append(Paragraph("1. <code>getRooms(req, res)</code> [GET /api/rooms]: Returns room list. Supports filter queries by room <code>type</code> (AC/Non-AC) and <code>status</code> (available/full/maintenance). Populates occupant details.", bullet_style))
    story.append(Paragraph("2. <code>createRoom(req, res)</code> [POST /api/rooms] (Admin Only): Validates unique room number and capacity, initializes room object with 0 occupied beds.", bullet_style))
    story.append(Paragraph("3. <code>updateRoom(req, res)</code> [PUT /api/rooms/:id] (Admin Only): Edits room block, type, capacity, or maintenance status. Rejects capacity reduction below current occupant count.", bullet_style))
    story.append(Paragraph("4. <code>deleteRoom(req, res)</code> [DELETE /api/rooms/:id] (Admin Only): Deletes room. Prevents deletion if room has active occupants (requires deallocation first).", bullet_style))
    story.append(Paragraph("5. <code>allocateBed(req, res)</code> [POST /api/rooms/:id/allocate] (Admin Only): Direct bed allocation endpoint. Takes <code>studentId</code>, verifies room capacity, removes student from previous room if applicable, pushes student to target room, and updates student.room reference.", bullet_style))
    story.append(Paragraph("6. <code>deallocateBed(req, res)</code> [POST /api/rooms/:id/deallocate] (Admin Only): Removes student from room occupants list and sets <code>student.room = null</code>.", bullet_style))
    story.append(Spacer(1, 6))

    # COMPLAINT CONTROLLER
    story.append(Paragraph("Complaint Controller (<code>backend/controllers/complaintController.js</code>)", h3_style))
    story.append(Paragraph("1. <code>createComplaint(req, res)</code> [POST /api/complaints] (Student): Lodges a new complaint with title, category, description, and priority level.", bullet_style))
    story.append(Paragraph("2. <code>getComplaints(req, res)</code> [GET /api/complaints]: Context-aware list query. If requester is a student, returns only complaints filed by that student (<code>query.student = req.user._id</code>). If requester is an admin, returns all complaints populated with student and room info.", bullet_style))
    story.append(Paragraph("3. <code>updateComplaint(req, res)</code> [PUT /api/complaints/:id]: Dual-role function. If student, allows editing title/description of own complaint. If admin, allows updating status (pending/in-progress/resolved), appending resolution notes, and setting resolution timestamp.", bullet_style))
    story.append(Paragraph("4. <code>deleteComplaint(req, res)</code> [DELETE /api/complaints/:id]: Removes complaint record after verifying user ownership or admin rights.", bullet_style))
    story.append(Spacer(1, 6))

    # LEAVE CONTROLLER
    story.append(Paragraph("Leave Controller (<code>backend/controllers/leaveController.js</code>)", h3_style))
    story.append(Paragraph("1. <code>createLeave(req, res)</code> [POST /api/leaves] (Student): Submits leave application with reason, start date, end date.", bullet_style))
    story.append(Paragraph("2. <code>getLeaves(req, res)</code> [GET /api/leaves]: Returns leaves filtered by student ID if student, or all leaves if admin.", bullet_style))
    story.append(Paragraph("3. <code>updateLeave(req, res)</code> [PUT /api/leaves/:id]: Student can edit reason/dates if leave is still pending. Admin can approve or reject leave application and attach admin remarks.", bullet_style))
    story.append(Paragraph("4. <code>deleteLeave(req, res)</code> [DELETE /api/leaves/:id]: Deletes leave request.", bullet_style))
    story.append(Spacer(1, 6))

    # MESS CONTROLLER & SEED SCRIPT
    story.append(Paragraph("Mess Controller & Seed Script", h3_style))
    story.append(Paragraph("1. <code>getMessMenu(req, res)</code> [GET /api/mess]: Returns full weekly meal plan sorted in natural weekday order (Monday -> Sunday).", bullet_style))
    story.append(Paragraph("2. <code>updateMessMenu(req, res)</code> [POST /api/mess & PUT /api/mess/:id] (Admin Only): Updates or inserts meal schedule (breakfast, lunch, snacks, dinner) for a given day.", bullet_style))
    story.append(Paragraph("3. <code>deleteMessMenu(req, res)</code> [DELETE /api/mess/:id] (Admin Only): Deletes mess schedule entry.", bullet_style))
    story.append(Paragraph("4. <code>seedInitialData()</code> [backend/seed.js]: Runs automatically on server startup. Checks if admin exists. If empty, creates default Admin account (<code>admin@hostel.com</code> / <code>admin123</code>), sample student account, sample rooms, and populates 7 days of default mess menus.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 4: FRONTEND CODE DEEP DIVE & FUNCTIONS
    # =========================================================================
    story.append(Paragraph("Chapter 4: Frontend Code Deep Dive & React Component Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch4_intro = """
    The frontend is built with React 18, React Router v6, Axios, and custom glassmorphism styling. This chapter details global state management, HTTP interceptors, routing guards, and UI components.
    """
    story.append(Paragraph(ch4_intro, body_style))

    story.append(Paragraph("4.1 Global Axios HTTP Interceptor", h2_style))
    axios_text = """
    <b>File: <code>frontend/src/api/axios.js</code></b><br/>
    Instead of manually adding authorization headers in every single API call across components, a central Axios instance with a request interceptor automatically injects the JWT Bearer token:
    """
    story.append(Paragraph(axios_text, body_style))

    axios_code = """
    import axios from 'axios';

    const API = axios.create({
      baseURL: '/api', // Relative path proxied by Vite dev server to localhost:5000
    });

    // Request Interceptor: Executed before every outgoing HTTP request
    API.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    export default API;
    """
    story.append(Paragraph(esc(axios_code), code_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("4.2 Central State Management — AuthContext", h2_style))
    ctx_text = """
    <b>File: <code>frontend/src/context/AuthContext.jsx</code></b><br/>
    Manages user authentication state, token persistence, and profile re-fetching globally across the React application tree:
    """
    story.append(Paragraph(ctx_text, body_style))

    ctx_code = """
    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(localStorage.getItem('token') || null);
      const [loading, setLoading] = useState(true);

      const fetchCurrentUser = async () => {
        if (!token) { setLoading(false); return; }
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) setUser(res.data.user);
        } catch (err) {
          logout();
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => { fetchCurrentUser(); }, [token]);

      const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          setToken(res.data.token);
          setUser(res.data.user);
          return res.data;
        }
      };

      const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      };

      return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser: fetchCurrentUser }}>
          {children}
        </AuthContext.Provider>
      );
    };
    """
    story.append(Paragraph(esc(ctx_code), code_style))

    story.append(Paragraph("<b>AuthContext State Methods Explained:</b>", h3_style))
    story.append(Paragraph("• <code>login(email, password)</code>: Sends credentials to <code>/api/auth/login</code>. On success, stores token in <code>localStorage</code>, updates React state, and triggers app re-render.", bullet_style))
    story.append(Paragraph("• <code>logout()</code>: Clears token from <code>localStorage</code> and resets <code>user</code> and <code>token</code> states to <code>null</code>, causing immediate redirection to login.", bullet_style))
    story.append(Paragraph("• <code>fetchCurrentUser()</code>: Validates active token on page refresh by calling <code>GET /api/auth/me</code> and restoring user profile.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("4.3 Route Security & Guard Architecture — App.jsx", h2_style))
    app_text = """
    <b>File: <code>frontend/src/App.jsx</code></b><br/>
    Implements route protection and role-based access guards using custom wrapper components:
    """
    story.append(Paragraph(app_text, body_style))

    app_code = """
    const ProtectedRoute = ({ children, allowedRole }) => {
      const { user, loading } = useContext(AuthContext);

      if (loading) return <div>Loading application...</div>;
      if (!user) return <Navigate to="/login" replace />;
      if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
      }
      return children;
    };
    """
    story.append(Paragraph(esc(app_code), code_style))

    story.append(Paragraph("<b>Protected Route Logic Flow:</b>", h3_style))
    story.append(Paragraph("1. If <code>loading</code> is true (token verification in progress), displays a smooth loading indicator.", bullet_style))
    story.append(Paragraph("2. If <code>user</code> is null (unauthenticated), redirects immediately to <code>/login</code>.", bullet_style))
    story.append(Paragraph("3. If <code>allowedRole</code> is specified and does not match <code>user.role</code> (e.g., student trying to access <code>/admin/rooms</code>), redirects the user to their authorized portal dashboard.", bullet_style))
    story.append(Paragraph("4. If all checks pass, renders the protected component tree inside <code>PortalLayout</code> (Navbar + Sidebar).", bullet_style))
    story.append(PageBreak())

    # CONTINUATION OF FRONTEND PAGES
    story.append(Paragraph("4.4 Complete Frontend Pages & UI Component Catalog", h2_style))
    
    pages_table_data = [
        [Paragraph("<b>Component / Page</b>", h3_style), Paragraph("<b>Path & Key Features / Logic</b>", h3_style)],
        [
            Paragraph("<b>Navbar.jsx</b>", body_style),
            Paragraph("Top header. Displays logged-in user name, role badge ('Admin' or 'Student'), institution name, and logout button calling <code>logout()</code>.", body_style)
        ],
        [
            Paragraph("<b>Sidebar.jsx</b>", body_style),
            Paragraph("Navigation sidebar. Dynamically renders links tailored to user role (Admin: Dashboard, Students, Rooms, Mess, Complaints, Leaves; Student: Dashboard, Profile, Complaints, Leaves, Mess). Highlights active link using <code>useLocation()</code>.", body_style)
        ],
        [
            Paragraph("<b>Home.jsx</b>", body_style),
            Paragraph("Public landing page (<code>/</code>). Features hero section, platform statistics counter, feature cards, and quick portal login buttons.", body_style)
        ],
        [
            Paragraph("<b>Login.jsx</b>", body_style),
            Paragraph("Auth form (<code>/login</code>). Features role toggle preview, form validation, error banners, and pre-filled quick login preset buttons for Admin and Student accounts.", body_style)
        ],
        [
            Paragraph("<b>AdminDashboard.jsx</b>", body_style),
            Paragraph("Admin portal root (<code>/admin</code>). Displays 4 stat cards (Total Students, Occupied Beds, Pending Complaints, Leave Requests), recent activities list, and quick action shortcuts.", body_style)
        ],
        [
            Paragraph("<b>StudentManagement.jsx</b>", body_style),
            Paragraph("Admin page (<code>/admin/students</code>). Full student table with live search, filters by course/semester, register student modal, edit student modal, room allocation dropdown, and delete student trigger.", body_style)
        ],
        [
            Paragraph("<b>RoomManagement.jsx</b>", body_style),
            Paragraph("Admin page (<code>/admin/rooms</code>). Visual room grid displaying block, type, capacity, occupants list, add room modal, bed allocation modal, and maintenance toggle switch.", body_style)
        ],
        [
            Paragraph("<b>AdminMessMenu.jsx</b>", body_style),
            Paragraph("Admin page (<code>/admin/mess</code>). Day-by-day tabbed menu manager allowing admins to edit breakfast, lunch, snacks, and dinner menus.", body_style)
        ],
        [
            Paragraph("<b>AdminComplaints.jsx</b>", body_style),
            Paragraph("Admin page (<code>/admin/complaints</code>). Complaints dashboard with status filter tabs, modal to update complaint status (pending -> resolved) and add resolution notes.", body_style)
        ],
        [
            Paragraph("<b>AdminLeaveManagement.jsx</b>", body_style),
            Paragraph("Admin page (<code>/admin/leave</code>). Leave request management portal featuring approve/reject actions and admin remark modal.", body_style)
        ],
        [
            Paragraph("<b>StudentDashboard.jsx</b>", body_style),
            Paragraph("Student portal root (<code>/student</code>). Overview cards showing personal room allocation, room-mates list, complaint status, leave status, and today's mess menu.", body_style)
        ],
        [
            Paragraph("<b>StudentProfile.jsx</b>", body_style),
            Paragraph("Student page (<code>/student/profile</code>). Displays student profile card, academic info, parent contact details, and edit profile form.", body_style)
        ],
        [
            Paragraph("<b>StudentComplaints.jsx</b>", body_style),
            Paragraph("Student page (<code>/student/complaints</code>). Complaint submission form with category & priority selectors, complaint history list, and delete option.", body_style)
        ],
        [
            Paragraph("<b>StudentLeave.jsx</b>", body_style),
            Paragraph("Student page (<code>/student/leave</code>). Leave application form with start/end date pickers, leave history table, status badges, and admin remarks view.", body_style)
        ],
        [
            Paragraph("<b>StudentMessMenu.jsx</b>", body_style),
            Paragraph("Student page (<code>/student/mess</code>). Interactive 7-day mess schedule view with meal highlights.", body_style)
        ],
    ]
    pages_table = Table(pages_table_data, colWidths=[130, 374])
    pages_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), c_light_bg),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(pages_table)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5: COMPLETE SYSTEM WORKFLOWS & DATA LIFECYCLES
    # =========================================================================
    story.append(Paragraph("Chapter 5: Complete End-to-End System Workflows", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch5_intro = """
    This chapter maps out the step-by-step execution path for key application features from user interaction on the React frontend to database mutation in MongoDB.
    """
    story.append(Paragraph(ch5_intro, body_style))

    story.append(Paragraph("5.1 Workflow 1: Authentication & Protected Session Lifecycle", h2_style))
    wf1_text = """
    <b>Sequence Steps:</b><br/>
    1. User enters email and password on <code>Login.jsx</code> and submits form.<br/>
    2. React calls <code>login(email, password)</code> in <code>AuthContext</code>.<br/>
    3. Axios issues <code>POST /api/auth/login</code> request to backend Express server.<br/>
    4. <code>authController.loginUser</code> finds user in MongoDB, verifies password hash using <code>user.matchPassword(password)</code>.<br/>
    5. If match succeeds, backend calls <code>generateToken(user._id)</code> to create signed JWT and responds with HTTP 200 JSON payload containing token and user details.<br/>
    6. <code>AuthContext</code> saves JWT in <code>localStorage</code> and updates React state.<br/>
    7. <code>App.jsx</code> re-renders; <code>ProtectedRoute</code> verifies role and routes user to <code>/admin</code> or <code>/student</code>.<br/>
    8. On subsequent API calls, Axios Request Interceptor automatically attaches <code>Authorization: Bearer &lt;token&gt;</code>.<br/>
    9. Backend <code>protect</code> middleware intercepts request, verifies JWT signature, attaches <code>req.user</code>, and permits request completion.
    """
    story.append(Paragraph(wf1_text, body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("5.2 Workflow 2: Student Registration & Room Bed Synchronization Flow", h2_style))
    wf2_text = """
    <b>Sequence Steps:</b><br/>
    1. Admin opens <code>StudentManagement.jsx</code> and clicks 'Register Student'.<br/>
    2. Admin fills student details and selects a target room (e.g. Room A-101) from room dropdown.<br/>
    3. React calls <code>API.post('/students', formData)</code>.<br/>
    4. <code>studentController.registerStudent</code> checks if email is unique and queries target Room.<br/>
    5. Controller verifies room capacity: <code>if (room.occupiedBeds &gt;= room.capacity)</code> return HTTP 400 'Room full'.<br/>
    6. Controller creates new <code>User</code> document with <code>role: 'student'</code> and <code>room: roomId</code>.<br/>
    7. Pre-save hook in <code>User.js</code> automatically hashes student password with Bcrypt.<br/>
    8. Controller pushes student <code>_id</code> to <code>room.occupants</code> array and increments <code>occupiedBeds</code> count.<br/>
    9. Pre-save hook in <code>Room.js</code> calculates new status (<code>'full'</code> or <code>'available'</code>).<br/>
    10. Both documents saved to MongoDB. React re-fetches student list and updates UI.
    """
    story.append(Paragraph(wf2_text, body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("5.3 Workflow 3: Complaint Submission to Admin Resolution Lifecycle", h2_style))
    wf3_text = """
    <b>Sequence Steps:</b><br/>
    1. Student visits <code>StudentComplaints.jsx</code>, selects category (e.g. 'Plumbing'), priority ('High'), enters description, and submits.<br/>
    2. React calls <code>API.post('/complaints', payload)</code>.<br/>
    3. Backend creates <code>Complaint</code> document linking <code>student: req.user._id</code> with default status <code>'pending'</code>.<br/>
    4. Admin views <code>AdminComplaints.jsx</code>. Request calls <code>GET /api/complaints</code>. Admin sees complaint populated with student name, roll number, and room number.<br/>
    5. Admin opens resolution modal, updates status to <code>'resolved'</code>, types note ('Plumber fixed leaky pipe'), and submits.<br/>
    6. Backend <code>updateComplaint</code> sets <code>status = 'resolved'</code>, <code>resolutionNote</code>, and <code>resolutionDate = new Date()</code>.<br/>
    7. Student views dashboard/complaint list and sees complaint badge updated to green 'Resolved' with admin resolution note.
    """
    story.append(Paragraph(wf3_text, body_style))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 6: ESSENTIAL & ADVANCED MERN CONCEPTS (BEYOND PROJECT SCOPE)
    # =========================================================================
    story.append(Paragraph("Chapter 6: Essential & Advanced MERN Concepts (Beyond Project Scope)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch6_intro = """
    To impress senior interviewers, you should demonstrate knowledge of advanced MERN stack production techniques, performance optimization strategies, and architectural enhancements beyond the current scope of this project.
    """
    story.append(Paragraph(ch6_intro, body_style))

    story.append(Paragraph("6.1 Advanced MongoDB Concepts", h2_style))
    story.append(Paragraph("• <b>MongoDB Aggregation Pipeline:</b> A powerful multi-stage framework for data transformation and analytics. Operations pass through stages like <code>$match</code> (filtering), <code>$group</code> (aggregating statistics), <code>$lookup</code> (performing SQL-style left outer joins between collections), and <code>$project</code> (shaping output fields).", bullet_style))
    story.append(Paragraph("• <b>Database Indexing Strategies:</b> Creating single-field or compound indexes (e.g. <code>userSchema.index({ email: 1, rollNumber: 1 })</code>) drastically reduces query execution time from BSON document scans to O(log N) B-Tree index lookups.", bullet_style))
    story.append(Paragraph("• <b>ACID Multi-Document Transactions:</b> MongoDB supports ACID transactions using sessions (<code>session = await mongoose.startSession(); session.startTransaction()</code>). Ensures that complex operations (like room transfer) either complete entirely or roll back cleanly if an error occurs.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("6.2 Advanced Express & Node.js Production Patterns", h2_style))
    story.append(Paragraph("• <b>Global Error Handling Middleware:</b> Express allows registering a central 4-argument error handling middleware <code>app.use((err, req, res, next) =&gt; {})</code> to catch uncaught async errors and format clean JSON responses without crashing Node process.", bullet_style))
    story.append(Paragraph("• <b>Rate Limiting & Security Hardening:</b> Implementing <code>express-rate-limit</code> prevents brute-force login attacks by restricting request velocity per IP address. Packages like <code>helmet</code> sanitize HTTP response headers.", bullet_style))
    story.append(Paragraph("• <b>Real-Time WebSockets (Socket.io):</b> Integrating Socket.io alongside Express enables bi-directional event communication for instant real-time notifications (e.g. notifying student live when their leave application is approved).", bullet_style))
    story.append(Paragraph("• <b>File Upload Middleware (Multer + Cloudinary):</b> Using <code>multer</code> to process multipart form uploads allows students to upload complaint photo evidence directly to cloud storage like AWS S3 or Cloudinary.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("6.3 Advanced React & State Management Patterns", h2_style))
    story.append(Paragraph("• <b>Context API vs Redux Toolkit:</b> While React Context is ideal for small to medium state (like user auth), Redux Toolkit or RTK Query is preferred for high-frequency state updates, complex global caching, and predictable time-travel debugging.", bullet_style))
    story.append(Paragraph("• <b>React Performance Optimization Hooks:</b> Using <code>useMemo</code> (caches computed calculation results) and <code>useCallback</code> (memoizes callback functions) prevents unnecessary re-rendering of child components.", bullet_style))
    story.append(Paragraph("• <b>Code Splitting & Lazy Loading:</b> Wrapping route components with <code>React.lazy()</code> and <code>&lt;Suspense&gt;</code> breaks frontend JavaScript bundles into smaller chunks loaded on-demand, accelerating initial page render speed.", bullet_style))
    story.append(Paragraph("• <b>Client-Side Rendering (CSR) vs Server-Side Rendering (SSR):</b> Vite/React uses CSR where JavaScript executes in browser. Next.js offers SSR and Static Site Generation (SSG), improving SEO and initial page load speed.", bullet_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("6.4 Containerization & Production Deployment", h2_style))
    story.append(Paragraph("• <b>Docker Containerization:</b> Packaging backend and frontend services into container images using <code>Dockerfile</code> and orchestrating multi-container execution via <code>compose.yaml</code> guarantees identical environment behavior across development and production.", bullet_style))
    story.append(Paragraph("• <b>Nginx Reverse Proxy:</b> In production, Nginx sits in front of Node.js to serve static frontend build assets, terminate SSL/TLS certificates, handle gzip compression, and forward API calls to backend Express processes.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 7: MASTER JOB INTERVIEW GUIDE & PRACTICE Q&A
    # =========================================================================
    story.append(Paragraph("Chapter 7: Master Job Interview Guide & Technical Q&A", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=0, spaceAfter=12))

    ch7_intro = """
    This chapter is your secret weapon for technical job interviews. It begins with a professional 2-minute elevator pitch script to present this project, followed by 25 high-yield interview questions and model answers spanning backend, frontend, security, and architecture.
    """
    story.append(Paragraph(ch7_intro, body_style))

    story.append(Paragraph("7.1 How to Present this Project in an Interview (The 2-Minute Pitch)", h2_style))
    pitch_box = """
    <b>Candidate Pitch Script:</b><br/>
    \"I developed <b>HostelHub</b>, a full-stack MERN web application designed to automate student residential management, room allocations, leave applications, complaints resolution, and mess scheduling.<br/><br/>
    On the <b>backend</b>, I built a RESTful API using Node.js and Express.js, backed by MongoDB with Mongoose ODM. I implemented a robust JWT authentication system with Bcrypt password hashing and role-based middleware to strictly isolate Admin and Student capabilities. To ensure high availability, I engineered a dual database connection fallback using MongoMemoryServer whenever local MongoDB is offline.<br/><br/>
    On the <b>frontend</b>, I built a single-page application using React 18 and React Router DOM v6. I designed a centralized state management architecture using React Context API and configured Axios interceptors to automatically attach JWT Bearer tokens to outgoing HTTP requests. I also implemented dynamic room capacity validation, multi-field student searching, and custom glassmorphism styling.<br/><br/>
    The project solved key real-world challenges like automated bed occupancy tracking and room re-allocation synchronization using MongoDB <code>$pull</code> and <code>$inc</code> operations.\"
    """
    story.append(Paragraph(pitch_box, callout_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("7.2 Top 25 Technical Interview Questions & Model Answers", h2_style))

    qas = [
        ("Q1: Explain the MERN architecture of your hostel management project.",
         "MERN is a 3-tier architecture: React handles the client-side presentation layer; Express.js running on Node.js handles the application logic layer and REST APIs; MongoDB with Mongoose handles the database data layer. Data flows via JSON over HTTP REST requests authenticated by JWT tokens."),
        
        ("Q2: How does JWT authentication work in your application?",
         "When a user logs in via POST /api/auth/login, authController verifies their password hash. Upon success, jwt.sign() creates a signed JWT token containing the user ID with a 30-day expiration. The token is sent to the client and saved in localStorage. On subsequent requests, an Axios interceptor attaches it to the Authorization header as 'Bearer <token>'. The authMiddleware decodes and verifies the token using the server secret key, attaches req.user, and permits access."),

        ("Q3: How did you implement authorization for Admin vs Student roles?",
         "I built a two-tier middleware guard system in authMiddleware.js. First, protect() verifies token validity and attaches req.user. Next, adminOnly() checks if req.user.role === 'admin'. If a student tries to hit an admin route (e.g. PUT /api/rooms/:id), adminOnly() returns HTTP 403 Forbidden. On the React frontend, ProtectedRoute checks user.role and redirects unauthorized users to their appropriate dashboard."),

        ("Q4: How does Mongoose .populate() work in your project?",
         "Mongoose .populate() performs reference resolution similar to a SQL JOIN. In my User model, the room field stores an ObjectId pointing to the Room collection. When querying students or complaints, calling .populate('room') or .populate('student') instructs Mongoose to execute a secondary query under the hood to fetch matching documents from the referenced collection and inline them into the parent object."),

        ("Q5: How do you handle room capacity concurrency during student allocation?",
         "Before assigning a student to a room in studentController or roomController, the backend explicitly checks room capacity: if (room.occupiedBeds >= room.capacity) return status 400 'Room full'. When a student is assigned, room.occupants.push(student._id) and room.occupiedBeds = room.occupants.length are saved. Additionally, roomSchema.pre('save') automatically re-evaluates and updates room status to 'full' if occupiedBeds equals capacity."),

        ("Q6: Why did you implement a dual database connection fallback (MongoMemoryServer)?",
         "To ensure bulletproof startup reliability. In config/db.js, connectDB first attempts connecting to local MongoDB (port 27017) with a 2000ms timeout. If local MongoDB service is stopped, the catch block dynamically imports and spawns MongoMemoryServer, running an in-memory MongoDB database instance directly in Node RAM. This guarantees the app runs smoothly in any test environment without crashing."),

        ("Q7: What is the difference between User.save() and User.findByIdAndUpdate() regarding pre-save hooks?",
         "User.save() triggers Mongoose pre('save') middleware hooks (which hashes passwords with Bcrypt). findByIdAndUpdate() bypasses document pre-save hooks because it executes directly as a MongoDB update command. Therefore, when updating passwords in my controllers, I fetch the document instance and call user.save() to ensure password hashing executes properly."),

        ("Q8: How does password hashing work in your User.js schema?",
         "In User.js, I defined a userSchema.pre('save') hook. Before saving a user document, it checks if (!this.isModified('password')). If modified, it generates a 10-round salt using bcrypt.genSalt(10) and hashes the plain password using bcrypt.hash(). For authentication, I added a schema instance method matchPassword(enteredPassword) which calls bcrypt.compare()."),

        ("Q9: How does the Axios request interceptor work in frontend/src/api/axios.js?",
         "An interceptor acts as frontend HTTP middleware. Before any API request is sent, API.interceptors.request.use() intercepts the configuration object, reads the token from localStorage.getItem('token'), and if present, appends config.headers.Authorization = 'Bearer ' + token. This ensures all components can make authenticated calls without duplicating header code."),

        ("Q10: How does React Context API manage global auth state?",
         "AuthContext creates a centralized React state tree storing user, token, and loading. AuthProvider wraps the root App component, exposing login, logout, and refreshUser methods via Context Provider value. Any nested component can consume context using useContext(AuthContext), avoiding prop drilling."),

        ("Q11: How does room re-allocation handle releasing old room beds?",
         "When updating a student's room in studentController.updateStudent, if newRoomId differs from existing room, the backend issues Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id }, $inc: { occupiedBeds: -1 } }). This atomically removes the student ID from the old room's occupants array and decrements occupiedBeds by 1 before adding the student to the new room."),

        ("Q12: How do you prevent sensitive password fields from leaking in API responses?",
         "In User.js schema, the password field is defined with select: false. This excludes password hashes by default from Mongoose query results. When login explicitly requires password verification, I explicitly chain .select('+password'). After verification, I convert the user document to object (user.toObject()) and delete userObj.password before sending JSON to client."),

        ("Q13: What is the purpose of $pull and $inc operators in MongoDB?",
         "$pull is an array update operator that removes all instances of a value matching a condition from an array. $inc increments or decrements a numeric field by a specified value. I used them together during student deletion and room deallocation to atomically update room occupancy."),

        ("Q14: How would you scale this application to support 50,000 students across multiple campuses?",
         "I would implement: 1) MongoDB Sharding based on campusId hash key; 2) Redis Caching layer for mess menus and room availability; 3) Database indexing on student email, roll number, and room IDs; 4) Stateless Node.js microservices load-balanced by Nginx; 5) CDN for static asset delivery."),

        ("Q15: How would you add real-time notifications for complaint resolution?",
         "I would integrate Socket.io into the Express server and establish a WebSocket connection in React. When an admin updates complaint status to 'resolved', backend emits a socket event 'complaint_updated' targeting the specific student socket channel, triggering an instant toast notification in the student UI."),

        ("Q16: How do you prevent unauthorized students from modifying other students' leave requests?",
         "In leaveController.js and complaintController.js, the update and delete routes verify ownership: if (leave.student.toString() !== req.user._id.toString()) return res.status(403).json('Not authorized'). This ensures students can only modify documents where student ObjectId matches req.user._id."),

        ("Q17: What HTTP status codes are used in your REST API and why?",
         "200 OK (successful request), 201 Created (resource created like student registration), 400 Bad Request (missing required fields or validation failure), 401 Unauthorized (missing or invalid JWT token), 403 Forbidden (role permission failure), 404 Not Found (resource does not exist), and 500 Internal Server Error (uncaught backend exceptions)."),

        ("Q18: What is CORS and why is it needed in a MERN project?",
         "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making API requests to a domain/port different from the one that served the web page. Since React frontend runs on port 3000/5173 and Node backend runs on port 5000 during dev, app.use(cors()) enables cross-origin HTTP requests."),

        ("Q19: What is the difference between useEffect and useState in React?",
         "useState is a hook for declaring dynamic local state variables inside functional components that trigger UI re-renders on change. useEffect is a lifecycle hook for performing side effects (like data fetching, event subscriptions, or DOM manual mutations) in response to component mounting or state dependency changes."),

        ("Q20: How does express.json() middleware work?",
         "express.json() is built-in Express middleware based on body-parser. It parses incoming HTTP request payloads with JSON headers, converts raw buffer payloads into JavaScript objects, and populates req.body."),

        ("Q21: What is the difference between Relational (SQL) and Non-Relational (NoSQL) databases?",
         "SQL databases (like PostgreSQL) store data in structured tables with fixed schemas and foreign key constraints. NoSQL databases (like MongoDB) store data in flexible BSON documents, allowing dynamic schemas, embedded arrays, and horizontal scaling across clusters."),

        ("Q22: How do you handle database errors gracefully in async controller functions?",
         "Every controller function is wrapped in try-catch blocks. If a Mongoose query or operation throws an error (e.g. duplicate key validation failure), the catch (err) block catches the exception and returns res.status(500).json({ success: false, message: err.message }) preventing Node server crashes."),

        ("Q23: What is Docker containerization and how is it used in this project?",
         "Docker packages code, Node runtime, dependencies, and configuration into isolated lightweight containers. The compose.yaml file orchestrates backend Express service, frontend Vite service, and MongoDB database service in isolated networks for seamless deployment."),

        ("Q24: What is the purpose of seed.js in your codebase?",
         "seed.js is an initialization script executed on backend startup. It checks if an admin account exists. If not, it populates default admin credentials, sample rooms, and a 7-day default mess menu so the application is immediately testable upon first launch."),

        ("Q25: If you had 2 weeks more, what features would you add to improve this project?",
         "I would add: 1) Online Hostel Fee Payment Gateway integration (Razorpay/Stripe); 2) Automated SMS/Email alerts to parents using Twilio/Nodemailer; 3) QR Code digital gate pass generation for leaves; 4) Student feedback analytics dashboard for mess food quality.")
    ]

    for q, a in qas:
        story.append(Paragraph(esc(q), qa_q_style))
        story.append(Paragraph(esc(a), qa_a_style))
        story.append(Spacer(1, 4))

    # BUILD DOCUMENT
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
