const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save as: jobId_originalname
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept PDF, DOC, DOCX files
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const dbPath = path.join(__dirname, 'jobs.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create jobs table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT,
    appliedDate TEXT,
    status TEXT DEFAULT 'Applied',
    notes TEXT,
    salary TEXT,
    contactPerson TEXT,
    jobUrl TEXT,
    cvPath TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Add cvPath column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE jobs ADD COLUMN cvPath TEXT`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding cvPath column:', err.message);
    }
  });
});

// Routes

// Get all jobs
app.get('/api/jobs', (req, res) => {
  db.all('SELECT * FROM jobs ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single job
app.get('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM jobs WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(row);
  });
});

// Create new job
app.post('/api/jobs', (req, res) => {
  const { company, position, location, appliedDate, status, notes, salary, contactPerson, jobUrl, cvPath } = req.body;
  
  if (!company || !position) {
    res.status(400).json({ error: 'Company and position are required' });
    return;
  }

  const sql = `INSERT INTO jobs (company, position, location, appliedDate, status, notes, salary, contactPerson, jobUrl, cvPath) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [company, position, location, appliedDate, status, notes, salary, contactPerson, jobUrl, cvPath], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Job created successfully' });
  });
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  const { company, position, location, appliedDate, status, notes, salary, contactPerson, jobUrl, cvPath } = req.body;
  
  const sql = `UPDATE jobs SET 
    company = ?, position = ?, location = ?, appliedDate = ?, status = ?, 
    notes = ?, salary = ?, contactPerson = ?, jobUrl = ?, cvPath = ?, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?`;
  
  db.run(sql, [company, position, location, appliedDate, status, notes, salary, contactPerson, jobUrl, cvPath, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ message: 'Job updated successfully' });
  });
});

// Update job status only
app.patch('/api/jobs/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const sql = 'UPDATE jobs SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.run(sql, [status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM jobs WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ message: 'Job deleted successfully' });
  });
});

// Get job statistics
app.get('/api/jobs/stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as applied,
      SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) as interview,
      SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END) as offer,
      SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
    FROM jobs
  `;
  
  db.get(sql, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Upload CV for a job
app.post('/api/jobs/:id/cv', upload.single('cv'), (req, res) => {
  const id = req.params.id;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;
  
  // Update job with CV path
  db.run('UPDATE jobs SET cvPath = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
    [filePath, id], 
    function(err) {
      if (err) {
        // Delete uploaded file if database update fails
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        // Delete uploaded file if job not found
        fs.unlinkSync(req.file.path);
        res.status(404).json({ error: 'Job not found' });
        return;
      }
      res.json({ 
        message: 'CV uploaded successfully',
        filePath: filePath,
        fileName: req.file.originalname
      });
    }
  );
});

// Download CV for a job
app.get('/api/jobs/:id/cv', (req, res) => {
  const id = req.params.id;
  
  db.get('SELECT cvPath FROM jobs WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row || !row.cvPath) {
      res.status(404).json({ error: 'No CV found for this job' });
      return;
    }
    
    const filePath = path.join(__dirname, row.cvPath);
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'CV file not found' });
      return;
    }
    
    res.sendFile(filePath);
  });
});

// Delete CV for a job
app.delete('/api/jobs/:id/cv', (req, res) => {
  const id = req.params.id;
  
  db.get('SELECT cvPath FROM jobs WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row || !row.cvPath) {
      res.status(404).json({ error: 'No CV found for this job' });
      return;
    }
    
    const filePath = path.join(__dirname, row.cvPath);
    
    // Delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Update database
    db.run('UPDATE jobs SET cvPath = NULL, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
      [id], 
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'CV deleted successfully' });
      }
    );
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Job Tracker API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
