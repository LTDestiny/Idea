-- ============================================
-- STEAM_TUI Seed Data (Mock / Dữ liệu ảo)
-- ============================================
-- LƯU Ý: Chạy file này SAU KHI đã chạy migration 001_initial_schema.sql
-- Các user_id là placeholder — thay bằng UUID thật từ auth.users của bạn
-- hoặc tạo user qua Supabase Dashboard trước rồi dùng UUID đó.

-- ============================================
-- BƯỚC 1: Tạo fake users trong auth.users
-- (Chỉ dùng cho dev/test — KHÔNG dùng production)
-- ============================================

-- User 1: Nguyễn Văn An
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'nguyenvanan@example.com',
  '{"full_name": "Nguyễn Văn An", "avatar_url": ""}',
  now(), now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '$2a$10$PznXqIEbCLR.XkP2gFJuPeVfBxZJHwM3pWy0O/4G6i1GfJJhRJZnG',
  now(), now()
) ON CONFLICT (id) DO NOTHING;

-- User 2: Trần Thị Bình
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'tranthibinh@example.com',
  '{"full_name": "Trần Thị Bình", "avatar_url": ""}',
  now(), now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '$2a$10$PznXqIEbCLR.XkP2gFJuPeVfBxZJHwM3pWy0O/4G6i1GfJJhRJZnG',
  now(), now()
) ON CONFLICT (id) DO NOTHING;

-- User 3: Lê Hoàng Cường
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'lehoangcuong@example.com',
  '{"full_name": "Lê Hoàng Cường", "avatar_url": ""}',
  now(), now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '$2a$10$PznXqIEbCLR.XkP2gFJuPeVfBxZJHwM3pWy0O/4G6i1GfJJhRJZnG',
  now(), now()
) ON CONFLICT (id) DO NOTHING;

-- User 4: Phạm Minh Dương
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'phamminhduong@example.com',
  '{"full_name": "Phạm Minh Dương", "avatar_url": ""}',
  now(), now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '$2a$10$PznXqIEbCLR.XkP2gFJuPeVfBxZJHwM3pWy0O/4G6i1GfJJhRJZnG',
  now(), now()
) ON CONFLICT (id) DO NOTHING;

-- User 5: Hoàng Thị Evy
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'hoangthievy@example.com',
  '{"full_name": "Hoàng Thị Evy", "avatar_url": ""}',
  now(), now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '$2a$10$PznXqIEbCLR.XkP2gFJuPeVfBxZJHwM3pWy0O/4G6i1GfJJhRJZnG',
  now(), now()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- BƯỚC 2: Tạo profiles (trigger sẽ không chạy với INSERT trực tiếp auth.users)
-- ============================================
INSERT INTO profiles (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'nguyenvanan@example.com', 'Nguyễn Văn An'),
  ('22222222-2222-2222-2222-222222222222', 'tranthibinh@example.com', 'Trần Thị Bình'),
  ('33333333-3333-3333-3333-333333333333', 'lehoangcuong@example.com', 'Lê Hoàng Cường'),
  ('44444444-4444-4444-4444-444444444444', 'phamminhduong@example.com', 'Phạm Minh Dương'),
  ('55555555-5555-5555-5555-555555555555', 'hoangthievy@example.com', 'Hoàng Thị Evy')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- BƯỚC 3: Tạo ideas (8 ý tưởng, đủ 8 category)
-- ============================================
INSERT INTO ideas (id, title, description, category, looking_for, creator_id, created_at) VALUES

-- 1. Technology — An
(
  'aaaa1111-0000-0000-0000-000000000001',
  'Ứng dụng AI phát hiện sớm bệnh cây trồng',
  'Xây dựng app mobile sử dụng Computer Vision + TensorFlow Lite để nông dân chỉ cần chụp ảnh lá cây, app sẽ phân tích và đề xuất cách xử lý. Giai đoạn 1 tập trung vào lúa và rau xanh phổ biến ở Việt Nam. Dữ liệu huấn luyện thu thập từ Viện Nghiên cứu Nông nghiệp.',
  'technology',
  'Someone experienced with Python, TensorFlow, React Native, and Computer Vision',
  '11111111-1111-1111-1111-111111111111',
  now() - interval '10 days'
),

-- 2. Education — Bình
(
  'aaaa1111-0000-0000-0000-000000000002',
  'Nền tảng học lập trình qua game cho trẻ em',
  'Thiết kế website gamification dạy lập trình Scratch/Python cho học sinh tiểu học. Mỗi bài học là một màn chơi, học sinh giải puzzle bằng code blocks. Có bảng xếp hạng, huy chương, và hệ thống mentor online. Mục tiêu: 1000 học sinh trong 6 tháng đầu.',
  'education',
  'Looking for React developers, Node.js backend engineers, game designers, and UI/UX experts familiar with Scratch',
  '22222222-2222-2222-2222-222222222222',
  now() - interval '8 days'
),

-- 3. Health — Cường
(
  'aaaa1111-0000-0000-0000-000000000003',
  'Chatbot tư vấn sức khỏe tâm thần cho sinh viên',
  'Phát triển chatbot AI (GPT-based) tích hợp vào website trường đại học, hỗ trợ sinh viên khi gặp stress, lo âu, trầm cảm. Bot sẽ lắng nghe, đưa ra lời khuyên ban đầu và kết nối đến chuyên gia tâm lý khi cần. Bảo mật tuyệt đối thông tin người dùng.',
  'health',
  'People with Python, NLP, and OpenAI API experience; also need Next.js and PostgreSQL skills',
  '33333333-3333-3333-3333-333333333333',
  now() - interval '7 days'
),

-- 4. Environment — Dương
(
  'aaaa1111-0000-0000-0000-000000000004',
  'Bản đồ rác thải nhựa đại dương Việt Nam',
  'Tạo nền tảng crowdsourcing để người dân báo cáo điểm ô nhiễm rác thải nhựa ven biển. Dữ liệu hiển thị trên bản đồ tương tác (Mapbox). Tổ chức các chiến dịch dọn rác dựa trên dữ liệu thực tế. Hợp tác với WWF và các tổ chức bảo vệ môi trường.',
  'environment',
  'GIS specialists, Mapbox experts, React developers, and someone with mobile development experience',
  '44444444-4444-4444-4444-444444444444',
  now() - interval '6 days'
),

-- 5. Social — Evy
(
  'aaaa1111-0000-0000-0000-000000000005',
  'Mạng xã hội chia sẻ sách miễn phí',
  'Xây dựng platform để mọi người đăng sách cũ không dùng nữa, người cần sách có thể xin miễn phí hoặc trao đổi. Có hệ thống rating, review sách, và cộng đồng đọc sách theo chủ đề. Giao hàng qua đối tác vận chuyển giá rẻ.',
  'social',
  'Fullstack developers (Next.js, Supabase, TypeScript, Tailwind CSS) and someone familiar with Stripe payments',
  '55555555-5555-5555-5555-555555555555',
  now() - interval '5 days'
),

-- 6. Business — An
(
  'aaaa1111-0000-0000-0000-000000000006',
  'Marketplace cho nông sản sạch trực tiếp từ nông dân',
  'Kết nối trực tiếp nông dân với người tiêu dùng thành phố. Nông dân đăng sản phẩm, khách đặt hàng, giao trong 24h. Có chứng nhận nguồn gốc qua QR code, hệ thống đánh giá chất lượng, và subscription box hàng tuần.',
  'business',
  'Flutter/mobile developers, Firebase backend, Node.js, payment gateway integration, and QR code expertise',
  '11111111-1111-1111-1111-111111111111',
  now() - interval '4 days'
),

-- 7. Art — Bình
(
  'aaaa1111-0000-0000-0000-000000000007',
  'Bảo tàng kỹ thuật số di sản văn hóa Việt Nam',
  'Số hóa 3D các hiện vật lịch sử và di sản văn hóa phi vật thể của Việt Nam. Tạo trải nghiệm VR/AR để mọi người tham quan bảo tàng ảo từ bất cứ đâu. Kèm audio guide bằng nhiều ngôn ngữ và mini-game giáo dục.',
  'art',
  '3D artists (Three.js, Blender, 3D Scanning), WebXR developers, and React frontend engineers',
  '22222222-2222-2222-2222-222222222222',
  now() - interval '3 days'
),

-- 8. Other — Cường
(
  'aaaa1111-0000-0000-0000-000000000008',
  'Hệ thống quản lý câu lạc bộ sinh viên thông minh',
  'Platform all-in-one cho CLB sinh viên: quản lý thành viên, lịch hoạt động, thu chi quỹ, đăng ký sự kiện, điểm rèn luyện. Tích hợp Google Calendar, hệ thống QR check-in, và dashboard thống kê cho Ban chủ nhiệm.',
  'other',
  'Next.js and Prisma developers, PostgreSQL DBA, Tailwind CSS, and Google API integration experience',
  '33333333-3333-3333-3333-333333333333',
  now() - interval '2 days'
);

-- ============================================
-- BƯỚC 4: Tạo comments (20 bình luận)
-- ============================================
INSERT INTO comments (id, idea_id, user_id, content, parent_id, created_at) VALUES

-- Ý tưởng 1: AI cây trồng (4 top-level + 2 replies)
('cccc0001-0000-0000-0000-000000000001',
 'aaaa1111-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
 'Ý tưởng rất hay! Mình có kinh nghiệm với TensorFlow, muốn tham gia.',
 NULL, now() - interval '9 days'),

('cccc0001-0000-0000-0000-000000000002',
 'aaaa1111-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
 'Bạn có dataset nào chưa? Mình biết vài nguồn data về bệnh cây trồng từ Kaggle.',
 NULL, now() - interval '9 days' + interval '3 hours'),

-- Reply to comment 2
('cccc0001-0000-0000-0000-000000000003',
 'aaaa1111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 'Cảm ơn! Mình đang thu thập data từ nông dân ở Đồng Tháp, sẽ share link dataset sau.',
 'cccc0001-0000-0000-0000-000000000002', now() - interval '8 days'),

('cccc0001-0000-0000-0000-000000000004',
 'aaaa1111-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444',
 'Mình có thể giúp phần React Native. Đã từng làm app tương tự cho startup nông nghiệp.',
 NULL, now() - interval '7 days'),

-- Reply to comment 1
('cccc0001-0000-0000-0000-000000000005',
 'aaaa1111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 'Welcome aboard! Mình sẽ tạo repo và invite bạn nhé.',
 'cccc0001-0000-0000-0000-000000000001', now() - interval '8 days' + interval '5 hours'),

-- Ý tưởng 2: Game lập trình (3 top-level + 1 reply)
('cccc0001-0000-0000-0000-000000000006',
 'aaaa1111-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555',
 'Tuyệt vời! Con mình 8 tuổi đang học Scratch, rất cần platform như này.',
 NULL, now() - interval '7 days'),

('cccc0001-0000-0000-0000-000000000007',
 'aaaa1111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
 'Có thể tích hợp thêm phần thi đấu realtime giữa các học sinh không?',
 NULL, now() - interval '6 days'),

-- Reply to comment 7
('cccc0001-0000-0000-0000-000000000008',
 'aaaa1111-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
 'Ý hay đó! Mình sẽ thêm tính năng multiplayer bằng WebSocket trong phase 2.',
 'cccc0001-0000-0000-0000-000000000007', now() - interval '5 days' + interval '6 hours'),

('cccc0001-0000-0000-0000-000000000009',
 'aaaa1111-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
 'Mình muốn đóng góp nội dung bài học. Mình là giáo viên tin học ở trường tiểu học.',
 NULL, now() - interval '5 days'),

-- Ý tưởng 3: Chatbot sức khỏe (3 top-level + 1 reply)
('cccc0001-0000-0000-0000-000000000010',
 'aaaa1111-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444',
 'Rất cần thiết! Trường mình có rất nhiều sinh viên bị áp lực học tập.',
 NULL, now() - interval '6 days'),

('cccc0001-0000-0000-0000-000000000011',
 'aaaa1111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
 'Cần chú ý vấn đề đạo đức AI khi tư vấn sức khỏe tâm thần. Nên có disclaimer rõ ràng.',
 NULL, now() - interval '5 days'),

-- Reply to comment 11
('cccc0001-0000-0000-0000-000000000012',
 'aaaa1111-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
 'Đồng ý! Mình sẽ thêm disclaimer và nút kết nối đến hotline tâm lý ngay từ v1.',
 'cccc0001-0000-0000-0000-000000000011', now() - interval '4 days' + interval '8 hours'),

('cccc0001-0000-0000-0000-000000000013',
 'aaaa1111-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555',
 'Mình có background NLP, có thể giúp xây dựng conversation flow.',
 NULL, now() - interval '4 days'),

-- Ý tưởng 4: Bản đồ rác (2 top-level)
('cccc0001-0000-0000-0000-000000000014',
 'aaaa1111-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222',
 'Mình từng làm project GIS. Mapbox API rất phù hợp cho dự án này!',
 NULL, now() - interval '5 days'),

('cccc0001-0000-0000-0000-000000000015',
 'aaaa1111-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555555',
 'Nên thêm tính năng gamification — thưởng điểm cho người dọn rác.',
 NULL, now() - interval '4 days'),

-- Ý tưởng 5: Chia sẻ sách (3 top-level)
('cccc0001-0000-0000-0000-000000000016',
 'aaaa1111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
 'Ý tưởng quá tốt! Mình có hơn 200 cuốn sách muốn chia sẻ.',
 NULL, now() - interval '4 days'),

('cccc0001-0000-0000-0000-000000000017',
 'aaaa1111-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333',
 'Có thể tích hợp ISBN scan để tự động điền thông tin sách không?',
 NULL, now() - interval '3 days'),

('cccc0001-0000-0000-0000-000000000018',
 'aaaa1111-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444',
 'Nên có tính năng đề xuất sách dựa trên sở thích đọc của người dùng.',
 NULL, now() - interval '2 days'),

-- Ý tưởng 6: Marketplace nông sản (2 top-level)
('cccc0001-0000-0000-0000-000000000019',
 'aaaa1111-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333',
 'Mình ở quê có nhiều hộ nông dân muốn bán trực tiếp. Rất ủng hộ!',
 NULL, now() - interval '3 days'),

('cccc0001-0000-0000-0000-000000000020',
 'aaaa1111-0000-0000-0000-000000000006', '55555555-5555-5555-5555-555555555555',
 'Cần giải quyết bài toán logistics giao hàng nhanh trong ngày cho rau củ tươi.',
 NULL, now() - interval '2 days'),

-- Ý tưởng 7: Bảo tàng kỹ thuật số (2 top-level)
('cccc0001-0000-0000-0000-000000000021',
 'aaaa1111-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444',
 'Mình biết dùng Blender + photogrammetry để scan 3D hiện vật. Sẵn sàng tham gia!',
 NULL, now() - interval '2 days'),

('cccc0001-0000-0000-0000-000000000022',
 'aaaa1111-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111',
 'Three.js + WebXR có thể chạy tốt trên mobile browser không? Cần test kỹ.',
 NULL, now() - interval '1 day'),

-- Ý tưởng 8: Quản lý CLB (1 top-level)
('cccc0001-0000-0000-0000-000000000023',
 'aaaa1111-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222',
 'CLB mình cần hệ thống này lắm! Hiện quản lý bằng Excel rất bất tiện.',
 NULL, now() - interval '1 day');

-- ============================================
-- BƯỚC 5: Tạo join_requests (12 yêu cầu tham gia)
-- ============================================
INSERT INTO join_requests (idea_id, requester_id, status, message, relevant_skills, created_at) VALUES

-- Ý tưởng 1: AI cây trồng — 3 requests
('aaaa1111-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'approved',
 'Mình có 2 năm kinh nghiệm ML và đang làm thesis về Computer Vision. Rất muốn đóng góp!',
 ARRAY['TensorFlow', 'Python', 'Computer Vision'],
 now() - interval '9 days'),

('aaaa1111-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'approved',
 'Mình chuyên React Native, đã publish 3 app lên App Store. Sẵn sàng code phần mobile.',
 ARRAY['React Native', 'JavaScript', 'Mobile Development'],
 now() - interval '7 days'),

('aaaa1111-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'pending',
 'Mình muốn học thêm về AI trong nông nghiệp. Có thể giúp phần UI/UX và testing.',
 ARRAY['UI/UX', 'Figma', 'Testing'],
 now() - interval '3 days'),

-- Ý tưởng 2: Game lập trình — 2 requests
('aaaa1111-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'approved',
 'Mình là giáo viên tin học, có thể thiết kế curriculum và nội dung bài học.',
 ARRAY['Scratch', 'Python', 'Curriculum Design'],
 now() - interval '5 days'),

('aaaa1111-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'pending',
 'Mình thích game development, muốn giúp thiết kế các level và puzzle.',
 ARRAY['Game Design', 'JavaScript', 'Unity'],
 now() - interval '3 days'),

-- Ý tưởng 3: Chatbot sức khỏe — 2 requests
('aaaa1111-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'approved',
 'Mình có kinh nghiệm NLP và đã xây dựng chatbot trước đây. Rất quan tâm đến mental health.',
 ARRAY['NLP', 'Python', 'OpenAI API'],
 now() - interval '4 days'),

('aaaa1111-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'rejected',
 'Mình muốn tham gia nhưng chỉ có kinh nghiệm frontend.',
 ARRAY['React', 'CSS'],
 now() - interval '3 days'),

-- Ý tưởng 4: Bản đồ rác — 2 requests
('aaaa1111-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'approved',
 'Mình có kinh nghiệm GIS và Mapbox. Đã từng làm dự án bản đồ dịch tễ.',
 ARRAY['Mapbox', 'GIS', 'React'],
 now() - interval '5 days'),

('aaaa1111-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'pending',
 'Mình quan tâm môi trường và có thể giúp phần backend + database.',
 ARRAY['Supabase', 'PostgreSQL', 'Node.js'],
 now() - interval '2 days'),

-- Ý tưởng 5: Chia sẻ sách — 1 request
('aaaa1111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'approved',
 'Mình yêu sách và có kinh nghiệm fullstack. Muốn giúp xây dựng tính năng matching sách.',
 ARRAY['Next.js', 'TypeScript', 'Supabase'],
 now() - interval '4 days'),

-- Ý tưởng 7: Bảo tàng số — 1 request
('aaaa1111-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444', 'approved',
 'Mình chuyên 3D modeling và VR. Đã từng số hóa hiện vật cho bảo tàng Lịch sử TP.HCM.',
 ARRAY['Blender', '3D Scanning', 'WebXR', 'Three.js'],
 now() - interval '2 days'),

-- Ý tưởng 8: Quản lý CLB — 1 request
('aaaa1111-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'pending',
 'CLB mình đang cần hệ thống này. Mình có thể dev + test cùng.',
 ARRAY['Next.js', 'Prisma', 'Tailwind CSS'],
 now() - interval '1 day');

-- ============================================
-- XONG! Tổng kết dữ liệu ảo:
-- • 5 users
-- • 8 ý tưởng (đủ 8 categories)
-- • 23 bình luận (19 top-level + 4 replies)
-- • 12 yêu cầu tham gia (5 approved, 4 pending, 1 rejected)
-- ============================================
