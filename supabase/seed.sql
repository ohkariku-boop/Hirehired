-- Seed sample companies and jobs for Hirehired
-- Run AFTER schema.sql

insert into public.companies (id, name, slug, website, careers_url, industry, size)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Acme Robotics', 'acme-robotics', 'https://acmerobotics.example', 'https://acmerobotics.example/careers', 'Robotics', '51-200'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Nova Health', 'nova-health', 'https://novahealth.example', 'https://novahealth.example/jobs', 'Healthcare', '201-500'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Pixel Labs', 'pixel-labs', 'https://pixellabs.example', 'https://pixellabs.example/careers', 'Software', '11-50')
on conflict (id) do nothing;

insert into public.jobs (
  id, company_id, title, description, location, is_remote, employment_type,
  salary_min, salary_max, salary_currency, apply_url, source, posted_at, is_active, skills
)
values
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Senior Robotics Software Engineer',
    'Build perception and control systems for next-gen autonomous robots.',
    'Remote',
    true,
    'Full-time',
    150000,
    190000,
    'USD',
    'https://acmerobotics.example/careers/senior-robotics-swe',
    'manual',
    now() - interval '2 hours',
    true,
    array['C++', 'ROS', 'Python', 'Computer Vision']
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Product Designer',
    'Design patient-facing experiences for a modern health platform.',
    'New York, NY',
    false,
    'Full-time',
    120000,
    155000,
    'USD',
    'https://novahealth.example/jobs/product-designer',
    'manual',
    now() - interval '5 hours',
    true,
    array['Figma', 'UI/UX', 'Design Systems']
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Full-Stack Engineer',
    'Ship features end-to-end for our developer tools product.',
    'Remote (US)',
    true,
    'Full-time',
    130000,
    170000,
    'USD',
    'https://pixellabs.example/careers/fullstack',
    'manual',
    now() - interval '1 day',
    true,
    array['TypeScript', 'React', 'Node.js', 'Postgres']
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ML Engineer – Perception',
    'Train and deploy models for object detection and tracking.',
    'Austin, TX / Remote',
    true,
    'Full-time',
    145000,
    185000,
    'USD',
    'https://acmerobotics.example/careers/ml-perception',
    'manual',
    now() - interval '3 hours',
    true,
    array['PyTorch', 'Python', 'MLOps']
  )
on conflict (id) do nothing;
