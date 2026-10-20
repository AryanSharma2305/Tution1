import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbManager } from './src/server/db.ts';
import { BoardType, GradeLevel, SubjectName, TutorProfile, Enquiry, User } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper to authenticate user from Authorization header
const getAuthUser = (req: express.Request): User | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const db = dbManager.getDatabase();
  const user = db.users.find((u) => u.id === token || u.email.toLowerCase() === token.toLowerCase());
  return user || null;
};

// ==========================================
// REST API ROUTES (/api/*)
// ==========================================

// 1. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Explicit check for Administrator credentials as requested
  if (cleanEmail === 'admin@gmail.com' && cleanPass === 'admin@123') {
    const db = dbManager.getDatabase();
    let admin = db.users.find((u) => u.email.toLowerCase() === 'admin@gmail.com');
    if (!admin) {
      admin = {
        id: 'usr_admin_1',
        email: 'admin@gmail.com',
        fullName: 'Mumbai Operations Admin',
        phone: '+91 98200 11000',
        role: 'admin',
        locality: 'Bandra Kurla Complex (BKC)',
        pinCode: '400051',
        createdAt: new Date().toISOString(),
      };
      db.users.push(admin);
      dbManager.persist();
    }
    const { passwordHash, ...safeAdmin } = admin as any;
    return res.json({
      token: admin.id,
      user: safeAdmin,
      message: 'Authenticated as Administrator',
    });
  }

  const db = dbManager.getDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user || user.passwordHash !== cleanPass) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash, ...safeUser } = user as any;
  return res.json({
    token: user.id,
    user: safeUser,
  });
});

// 2. Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, phone, role, locality, pinCode } = req.body;

  if (!email || !password || !fullName || !phone) {
    return res.status(400).json({ error: 'Missing required registration fields' });
  }

  // Security: No public registration as admin
  const requestedRole = role === 'admin' ? 'parent' : role || 'parent';
  const cleanEmail = email.trim().toLowerCase();

  const db = dbManager.getDatabase();
  if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User & { passwordHash: string } = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    fullName: fullName.trim(),
    phone: phone.trim(),
    role: requestedRole,
    locality: locality || 'Andheri West',
    pinCode: pinCode || '400053',
    passwordHash: password.trim(),
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // If registering as a teacher / tutor, create initial profile awaiting admin approval
  if (requestedRole === 'tutor') {
    const newTutor: TutorProfile = {
      id: `tut_${Date.now()}`,
      userId: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      gender: 'Other',
      biography: 'Newly registered educator awaiting profile completion and admin review.',
      qualification: 'B.Sc / B.Tech / Graduate',
      almaMater: 'Mumbai University',
      experienceYears: 1,
      teachingApproach: 'Conceptual mastery with regular practice worksheets.',
      teachingMode: 'home_tuition',
      hourlyFee: 600,
      monthlyFee: 6500,
      boards: ['CBSE', 'Maharashtra SSC'],
      grades: ['Class 9', 'Class 10'],
      subjects: ['Mathematics', 'Science'],
      serviceAreas: [{ locality: newUser.locality || 'Andheri West', pinCode: newUser.pinCode || '400053', travelRadiusKm: 5 }],
      availability: [
        { dayOfWeek: 'Monday', startTime: '16:00', endTime: '19:00' },
        { dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '19:00' },
      ],
      languages: ['English', 'Hindi'],
      approvalStatus: 'pending',
      verificationStatus: 'unverified',
      identityChecked: false,
      qualificationChecked: false,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      verificationRecords: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.tutors.push(newTutor);
  }

  dbManager.persist();
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ token: newUser.id, user: safeUser });
});

// 3. Auth: Current User Me
app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const { passwordHash, ...safeUser } = user as any;
  res.json(safeUser);
});

// 4. Tutors Search (Excludes Unapproved Tutors from public results)
app.get('/api/tutors', (req, res) => {
  const db = dbManager.getDatabase();
  const { board, grade, subject, locality, pinCode, maxBudget, minExperience, verifiedOnly, mode, sortBy } = req.query;

  // Strict Rule: Public searches only include approved tutors
  let results = db.tutors.filter((t) => t.approvalStatus === 'approved');

  if (board) {
    results = results.filter((t) => t.boards.includes(board as BoardType));
  }
  if (grade) {
    results = results.filter((t) => t.grades.includes(grade as GradeLevel));
  }
  if (subject) {
    results = results.filter((t) => t.subjects.includes(subject as SubjectName));
  }
  if (locality) {
    const locLower = String(locality).toLowerCase();
    results = results.filter((t) =>
      t.serviceAreas.some((a) => a.locality.toLowerCase().includes(locLower))
    );
  }
  if (pinCode) {
    results = results.filter((t) => t.serviceAreas.some((a) => a.pinCode === String(pinCode).trim()));
  }
  if (maxBudget) {
    const budgetNum = Number(maxBudget);
    results = results.filter((t) => t.monthlyFee <= budgetNum || t.hourlyFee <= budgetNum);
  }
  if (minExperience) {
    const expNum = Number(minExperience);
    results = results.filter((t) => t.experienceYears >= expNum);
  }
  if (verifiedOnly === 'true') {
    results = results.filter((t) => t.verificationStatus === 'fully_verified');
  }
  if (mode) {
    results = results.filter((t) => t.teachingMode === mode || t.teachingMode === 'both');
  }

  // Sorting
  if (sortBy === 'fee_asc') {
    results.sort((a, b) => a.hourlyFee - b.hourlyFee);
  } else if (sortBy === 'fee_desc') {
    results.sort((a, b) => b.hourlyFee - a.hourlyFee);
  } else if (sortBy === 'experience_desc') {
    results.sort((a, b) => b.experienceYears - a.experienceYears);
  } else if (sortBy === 'rating_desc') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    // Relevance: verified tutors first, then ratings
    results.sort((a, b) => {
      const aScore = (a.verificationStatus === 'fully_verified' ? 10 : 0) + a.rating * 2 + a.experienceYears * 0.2;
      const bScore = (b.verificationStatus === 'fully_verified' ? 10 : 0) + b.rating * 2 + b.experienceYears * 0.2;
      return bScore - aScore;
    });
  }

  res.json({
    totalCount: results.length,
    tutors: results,
    pilotHub: db.activePilotLocality,
  });
});

// 5. Single Tutor
app.get('/api/tutors/:id', (req, res) => {
  const db = dbManager.getDatabase();
  const tutor = db.tutors.find((t) => t.id === req.params.id);
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
  res.json(tutor);
});

// 6. Update Tutor Profile
app.patch('/api/tutors/:id/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const db = dbManager.getDatabase();
  const tutor = db.tutors.find((t) => t.id === req.params.id);
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

  // Only the owner or an admin can update
  if (tutor.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You can only edit your own tutor profile' });
  }

  Object.assign(tutor, req.body, { updatedAt: new Date().toISOString() });
  dbManager.persist();
  res.json(tutor);
});

// 7. Enquiries
app.get('/api/enquiries', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const db = dbManager.getDatabase();
  if (user.role === 'admin') {
    return res.json(db.enquiries);
  }
  if (user.role === 'tutor') {
    const tutor = db.tutors.find((t) => t.userId === user.id);
    if (!tutor) return res.json([]);
    return res.json(db.enquiries.filter((e) => e.tutorId === tutor.id));
  }
  // Student or Parent
  return res.json(db.enquiries.filter((e) => e.parentId === user.id));
});

app.post('/api/enquiries', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const db = dbManager.getDatabase();
  const tutor = db.tutors.find((t) => t.id === req.body.tutorId);
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}`,
    parentId: user.id,
    parentName: user.fullName,
    parentPhone: user.phone,
    parentEmail: user.email,
    tutorId: tutor.id,
    tutorName: tutor.fullName,
    tutorHourlyFee: tutor.hourlyFee,
    studentName: req.body.studentName || user.fullName,
    studentGrade: req.body.studentGrade || 'Class 10',
    board: req.body.board || 'CBSE',
    subject: req.body.subject || 'Mathematics',
    locality: req.body.locality || user.locality || 'Andheri West',
    pinCode: req.body.pinCode || user.pinCode || '400053',
    budgetMonthly: Number(req.body.budgetMonthly || tutor.monthlyFee),
    preferredSchedule: req.body.preferredSchedule || 'Flexible',
    teachingMode: req.body.teachingMode || 'home_tuition',
    message: req.body.message || 'Tuition enquiry submitted via HomeTutor.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  dbManager.persist();
  res.status(201).json(newEnquiry);
});

app.patch('/api/enquiries/:id/status', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const db = dbManager.getDatabase();
  const enq = db.enquiries.find((e) => e.id === req.params.id);
  if (!enq) return res.status(404).json({ error: 'Enquiry not found' });

  enq.status = req.body.status;
  if (req.body.responseNote !== undefined) {
    enq.responseNote = req.body.responseNote;
  }
  enq.updatedAt = new Date().toISOString();
  dbManager.persist();
  res.json(enq);
});

// 8. Admin Endpoints
app.get('/api/admin/metrics', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const db = dbManager.getDatabase();
  const totalParents = db.users.filter((u) => u.role === 'parent' || u.role === 'student').length;
  const totalTutors = db.tutors.length;
  const approvedTutors = db.tutors.filter((t) => t.approvalStatus === 'approved').length;
  const pendingTutorApprovals = db.tutors.filter((t) => t.approvalStatus === 'pending').length;
  const totalEnquiries = db.enquiries.length;
  const acceptedEnquiries = db.enquiries.filter((e) => e.status === 'accepted').length;
  const completedEnquiries = db.enquiries.filter((e) => e.status === 'completed').length;
  let pendingVerifications = 0;
  db.tutors.forEach((t) => {
    pendingVerifications += t.verificationRecords.filter((d) => d.status === 'pending').length;
  });
  const openComplaints = db.complaints.filter((c) => c.status === 'open').length;

  res.json({
    totalParents,
    totalTutors,
    approvedTutors,
    pendingTutorApprovals,
    totalEnquiries,
    acceptedEnquiries,
    completedEnquiries,
    pendingVerifications,
    openComplaints,
  });
});

app.get('/api/admin/tutors', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const db = dbManager.getDatabase();
  res.json(db.tutors);
});

app.patch('/api/admin/tutors/:id/approval', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const db = dbManager.getDatabase();
  const tutor = db.tutors.find((t) => t.id === req.params.id);
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

  tutor.approvalStatus = req.body.status;
  tutor.updatedAt = new Date().toISOString();
  dbManager.persist();
  res.json(tutor);
});

app.post('/api/admin/verify-doc', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { tutorId, docId, status, notes } = req.body;
  const db = dbManager.getDatabase();
  const tutor = db.tutors.find((t) => t.id === tutorId);
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

  const doc = tutor.verificationRecords.find((d) => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  doc.status = status;
  doc.notes = notes;
  doc.reviewedBy = user.email;
  doc.reviewedAt = new Date().toISOString();

  // Recalculate flags
  const hasId = tutor.verificationRecords.some(
    (d) => (d.documentType === 'Aadhaar Card' || d.documentType === 'Address Proof') && d.status === 'verified'
  );
  const hasQual = tutor.verificationRecords.some(
    (d) => (d.documentType === 'Degree Certificate' || d.documentType === 'B.Ed / Teaching Credential') && d.status === 'verified'
  );

  tutor.identityChecked = hasId;
  tutor.qualificationChecked = hasQual;
  tutor.verificationStatus = hasId && hasQual ? 'fully_verified' : hasId || hasQual ? 'partially_verified' : 'unverified';
  tutor.updatedAt = new Date().toISOString();

  dbManager.persist();
  res.json({ doc, tutor });
});

app.get('/api/admin/complaints', (req, res) => {
  const db = dbManager.getDatabase();
  res.json(db.complaints);
});

app.get('/api/admin/pilot-locality', (req, res) => {
  const db = dbManager.getDatabase();
  res.json({ locality: db.activePilotLocality });
});

app.post('/api/admin/pilot-locality', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const db = dbManager.getDatabase();
  db.activePilotLocality = req.body.locality || 'Andheri West';
  dbManager.persist();
  res.json({ locality: db.activePilotLocality });
});

app.post('/api/reset', (_req, res) => {
  dbManager.reset();
  res.json({ message: 'Database reset to verified initial state.' });
});

// ==========================================
// VITE MIDDLEWARE (SPA Serving)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve built dist files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    // In dev mode, mount Vite in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HomeTutor Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
