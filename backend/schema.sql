-- =====================================================================
-- HomeTutor — PostgreSQL Production Schema & Migrations
-- Pilot Launch: Andheri West (400053), Mumbai, India
-- Designed for Supabase / PostgreSQL 15+
-- =====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('parent', 'tutor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'partially_verified', 'fully_verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM ('pending', 'accepted', 'declined', 'contacted', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teaching_mode AS ENUM ('home_tuition', 'online', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role user_role NOT NULL DEFAULT 'parent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PARENT PROFILES
CREATE TABLE IF NOT EXISTS parent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_locality VARCHAR(120) DEFAULT 'Andheri West',
    pin_code VARCHAR(10) DEFAULT '400053',
    preferred_contact_method VARCHAR(30) DEFAULT 'whatsapp',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TUTOR PROFILES
CREATE TABLE IF NOT EXISTS tutor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    biography TEXT NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    alma_mater VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL CHECK (experience_years >= 0),
    teaching_approach TEXT NOT NULL,
    teaching_mode teaching_mode NOT NULL DEFAULT 'both',
    hourly_fee NUMERIC(10, 2) NOT NULL CHECK (hourly_fee > 0),
    monthly_fee NUMERIC(10, 2) NOT NULL CHECK (monthly_fee > 0),
    profile_image_url TEXT,
    approval_status approval_status NOT NULL DEFAULT 'pending',
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    identity_checked BOOLEAN NOT NULL DEFAULT FALSE,
    qualification_checked BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0.0,
    review_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BOARDS, GRADES & SUBJECTS
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) UNIQUE NOT NULL
);

-- 6. JUNCTION TABLES
CREATE TABLE IF NOT EXISTS tutor_boards (
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, board_id)
);

CREATE TABLE IF NOT EXISTS tutor_grades (
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, grade_id)
);

CREATE TABLE IF NOT EXISTS tutor_subjects (
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, subject_id)
);

-- 7. SERVICE AREAS (MUMBAI LOCALITIES & PIN CODES)
CREATE TABLE IF NOT EXISTS tutor_service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    locality VARCHAR(120) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    travel_radius_km INT DEFAULT 5
);

-- 8. AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS tutor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- 9. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(120) NOT NULL,
    student_grade VARCHAR(40) NOT NULL,
    board_name VARCHAR(80) NOT NULL,
    subject_name VARCHAR(80) NOT NULL,
    locality VARCHAR(120) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    budget_monthly NUMERIC(10, 2) NOT NULL,
    preferred_schedule VARCHAR(255) NOT NULL,
    teaching_mode VARCHAR(40) NOT NULL DEFAULT 'home_tuition',
    message TEXT NOT NULL,
    response_note TEXT,
    status enquiry_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. VERIFICATION RECORDS (PRIVATE DOCUMENTS)
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(80) NOT NULL,
    private_file_path TEXT NOT NULL,
    file_size VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    subject VARCHAR(80),
    grade VARCHAR(40),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. COMPLAINTS & SAFETY AUDITS
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reporter_role user_role NOT NULL,
    tutor_id UUID REFERENCES tutor_profiles(id) ON DELETE SET NULL,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tutor_approval ON tutor_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_tutor_verification ON tutor_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_service_areas_pin ON tutor_service_areas(pin_code, locality);
CREATE INDEX IF NOT EXISTS idx_enquiries_parent ON enquiries(parent_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_tutor ON enquiries(tutor_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

-- Parents can only view their own enquiries
CREATE POLICY parent_enquiry_policy ON enquiries
    FOR ALL
    USING (parent_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Tutors can only view enquiries addressed to their tutor profile
CREATE POLICY tutor_enquiry_policy ON enquiries
    FOR SELECT
    USING (tutor_id IN (
        SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
    ));

-- Verification documents: Only the tutor owner or platform admin can view/download
CREATE POLICY private_verification_policy ON verification_records
    FOR ALL
    USING (
        tutor_id IN (SELECT id FROM tutor_profiles WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
