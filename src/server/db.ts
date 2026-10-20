import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  User,
  TutorProfile,
  Enquiry,
  Complaint,
  AdminMetrics,
  SearchFilterState,
} from '../types';
import {
  INITIAL_TUTORS,
  INITIAL_USERS,
  INITIAL_ENQUIRIES,
  INITIAL_COMPLAINTS,
} from '../data/seedData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'hometutor_db.json');

export interface DatabaseSchema {
  users: (User & { passwordHash?: string })[];
  tutors: TutorProfile[];
  enquiries: Enquiry[];
  complaints: Complaint[];
  activePilotLocality: string;
}

// Built-in default verified accounts for instant test access
const DEFAULT_SYSTEM_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_admin_1',
    fullName: 'Mumbai Operations Admin',
    email: 'admin@gmail.com',
    phone: '+91 98200 11000',
    role: 'admin',
    locality: 'Bandra Kurla Complex (BKC)',
    pinCode: '400051',
    passwordHash: 'admin@123',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'usr_student_1',
    fullName: 'Aarav Sharma',
    email: 'student@gmail.com',
    phone: '+91 98201 44521',
    role: 'student',
    locality: 'Andheri West',
    pinCode: '400053',
    passwordHash: 'student@123',
    createdAt: '2026-09-01T09:30:00Z',
  },
  {
    id: 'usr_parent_1',
    fullName: 'Priya Sharma',
    email: 'parent@gmail.com',
    phone: '+91 98201 44521',
    role: 'parent',
    locality: 'Andheri West',
    pinCode: '400053',
    preferredContactMethod: 'whatsapp',
    passwordHash: 'parent@123',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr_tutor_1',
    fullName: 'Prof. Rajesh Kulkarni',
    email: 'teacher@gmail.com',
    phone: '+91 98212 99801',
    role: 'tutor',
    locality: 'Andheri West',
    pinCode: '400053',
    passwordHash: 'teacher@123',
    createdAt: '2026-08-10T11:00:00Z',
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure default accounts exist
        DEFAULT_SYSTEM_USERS.forEach((sysUser) => {
          if (!parsed.users.some((u: any) => u.email.toLowerCase() === sysUser.email.toLowerCase())) {
            parsed.users.push(sysUser);
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('Error reading database file, initializing clean database', e);
    }

    // Initialize with comprehensive initial data
    const initialDb: DatabaseSchema = {
      users: [...DEFAULT_SYSTEM_USERS],
      tutors: [...INITIAL_TUTORS],
      enquiries: [...INITIAL_ENQUIRIES],
      complaints: [...INITIAL_COMPLAINTS],
      activePilotLocality: 'Andheri West',
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave: DatabaseSchema) {
    try {
      this.ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to atomically persist database file', err);
    }
  }

  public getDatabase(): DatabaseSchema {
    return this.data;
  }

  public persist() {
    this.saveDatabase(this.data);
  }

  public reset() {
    this.data = {
      users: [...DEFAULT_SYSTEM_USERS],
      tutors: [...INITIAL_TUTORS],
      enquiries: [...INITIAL_ENQUIRIES],
      complaints: [...INITIAL_COMPLAINTS],
      activePilotLocality: 'Andheri West',
    };
    this.persist();
  }
}

export const dbManager = new DatabaseManager();
