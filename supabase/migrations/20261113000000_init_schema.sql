-- ============================================================================
-- 1. EXTENSIONS & ENUMS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- ============================================================================
-- 2. UTILITY FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. PROFILES TABLE (Mirrored from auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Automatically insert a row in profiles when an auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'TODO'::task_status NOT NULL,
    priority task_priority DEFAULT 'MEDIUM'::task_priority NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

CREATE OR REPLACE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time updates for the tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
    CREATE POLICY "Public profiles are viewable by authenticated users" 
        ON public.profiles FOR SELECT 
        TO authenticated 
        USING (true);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile" 
        ON public.profiles FOR UPDATE 
        TO authenticated 
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
EXCEPTION WHEN others THEN NULL;
END $$;

-- Tasks Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
    CREATE POLICY "Users can view their own tasks" 
        ON public.tasks FOR SELECT 
        TO authenticated 
        USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
    CREATE POLICY "Users can insert their own tasks" 
        ON public.tasks FOR INSERT 
        TO authenticated 
        WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
    CREATE POLICY "Users can update their own tasks" 
        ON public.tasks FOR UPDATE 
        TO authenticated 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
    CREATE POLICY "Users can delete their own tasks" 
        ON public.tasks FOR DELETE 
        TO authenticated 
        USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL;
END $$;
