-- Thêm các trường cho Hero, Stats, Social Links vào bảng settings
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS hero_title text,
ADD COLUMN IF NOT EXISTS hero_subtitle text,
ADD COLUMN IF NOT EXISTS stat_ctf text,
ADD COLUMN IF NOT EXISTS stat_languages text,
ADD COLUMN IF NOT EXISTS stat_platforms text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS instagram_url text;

-- Cập nhật dữ liệu mặc định cho settings (ID đầu tiên)
UPDATE public.settings
SET 
    hero_title = 'Securing the Cyber World',
    hero_subtitle = 'Hi, I''m **Lê Quang Minh** — a fourth-year Cyber Security student passionate about Penetration Testing, SOC operations, and CTF competitions.',
    stat_ctf = '4',
    stat_languages = '5',
    stat_platforms = '4',
    github_url = 'https://github.com/zudangbuon',
    linkedin_url = 'https://www.linkedin.com/in/minh-quang-8a9a7335b/',
    facebook_url = 'https://www.facebook.com/zusieudeptraiUwU',
    instagram_url = 'https://www.instagram.com/zudangbuon/'
WHERE about_text IS NOT NULL; -- update row đang tồn tại

-- Bảng Education (Học tập & Ngôn ngữ)
CREATE TABLE IF NOT EXISTS public.education (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    start_date text,
    end_date text,
    role text,
    institution text,
    description text,
    tags jsonb, -- Mảng string json
    order_idx integer DEFAULT 0
);

-- Bảng Activities & Awards (Hoạt động & Giải thưởng)
CREATE TABLE IF NOT EXISTS public.activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    start_date text,
    end_date text,
    role text,
    organization text,
    description text,
    tags jsonb,
    order_idx integer DEFAULT 0
);

-- Bảng Platforms (Các trang tự học)
CREATE TABLE IF NOT EXISTS public.platforms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    name text,
    logo_url text,
    link_url text,
    order_idx integer DEFAULT 0
);

-- Bật Row Level Security và cho phép truy cập public (nếu chưa có)
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép đọc education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Cho phép sửa education" ON public.education FOR ALL USING (true);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép đọc activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Cho phép sửa activities" ON public.activities FOR ALL USING (true);

ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép đọc platforms" ON public.platforms FOR SELECT USING (true);
CREATE POLICY "Cho phép sửa platforms" ON public.platforms FOR ALL USING (true);

-- Thêm dữ liệu mẫu cho Education
INSERT INTO public.education (start_date, end_date, role, institution, description, tags, order_idx) VALUES
('2023', '2027 (Expected)', 'B.Sc. Cyber Security', 'University of Science and Technology of Hanoi (USTH)', 'Year 1 GPA: 3.0 · Year 2 GPA: 3.2. Focus on penetration testing, network security, and system administration.', '["Cyber Security", "Pentest", "SOC"]'::jsonb, 1),
('2020', '2023', 'High School Diploma', 'Nhân Chính High School', 'Graduated with Very Good standing.', '[]'::jsonb, 2),
('', 'Foreign Languages', 'English B2 · French TCF B1', 'Bilingual Communication', 'Proficient in English (B2 level) and French (TCF B1 level).', '[]'::jsonb, 3);

-- Thêm dữ liệu mẫu cho Activities
INSERT INTO public.activities (start_date, end_date, role, organization, description, tags, order_idx) VALUES
('2024', '2027', 'Class Monitor', 'USTH — Year 0 through Year 3', 'Continuous class representative for 4 consecutive academic years, demonstrating leadership.', '[]'::jsonb, 1),
('2024', '2025', 'President — Music Club USTH M&M', 'USTH M&M Not Chocobeans', 'Led the music club as president. Show Director for Night Music show: "The Scarlet" (2025).', '["Leadership", "Event Management"]'::jsonb, 2),
('2026', '2027', 'Vice President — Global Language Club', 'USTH Globle Language Club', 'Vice president role in promoting multilingual communication among USTH students.', '[]'::jsonb, 3),
('2024', '2025', 'Awards & Recognitions', 'VAST & USTH', 'Certificate of Merit – Youth Union, VAST (2024). Awarded for remarkable contributions to student activities (2025).', '["🏆 Merit", "⭐ Outstanding"]'::jsonb, 4);

-- Thêm dữ liệu mẫu cho Platforms
INSERT INTO public.platforms (name, logo_url, link_url, order_idx) VALUES
('CyLab Academy', 'https://cylabacademy.org/img/logos/cylab_shield.svg', 'https://cylabacademy.org/', 1),
('TryHackMe', 'https://www.google.com/s2/favicons?domain=tryhackme.com&sz=128', 'https://tryhackme.com', 2),
('Hack The Box', 'https://www.hackthebox.com/images/logo-htb.svg', 'https://www.hackthebox.com', 3),
('PortSwigger Academy', 'https://www.google.com/s2/favicons?domain=portswigger.net&sz=128', 'https://portswigger.net/web-security', 4);
