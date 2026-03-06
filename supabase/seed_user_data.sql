    -- ============================================
    -- Seed data cho user: f68e8459-9b17-4428-8ee0-85e0f80bdcc2
    -- Chạy SAU seed.sql (cần 5 fake users đã tồn tại)
    -- ============================================

    -- Đảm bảo profile tồn tại cho real user
    INSERT INTO profiles (id, email, full_name)
    VALUES (
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    (SELECT email FROM auth.users WHERE id = 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2'),
    (SELECT COALESCE(raw_user_meta_data->>'full_name', 'User') FROM auth.users WHERE id = 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2')
    )
    ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

    -- ============================================
    -- BƯỚC 1: Tạo 7 IDEAS cho user thật
    -- ============================================
    INSERT INTO ideas (id, title, description, category, looking_for, creator_id, created_at) VALUES

    -- 1. Technology
    (
    'bbbb2222-0000-0000-0000-000000000001',
    'Hệ thống điểm danh bằng nhận diện khuôn mặt',
    'Xây dựng hệ thống điểm danh tự động cho lớp học sử dụng camera + AI nhận diện khuôn mặt. Sinh viên chỉ cần bước vào lớp, hệ thống tự ghi nhận. Dashboard cho giảng viên theo dõi realtime, export báo cáo, thống kê tần suất vắng mặt. Tích hợp với hệ thống quản lý đào tạo của trường.',
    'technology',
    'Someone skilled in Python, OpenCV, face recognition, React, and FastAPI',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '15 days'
    ),

    -- 2. Education
    (
    'bbbb2222-0000-0000-0000-000000000002',
    'App luyện thi TOEIC cá nhân hóa bằng AI',
    'Ứng dụng luyện thi TOEIC sử dụng AI để phân tích điểm yếu của từng người dùng và tạo bộ đề riêng. Có tính năng spaced repetition cho từ vựng, luyện nghe với tốc độ điều chỉnh, và giả lập bài thi thật. Mục tiêu: giúp sinh viên tăng 100+ điểm trong 3 tháng.',
    'education',
    'React Native and Python developers, NLP specialists, and someone with AI/ML experience',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '12 days'
    ),

    -- 3. Health
    (
    'bbbb2222-0000-0000-0000-000000000003',
    'Ứng dụng theo dõi dinh dưỡng cho sinh viên',
    'App giúp sinh viên theo dõi chế độ ăn uống hàng ngày, tính toán calo và dinh dưỡng. Có tính năng chụp ảnh món ăn để AI nhận diện và tính calo tự động. Gợi ý thực đơn giá rẻ, dễ nấu, phù hợp túi tiền sinh viên. Cảnh báo khi thiếu chất dinh dưỡng.',
    'health',
    'Flutter developers, TensorFlow Lite experts, Node.js backend, and someone knowledgeable about nutrition APIs',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '9 days'
    ),

    -- 4. Social
    (
    'bbbb2222-0000-0000-0000-000000000004',
    'Nền tảng kết nối tình nguyện viên với dự án cộng đồng',
    'Website matching tình nguyện viên với các dự án xã hội phù hợp kỹ năng và thời gian rảnh. Có hệ thống portfolio tình nguyện, chứng nhận số, và bảng thành tích. Hỗ trợ tổ chức NGO quản lý tình nguyện viên hiệu quả hơn.',
    'social',
    'Fullstack developers (Next.js, Supabase, TypeScript, Tailwind CSS) and Mapbox/geolocation experience',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '7 days'
    ),

    -- 5. Business
    (
    'bbbb2222-0000-0000-0000-000000000005',
    'SaaS quản lý đơn hàng cho tiệm trà sữa',
    'Hệ thống POS + quản lý đơn hàng dành riêng cho chuỗi tiệm trà sữa nhỏ. Gồm: đặt hàng online, quản lý nguyên liệu, thống kê doanh thu, chương trình khách hàng thân thiết, và in hóa đơn. Giao diện đơn giản, dễ sử dụng cho nhân viên part-time.',
    'business',
    'Next.js and Prisma developers, PostgreSQL experience, Stripe payment integration, Tailwind CSS',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '5 days'
    ),

    -- 6. Environment
    (
    'bbbb2222-0000-0000-0000-000000000006',
    'IoT giám sát chất lượng không khí trong khuôn viên trường',
    'Lắp đặt cảm biến IoT (ESP32 + sensor PM2.5, CO2, nhiệt độ) quanh khuôn viên trường đại học. Dữ liệu realtime hiển thị trên web dashboard. Cảnh báo khi ô nhiễm vượt ngưỡng. Phân tích xu hướng theo mùa, giờ cao điểm.',
    'environment',
    'Hardware enthusiasts (Arduino, ESP32, MQTT), React frontend, InfluxDB and Grafana experience',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '3 days'
    ),

    -- 7. Art
    (
    'bbbb2222-0000-0000-0000-000000000007',
    'Website triển lãm nghệ thuật số cho sinh viên',
    'Nền tảng để sinh viên ngành thiết kế, mỹ thuật trưng bày tác phẩm online. Có gallery 3D ảo, hệ thống vote/react, và kết nối với nhà tuyển dụng. Hỗ trợ upload ảnh, video, mô hình 3D. Tổ chức triển lãm theo chủ đề định kỳ.',
    'art',
    'Three.js and WebGL developers, Next.js, Cloudinary integration, and Framer Motion animation experience',
    'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    now() - interval '1 day'
    )
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- BƯỚC 2: Tạo COMMENTS (25+ bình luận)
    -- ============================================
    INSERT INTO comments (id, idea_id, user_id, content, parent_id, created_at) VALUES

    -- === Comments từ người khác vào ideas của user thật ===

    -- Idea 1: Điểm danh khuôn mặt (5 top-level + 2 replies)
    ('dddd0001-0000-0000-0000-000000000001',
    'bbbb2222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
    'Ý tưởng quá hay! Trường mình cũng đang cần hệ thống này. Hiện tại điểm danh bằng giấy mất 5-10 phút mỗi tiết.',
    NULL, now() - interval '14 days'),

    ('dddd0001-0000-0000-0000-000000000002',
    'bbbb2222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
    'Mình có kinh nghiệm với OpenCV và face_recognition library. Accuracy khoảng 99.38% trên dataset LFW. Rất muốn contribute!',
    NULL, now() - interval '13 days'),

    -- Reply to comment about OpenCV experience
    ('dddd0001-0000-0000-0000-000000000003',
    'bbbb2222-0000-0000-0000-000000000001', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Tuyệt vời! Accuracy cao vậy rất ổn. Bạn join project nhé, mình sẽ tạo repo và invite!',
    'dddd0001-0000-0000-0000-000000000002', now() - interval '12 days' + interval '5 hours'),

    ('dddd0001-0000-0000-0000-000000000004',
    'bbbb2222-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
    'Cần xem xét vấn đề privacy và GDPR. Dữ liệu sinh trắc học rất nhạy cảm, nên có opt-in consent rõ ràng.',
    NULL, now() - interval '12 days'),

    -- Reply to privacy concern
    ('dddd0001-0000-0000-0000-000000000005',
    'bbbb2222-0000-0000-0000-000000000001', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Đồng ý! Mình sẽ thêm consent form và cho phép sinh viên opt-out. Dữ liệu sẽ encrypt at rest.',
    'dddd0001-0000-0000-0000-000000000004', now() - interval '11 days' + interval '8 hours'),

    ('dddd0001-0000-0000-0000-000000000006',
    'bbbb2222-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444',
    'Mình suggest dùng edge computing xử lý trên Raspberry Pi thay vì gửi ảnh lên cloud. Vừa nhanh vừa bảo mật hơn.',
    NULL, now() - interval '11 days'),

    ('dddd0001-0000-0000-0000-000000000007',
    'bbbb2222-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555',
    'Có thể tích hợp thêm phát hiện cảm xúc sinh viên trong lớp không? Giảng viên có thể biết được sinh viên có hứng thú hay không 😄',
    NULL, now() - interval '10 days'),

    -- Idea 2: App TOEIC (4 top-level + 1 reply)
    ('dddd0001-0000-0000-0000-000000000008',
    'bbbb2222-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
    'Mình đã thi TOEIC 900+. Rất muốn contribute phần nội dung listening và reading strategies.',
    NULL, now() - interval '11 days'),

    ('dddd0001-0000-0000-0000-000000000009',
    'bbbb2222-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555',
    'Spaced repetition là key! Mình đang nghiên cứu về Anki algorithm, có thể optimize lịch ôn tập cho từng user.',
    NULL, now() - interval '10 days'),

    ('dddd0001-0000-0000-0000-000000000010',
    'bbbb2222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
    'Nên có tính năng study group — mọi người cùng luyện tập và challenge nhau sẽ tạo motivation.',
    NULL, now() - interval '9 days'),

    -- Reply to study group suggestion
    ('dddd0001-0000-0000-0000-000000000011',
    'bbbb2222-0000-0000-0000-000000000002', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Ý hay! Mình sẽ thêm vào roadmap phase 2. Có thể dùng WebSocket cho realtime challenge.',
    'dddd0001-0000-0000-0000-000000000010', now() - interval '8 days' + interval '6 hours'),

    ('dddd0001-0000-0000-0000-000000000012',
    'bbbb2222-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444',
    'Mình biết làm React Native. Có thể đảm nhận phần mobile app nếu team cần.',
    NULL, now() - interval '8 days'),

    -- Idea 3: Dinh dưỡng (3 top-level + 1 reply)
    ('dddd0001-0000-0000-0000-000000000013',
    'bbbb2222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
    'Sinh viên ăn mì gói suốt 🍜. App này sẽ cứu sống rất nhiều người haha. Mình muốn tham gia phần food recognition.',
    NULL, now() - interval '8 days'),

    -- Reply to food recognition comment
    ('dddd0001-0000-0000-0000-000000000014',
    'bbbb2222-0000-0000-0000-000000000003', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Haha đúng rồi! Food recognition là core feature. Bạn join nhé, mình đang cần người phần này.',
    'dddd0001-0000-0000-0000-000000000013', now() - interval '7 days' + interval '4 hours'),

    ('dddd0001-0000-0000-0000-000000000015',
    'bbbb2222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
    'Có thể tích hợp với API của các quán ăn gần trường để gợi ý combo dinh dưỡng giá tốt không?',
    NULL, now() - interval '7 days'),

    ('dddd0001-0000-0000-0000-000000000016',
    'bbbb2222-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555',
    'Mình là sinh viên dinh dưỡng. Có thể hỗ trợ phần meal planning và tính toán macro/micro nutrients.',
    NULL, now() - interval '6 days'),

    -- Idea 4: Tình nguyện (3 top-level)
    ('dddd0001-0000-0000-0000-000000000017',
    'bbbb2222-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444',
    'Rất cần! Mình tham gia nhiều hoạt động tình nguyện nhưng không có nơi nào ghi nhận tập trung.',
    NULL, now() - interval '6 days'),

    ('dddd0001-0000-0000-0000-000000000018',
    'bbbb2222-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
    'Nên tích hợp với hệ thống điểm rèn luyện của trường. Sinh viên tham gia tình nguyện → tự động cộng điểm.',
    NULL, now() - interval '5 days'),

    ('dddd0001-0000-0000-0000-000000000019',
    'bbbb2222-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222',
    'Chứng nhận số blockchain-based sẽ rất cool. Không ai có thể fake được giờ tình nguyện.',
    NULL, now() - interval '4 days'),

    -- Idea 5: POS trà sữa (3 top-level)
    ('dddd0001-0000-0000-0000-000000000020',
    'bbbb2222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
    'Bạn mình đang mở tiệm trà sữa, hiện dùng sổ tay ghi đơn. App này sẽ giúp rất nhiều kiểu kinh doanh nhỏ!',
    NULL, now() - interval '4 days'),

    ('dddd0001-0000-0000-0000-000000000021',
    'bbbb2222-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
    'Nên có tính năng quản lý topping và combo. Khách order custom rất nhiều, cần linh hoạt.',
    NULL, now() - interval '3 days'),

    ('dddd0001-0000-0000-0000-000000000022',
    'bbbb2222-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333',
    'Mình có kinh nghiệm làm Stripe payment. Có thể giúp tích hợp thanh toán online + QR pay.',
    NULL, now() - interval '2 days'),

    -- Idea 6: IoT không khí (3 top-level + 1 reply)
    ('dddd0001-0000-0000-0000-000000000023',
    'bbbb2222-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444',
    'Mình có mấy con ESP32 và sensor sẵn rồi. Có thể prototype trong 1-2 tuần!',
    NULL, now() - interval '2 days'),

    -- Reply to ESP32 comment
    ('dddd0001-0000-0000-0000-000000000024',
    'bbbb2222-0000-0000-0000-000000000006', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Perfect! Mình sẽ gửi schematic cho bạn. Cần sensor PM2.5 (SDS011) và CO2 (MH-Z19).',
    'dddd0001-0000-0000-0000-000000000023', now() - interval '1 day' + interval '10 hours'),

    ('dddd0001-0000-0000-0000-000000000025',
    'bbbb2222-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222',
    'Grafana dashboard sẽ rất đẹp cho project này. Mình có thể setup InfluxDB + Grafana nhanh.',
    NULL, now() - interval '1 day'),

    ('dddd0001-0000-0000-0000-000000000026',
    'bbbb2222-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111',
    'Nghĩ tới mở rộng cho nhiều trường? Data aggregation sẽ tạo ra bức tranh ô nhiễm toàn thành phố.',
    NULL, now() - interval '12 hours'),

    -- Idea 7: Triển lãm nghệ thuật (2 top-level)
    ('dddd0001-0000-0000-0000-000000000027',
    'bbbb2222-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333',
    'Three.js virtual gallery sẽ rất ấn tượng! Mình đã từng build project tương tự, sẵn sàng share kinh nghiệm.',
    NULL, now() - interval '20 hours'),

    ('dddd0001-0000-0000-0000-000000000028',
    'bbbb2222-0000-0000-0000-000000000007', '55555555-5555-5555-5555-555555555555',
    'Kết nối với nhà tuyển dụng là điểm hay nhất. Portfolio online là xu hướng tất yếu.',
    NULL, now() - interval '10 hours'),

    -- === Comments của user thật vào ideas của người khác (5 top-level) ===

    ('dddd0001-0000-0000-0000-000000000029',
    'aaaa1111-0000-0000-0000-000000000001', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Mình rất quan tâm đến AI trong nông nghiệp. Đã có kế hoạch deployment chưa? Mình có thể giúp phần DevOps.',
    NULL, now() - interval '8 days'),

    ('dddd0001-0000-0000-0000-000000000030',
    'aaaa1111-0000-0000-0000-000000000002', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Gamification learning là hướng đi rất tốt. Mình suggest thêm tính năng code sandbox để học sinh viết code trực tiếp.',
    NULL, now() - interval '6 days'),

    ('dddd0001-0000-0000-0000-000000000031',
    'aaaa1111-0000-0000-0000-000000000003', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Mental health rất quan trọng. Nên thêm tính năng journaling và mood tracker hàng ngày các bạn ạ.',
    NULL, now() - interval '5 days'),

    ('dddd0001-0000-0000-0000-000000000032',
    'aaaa1111-0000-0000-0000-000000000005', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Mình có khoảng 50 cuốn sách IT muốn donate. Platform này xong thì mình sẽ là user đầu tiên!',
    NULL, now() - interval '3 days'),

    ('dddd0001-0000-0000-0000-000000000033',
    'aaaa1111-0000-0000-0000-000000000007', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2',
    'Bảo tàng số là ý tưởng tuyệt vời! Mình có thể hỗ trợ phần backend API và hosting trên cloud.',
    NULL, now() - interval '1 day');

    -- ============================================
    -- BƯỚC 3: Tạo JOIN REQUESTS
    -- ============================================
    INSERT INTO join_requests (idea_id, requester_id, status, message, relevant_skills, created_at) VALUES

    -- === Người khác xin join ideas của user thật ===

    -- Idea 1: Điểm danh khuôn mặt (3 requests)
    ('bbbb2222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'approved',
    'Mình chuyên Computer Vision, đã train được model nhận diện khuôn mặt với accuracy 98%. Rất muốn đóng góp vào project!',
    ARRAY['OpenCV', 'Python', 'Face Recognition', 'Deep Learning'],
    now() - interval '13 days'),

    ('bbbb2222-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'approved',
    'Mình có thể đảm nhận phần frontend dashboard cho giảng viên. Đã có kinh nghiệm làm admin panel.',
    ARRAY['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
    now() - interval '11 days'),

    ('bbbb2222-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'pending',
    'Mình muốn học thêm về AI. Có thể giúp phần testing và viết documentation.',
    ARRAY['Testing', 'Documentation', 'Python basics'],
    now() - interval '5 days'),

    -- Idea 2: App TOEIC (2 requests)
    ('bbbb2222-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'approved',
    'TOEIC 900+, có thể tạo nội dung bài học và review chất lượng câu hỏi. Rất hào hứng!',
    ARRAY['TOEIC', 'English', 'Content Creation'],
    now() - interval '10 days'),

    ('bbbb2222-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'approved',
    'Mình nghiên cứu về spaced repetition algorithms. Có thể optimize phần lịch ôn tập.',
    ARRAY['Python', 'Machine Learning', 'Algorithm Design'],
    now() - interval '9 days'),

    -- Idea 3: Dinh dưỡng (2 requests)
    ('bbbb2222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'approved',
    'Mình biết food recognition bằng TensorFlow. Đã train model nhận diện 200+ món ăn Việt.',
    ARRAY['TensorFlow', 'Python', 'Image Classification'],
    now() - interval '7 days'),

    ('bbbb2222-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'pending',
    'Mình là sinh viên dinh dưỡng Y Dược. Có thể tư vấn chuyên môn về CSDL thực phẩm.',
    ARRAY['Nutrition Science', 'Data Entry', 'Research'],
    now() - interval '5 days'),

    -- Idea 4: Tình nguyện (2 requests)
    ('bbbb2222-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'approved',
    'Mình hoạt động tình nguyện 3 năm, hiểu rõ pain point. Muốn giúp thiết kế UX flow.',
    ARRAY['UI/UX', 'Figma', 'User Research'],
    now() - interval '5 days'),

    ('bbbb2222-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'pending',
    'Mình có kinh nghiệm Mapbox và geolocation. Có thể giúp tính năng tìm project gần mình.',
    ARRAY['Mapbox', 'Geolocation', 'React'],
    now() - interval '3 days'),

    -- Idea 5: POS trà sữa (2 requests)
    ('bbbb2222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'approved',
    'Bạn mình mở tiệm trà sữa, mình có thể vừa dev vừa test thực tế. Win-win!',
    ARRAY['Next.js', 'PostgreSQL', 'Stripe', 'Business Analysis'],
    now() - interval '3 days'),

    ('bbbb2222-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'rejected',
    'Mình muốn tham gia nhưng đang bận project khác. Có thể join sau 1 tháng được không?',
    ARRAY['Node.js', 'Prisma'],
    now() - interval '2 days'),

    -- Idea 6: IoT không khí (2 requests)
    ('bbbb2222-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'approved',
    'Mình có sẵn ESP32 + cảm biến! Có thể prototype hardware trong 1 tuần.',
    ARRAY['Arduino', 'ESP32', 'IoT', 'MQTT'],
    now() - interval '2 days'),

    ('bbbb2222-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'pending',
    'Mình chuyên Grafana + InfluxDB. Có thể setup monitoring stack nhanh chóng.',
    ARRAY['Grafana', 'InfluxDB', 'Docker', 'DevOps'],
    now() - interval '1 day'),

    -- Idea 7: Triển lãm nghệ thuật (1 request)
    ('bbbb2222-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'pending',
    'Mình biết Three.js và đã build virtual gallery trước. Rất muốn contribute!',
    ARRAY['Three.js', 'WebGL', 'Next.js', 'Blender'],
    now() - interval '10 hours'),

    -- === User thật xin join ideas của người khác (5 requests) ===

    ('aaaa1111-0000-0000-0000-000000000001', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2', 'approved',
    'Mình có kinh nghiệm DevOps và cloud deployment. Có thể giúp setup CI/CD pipeline và deploy model lên AWS/GCP.',
    ARRAY['Docker', 'AWS', 'CI/CD', 'Python'],
    now() - interval '8 days'),

    ('aaaa1111-0000-0000-0000-000000000002', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2', 'approved',
    'Mình thích game-based learning! Có thể contribute phần code editor sandbox tích hợp trong browser.',
    ARRAY['React', 'Monaco Editor', 'WebAssembly', 'Game Design'],
    now() - interval '6 days'),

    ('aaaa1111-0000-0000-0000-000000000003', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2', 'pending',
    'Rất quan tâm mental health tech. Mình có thể giúp phần backend API và database design.',
    ARRAY['Node.js', 'PostgreSQL', 'API Design', 'Security'],
    now() - interval '4 days'),

    ('aaaa1111-0000-0000-0000-000000000005', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2', 'approved',
    'Mình yêu đọc sách và có kinh nghiệm fullstack Next.js + Supabase. Perfect match!',
    ARRAY['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    now() - interval '3 days'),

    ('aaaa1111-0000-0000-0000-000000000007', 'f68e8459-9b17-4428-8ee0-85e0f80bdcc2', 'pending',
    'Mình có thể giúp phần backend hosting và CDN cho media files (ảnh, video, 3D models).',
    ARRAY['Cloud Storage', 'CDN', 'Node.js', 'Cloudinary'],
    now() - interval '1 day');

    -- ============================================
    -- TỔNG KẾT:
    -- • 7 ideas (đủ 7 categories) - creator: f68e8459...
    -- • 33 comments (23 top-level + 5 replies from owner + 5 from user on others' ideas)
    -- • 20 join_requests (15 từ người khác + 5 từ user thật)
    -- ============================================
