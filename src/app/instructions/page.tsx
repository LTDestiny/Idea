import {
  Lightbulb,
  Plus,
  Pencil,
  Trash2,
  Users,
  Sun,
  Moon,
  UserCircle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Send,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InstructionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <section className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hướng dẫn sử dụng
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Trang hướng dẫn chi tiết các chức năng chính của nền tảng GLOCAL STEAM
          — quản lý Idea, thành viên, giao diện và hồ sơ cá nhân.
        </p>
      </section>

      {/* Table of contents */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">Mục lục</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <a href="#idea-crud" className="text-primary hover:underline">
                Quản lý Idea (Tạo, Sửa, Xóa)
              </a>
            </li>
            <li>
              <a href="#member-crud" className="text-primary hover:underline">
                Quản lý Member (Yêu cầu tham gia, Duyệt, Từ chối)
              </a>
            </li>
            <li>
              <a href="#theme" className="text-primary hover:underline">
                Chế độ Theme (Sáng / Tối)
              </a>
            </li>
            <li>
              <a href="#profile" className="text-primary hover:underline">
                Hồ sơ cá nhân (Profile)
              </a>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* ===================== 1. IDEA CRUD ===================== */}
      <section id="idea-crud" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">1. Quản lý Idea</h2>
        </div>

        {/* Create */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
              Tạo Idea mới (Create)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Bạn phải{" "}
              <Badge variant="secondary">đăng nhập</Badge> để tạo Idea.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Các bước thực hiện:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>
                  Nhấn nút{" "}
                  <Badge className="gap-1">
                    <Plus className="h-3 w-3" /> New Idea
                  </Badge>{" "}
                  trên thanh điều hướng (Navbar).
                </li>
                <li>
                  Điền các thông tin bắt buộc:
                  <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                    <li>
                      <strong>Title</strong> — Tiêu đề ý tưởng (tối đa 50 ký
                      tự).
                    </li>
                    <li>
                      <strong>Description</strong> — Mô tả chi tiết (tối đa 5000
                      ký tự).
                    </li>
                    <li>
                      <strong>Category</strong> — Chọn ít nhất 1 danh mục GLOCAL
                      STEAM (Science, Technology, Engineering, Art,
                      Mathematics).
                    </li>
                  </ul>
                </li>
                <li>
                  (Tuỳ chọn) Điền <strong>Looking for</strong> — Mô tả kỹ
                  năng/vai trò bạn cần tìm kiếm.
                </li>
                <li>
                  Nhấn <strong>Submit</strong> để tạo Idea.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Update */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Chỉnh sửa Idea (Update)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Chỉ{" "}
              <Badge variant="secondary">chủ sở hữu</Badge> của Idea mới có
              quyền chỉnh sửa.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Các bước thực hiện:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Vào trang chi tiết Idea mà bạn đã tạo.</li>
                <li>
                  Nhấn nút{" "}
                  <Badge variant="outline" className="gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </Badge>{" "}
                  (chỉ hiển thị nếu bạn là chủ sở hữu).
                </li>
                <li>
                  Thay đổi các thông tin cần cập nhật (Title, Description,
                  Category, Looking for).
                </li>
                <li>
                  Nhấn <strong>Save</strong> để lưu thay đổi.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Delete */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              Xóa Idea (Delete)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Chỉ{" "}
              <Badge variant="secondary">chủ sở hữu</Badge> của Idea mới có
              quyền xóa.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Các bước thực hiện:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Vào trang chi tiết Idea mà bạn đã tạo.</li>
                <li>
                  Nhấn nút{" "}
                  <Badge variant="destructive" className="gap-1">
                    <Trash2 className="h-3 w-3" /> Delete
                  </Badge>
                  .
                </li>
                <li>
                  Một hộp thoại xác nhận sẽ xuất hiện — nhấn{" "}
                  <strong>Confirm</strong> để xóa vĩnh viễn.
                </li>
              </ol>
            </div>
            <p className="text-destructive text-xs mt-2">
              ⚠️ Hành động này không thể hoàn tác. Tất cả bình luận và yêu cầu
              tham gia liên quan cũng sẽ bị xóa.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 2. MEMBER CRUD ===================== */}
      <section id="member-crud" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">2. Quản lý Member</h2>
        </div>

        {/* Join Request */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              Gửi yêu cầu tham gia (Join Request)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Bạn phải{" "}
              <Badge variant="secondary">đăng nhập</Badge> và không phải chủ sở
              hữu của Idea đó.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Vào trang chi tiết của Idea bạn muốn tham gia.</li>
              <li>
                Nhấn nút{" "}
                <Badge className="gap-1">
                  <Send className="h-3 w-3" /> Join
                </Badge>
                .
              </li>
              <li>Điền lời nhắn giới thiệu bản thân (tuỳ chọn).</li>
              <li>
                Nhấn <strong>Send Request</strong> — yêu cầu sẽ được gửi đến chủ
                Idea.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Approve / Reject */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Duyệt / Từ chối thành viên (Approve / Reject)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Chỉ{" "}
              <Badge variant="secondary">chủ sở hữu</Badge> Idea mới có quyền
              duyệt hoặc từ chối.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Vào trang chi tiết Idea mà bạn sở hữu.</li>
              <li>
                Tại phần <strong>Join Requests</strong>, bạn sẽ thấy danh sách
                yêu cầu đang chờ.
              </li>
              <li>
                Nhấn{" "}
                <Badge variant="outline" className="gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" /> Approve
                </Badge>{" "}
                để duyệt, hoặc{" "}
                <Badge variant="outline" className="gap-1 text-red-600">
                  <XCircle className="h-3 w-3" /> Reject
                </Badge>{" "}
                để từ chối.
              </li>
            </ol>
            <p className="text-muted-foreground text-xs mt-2">
              💡 Thành viên được duyệt sẽ xuất hiện trong trang{" "}
              <strong>Members</strong> và trong danh sách thành viên của Idea.
            </p>
          </CardContent>
        </Card>

        {/* Remove Member */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              Xóa thành viên (Remove)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Yêu cầu:</strong> Chỉ{" "}
              <Badge variant="secondary">chủ sở hữu</Badge> Idea mới có quyền
              xóa thành viên.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Vào trang chi tiết Idea mà bạn sở hữu.</li>
              <li>
                Tại danh sách thành viên đã tham gia, nhấn nút xóa bên cạnh tên
                thành viên cần loại bỏ.
              </li>
              <li>Xác nhận để hoàn tất.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 3. THEME ===================== */}
      <section id="theme" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Sun className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">3. Chế độ Theme</h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
            <p>
              GLOCAL STEAM hỗ trợ <strong>2 chế độ giao diện</strong>: Sáng
              (Light) và Tối (Dark). Hệ thống mặc định theo cài đặt hệ điều hành
              của bạn.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Sun className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Light Mode</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Giao diện sáng, phù hợp sử dụng ban ngày hoặc trong môi
                    trường có nhiều ánh sáng.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Moon className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Giao diện tối, giúp giảm mỏi mắt khi sử dụng vào ban đêm.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Cách chuyển đổi:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>
                  Tìm biểu tượng{" "}
                  <Sun className="inline h-4 w-4 text-yellow-500" /> /{" "}
                  <Moon className="inline h-4 w-4 text-indigo-500" /> trên thanh
                  điều hướng (góc phải).
                </li>
                <li>Nhấn vào biểu tượng để chuyển đổi giữa Light và Dark.</li>
                <li>
                  Chế độ sẽ được lưu tự động và áp dụng cho các lần truy cập
                  sau.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 4. PROFILE ===================== */}
      <section id="profile" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            4. Hồ sơ cá nhân (Profile)
          </h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
            <p>
              Trang Profile hiển thị thông tin cá nhân và tổng hợp hoạt động của
              bạn trên nền tảng.
            </p>

            <div className="space-y-2">
              <p className="font-medium">Thông tin hiển thị:</p>
              <ul className="list-disc list-inside ml-2 space-y-1.5">
                <li>
                  <strong>Tên hiển thị</strong> — Bạn có thể chỉnh sửa bằng cách
                  nhấn vào biểu tượng <Pencil className="inline h-3.5 w-3.5" />{" "}
                  bên cạnh tên.
                </li>
                <li>
                  <strong>Email</strong> — Địa chỉ email từ tài khoản đăng nhập
                  (không thể thay đổi).
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Các tab trong Profile:</p>
              <ul className="list-disc list-inside ml-2 space-y-1.5">
                <li>
                  <strong>My Ideas</strong> — Danh sách tất cả Idea bạn đã tạo.
                </li>
                <li>
                  <strong>Joined Ideas</strong> — Danh sách Idea bạn đã được
                  duyệt tham gia.
                </li>
                <li>
                  <strong>My Requests</strong> — Trạng thái các yêu cầu tham gia
                  bạn đã gửi (Pending / Approved / Rejected).
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Cách truy cập:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Đăng nhập vào hệ thống.</li>
                <li>
                  Nhấn vào tên hoặc biểu tượng{" "}
                  <UserCircle className="inline h-4 w-4" /> trên thanh điều
                  hướng.
                </li>
                <li>
                  Bạn sẽ được chuyển đến trang <strong>/profile</strong>.
                </li>
              </ol>
            </div>

            <p className="text-muted-foreground text-xs">
              💡 Nếu chưa đăng nhập, trang Profile sẽ không hiển thị nội dung.
              Vui lòng đăng nhập để xem và quản lý hồ sơ.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center mt-10">
        <p className="text-muted-foreground mb-4">
          Bạn đã sẵn sàng? Hãy bắt đầu khám phá và chia sẻ ý tưởng!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Khám phá Ideas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about" className="gap-2">
              Tìm hiểu về GLOCAL STEAM
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
