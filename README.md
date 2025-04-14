# Báo Cáo Dự Án: MangaVerse

## 1. Giới Thiệu Dự Án
**MangaVerse** là một ứng dụng web được phát triển để cung cấp một nền tảng trực tuyến dành cho cộng đồng yêu thích manga. Dự án tập trung vào việc cho phép người dùng khám phá, tìm kiếm, và đọc manga trực tuyến thông qua việc tích hợp **MangaDex API** – một nguồn dữ liệu phong phú về manga. MangaVerse được xây dựng với giao diện thân thiện, thiết kế tối giản, và tối ưu cho cả máy tính và thiết bị di động. Dự án được phát triển bởi **hongphi2712** và được lưu trữ công khai trên GitHub tại [https://github.com/hongphi2712/MangaVerse](https://github.com/hongphi2712/MangaVerse).

Giao diện trang chủ của MangaVerse (hình ảnh được cung cấp) cho thấy một thiết kế hiện đại với nền tối, logo "MangaVerse" nổi bật, và các tính năng chính như "Discover New Series" và "Find Your Favorite Genre". Điều này cho thấy dự án nhắm đến việc thu hút người dùng yêu thích manga bằng cách cung cấp một trải nghiệm khám phá và đọc manga liền mạch.

## 2. Mục Tiêu Dự Án
MangaVerse được phát triển với các mục tiêu chính sau:
- Cung cấp một nền tảng trực tuyến để người dùng khám phá và đọc manga từ **MangaDex API**.
- Xây dựng giao diện người dùng thân thiện, tối ưu cho cả máy tính và thiết bị di động.
- Hỗ trợ các tính năng tìm kiếm, lọc manga theo thể loại, danh sách, và gợi ý ngẫu nhiên.
- Tích hợp các tính năng như đăng nhập/đăng ký để cá nhân hóa trải nghiệm người dùng (dựa trên tệp `auth-popups.ejs`).

## 3. Tính Năng Chính
Dựa trên cấu trúc thư mục và giao diện, MangaVerse bao gồm các tính năng chính sau:

### 3.1. Khám Phá Manga
- **Trang Chủ (`index.ejs`)**: Hiển thị các phần như "Discover New Series" và "Find Your Favorite Genre", giúp người dùng khám phá manga mới hoặc theo sở thích.
- **Danh Sách Manga (`list.ejs`)**: Hiển thị danh sách manga theo các tiêu chí như "Popular Now" và "Latest Updates" (dựa trên đoạn code HTML trước đó).
- **Gợi Ý Ngẫu Nhiên (`randomController.js`)**: Cho phép người dùng khám phá manga ngẫu nhiên.

### 3.2. Tìm Kiếm và Lọc
- **Tìm Kiếm (`search.js`, `search-results.ejs`)**: Người dùng có thể tìm kiếm manga theo từ khóa (thanh tìm kiếm trên trang chủ).
- **Thể Loại (`genres.js`, `genre.ejs`)**: Lọc manga theo thể loại, với trang danh mục (`categories.ejs`).
- **Danh Sách Manga (`lists.js`, `list.ejs`)**: Hiển thị các danh sách manga như "Popular" hoặc "Recent".

### 3.3. Đọc Manga
- **Chi Tiết Manga (`manga-details.ejs`)**: Hiển thị thông tin chi tiết về một bộ manga, bao gồm tiêu đề, mô tả, và danh sách chương.
- **Đọc Trực Tuyến (`read.ejs`, `reader.ejs`)**: Giao diện đọc manga với khả năng xem từng chương (`chapters.js`).

### 3.4. Quản Lý Người Dùng
- **Đăng Nhập/Đăng Ký (`auth-popups.ejs`)**: Popup đăng nhập/đăng ký với giao diện hiện đại, hỗ trợ người dùng cá nhân hóa trải nghiệm (ví dụ: lưu danh sách manga yêu thích).
- **Chủ Đề (`themes.js`)**: Hỗ trợ thay đổi giao diện (theme) của ứng dụng.

## 4. Công Nghệ Sử Dụng
Dựa trên `package.json` và cấu trúc thư mục, MangaVerse được xây dựng với các công nghệ sau:

### 4.1. Backend
- **Node.js**: Nền tảng runtime chính để chạy ứng dụng.
- **Express (`express`)**: Framework chính để xây dựng server và định tuyến.
- **MangaDex API (`mangadex`)**: Tích hợp dữ liệu manga thông qua API từ MangaDex.
- **Axios (`axios`)**: Thư viện để gửi yêu cầu HTTP đến MangaDex API.
- **Node-Cache (`node-cache`)**: Lưu trữ dữ liệu tạm thời (cache) để tăng hiệu suất.
- **CORS (`cors`)**: Hỗ trợ Cross-Origin Resource Sharing để xử lý yêu cầu từ các domain khác.

### 4.2. Frontend
- **EJS (`ejs`, `express-ejs-layouts`)**: Template engine để render giao diện động (các tệp `.ejs` trong thư mục `views`).
- **HTML/CSS/JavaScript**: Giao diện tĩnh được viết trong các tệp `.ejs`, với CSS tùy chỉnh (dựa trên đoạn code CSS bạn cung cấp trước đó).
- **Font Poppins**: Sử dụng font từ Google Fonts để tạo giao diện hiện đại.

### 4.3. Công Cụ Phát Triển
- **Nodemon (`nodemon`)**: Công cụ dev để tự động khởi động lại server khi có thay đổi.
- **Vercel**: Hỗ trợ triển khai ứng dụng (dựa trên script `vercel-build` trong `package.json`).
- **Dotenv (`dotenv`)**: Quản lý biến môi trường (ví dụ: API keys, port).

### 4.4. Cấu Trúc Thư Mục
- **`/controllers`**: Chứa các controller để xử lý logic nghiệp vụ (`listController.js`, `mangaController.js`, v.v.).
- **`/routes`**: Định nghĩa các route API (`index.js`, `api.js`, `manga.js`, v.v.).
- **`/views`**: Chứa các tệp giao diện EJS, bao gồm:
  - **`/layouts`**: Giao diện chung (`main.ejs`, `reader.ejs`).
  - **`/pages`**: Các trang chính (`index.ejs`, `genre.ejs`, `manga-details.ejs`, v.v.).
  - **`/partials`**: Các thành phần tái sử dụng (`auth-popups.ejs`, `navbar.ejs`, v.v.).
- **`/public`**: Chứa tài nguyên tĩnh (CSS, JavaScript, hình ảnh).
- **`proxy.js`**: Proxy để xử lý các yêu cầu đến MangaDex API.

## 5. Thiết Kế Giao Diện
Giao diện của MangaVerse được thiết kế với phong cách tối giản, tối ưu cho trải nghiệm người dùng:
- **Màu Sắc**: Chủ đạo là nền tối (`#1e1e1e`) với các điểm nhấn màu đỏ (`#ff6b6b`) và trắng, tạo cảm giác hiện đại và dễ chịu cho mắt.
- **Trang Chủ**: Có logo "MangaVerse", thanh tìm kiếm, và các nút điều hướng ("Home", "Genres", "Lists", "Random", "Mangadex").
- **Popup Đăng Nhập/Đăng Ký**: Giao diện popup với thiết kế tối, nút đóng "X", và các trường "Email", "Password" (dựa trên hình ảnh trước đó).
- **Hiệu Ứng**: Một số hiệu ứng hover nhẹ trên các nút và link để tăng tính tương tác.

## 6. Tiến Độ Phát Triển
Dựa trên cấu trúc thư mục và giao diện, dự án đang ở giai đoạn **phát triển hoàn thiện**:
- Các tính năng chính (khám phá, tìm kiếm, đọc manga) đã được triển khai.
- Giao diện người dùng đã hoàn thiện (trang chủ, trang chi tiết manga, popup đăng nhập).
- Tích hợp MangaDex API đã hoạt động (dựa trên thư mục `/services/mangadex`).

### Công Việc Còn Lại
- **Xác Thực Người Dùng**: Tích hợp backend cho đăng nhập/đăng ký (hiện tại chỉ có giao diện popup).
- **Hiệu Suất**: Tối ưu hóa thời gian tải dữ liệu từ MangaDex API, có thể thêm cache lâu dài hơn.
- **Responsive**: Đảm bảo giao diện hoạt động hoàn hảo trên mọi thiết bị (hiện tại đã responsive nhưng có thể cần kiểm tra thêm).
- **Tính Năng Bổ Sung**: Thêm khả năng lưu manga yêu thích, đánh dấu chương đã đọc.

## 7. Thách Thức và Giải Pháp
### 7.1. Thách Thức
- **Tích Hợp API**: MangaDex API có thể thay đổi hoặc giới hạn số lượng yêu cầu, gây ảnh hưởng đến hiệu suất.
- **Hiệu Suất**: Tải dữ liệu manga (hình ảnh, chương) có thể chậm nếu không tối ưu hóa.
- **Bảo Mật**: Xử lý yêu cầu API qua proxy (`proxy.js`) cần đảm bảo an toàn, tránh rò rỉ dữ liệu.

### 7.2. Giải Pháp
- Sử dụng `node-cache` để lưu trữ dữ liệu tạm thời, giảm số lượng yêu cầu đến MangaDex API.
- Tối ưu hóa hình ảnh manga bằng cách nén hoặc tải dần (lazy loading).
- Thêm xác thực cho các yêu cầu API qua proxy, sử dụng biến môi trường (`dotenv`) để lưu trữ thông tin nhạy cảm.

## 8. Kết Luận
**MangaVerse** là một dự án đầy tiềm năng, mang đến một nền tảng đọc manga trực tuyến hiện đại và thân thiện với người dùng. Với việc tích hợp MangaDex API và sử dụng các công nghệ như Node.js, Express, và EJS, dự án đã đạt được nhiều tiến bộ trong việc cung cấp trải nghiệm đọc manga liền mạch. Giao diện tối giản, màu sắc hài hòa, và các tính năng như tìm kiếm, lọc theo thể loại, và đọc trực tuyến là những điểm nổi bật của MangaVerse.

### Đề Xuất Phát Triển Tiếp Theo
- Tích hợp đăng nhập/đăng ký đầy đủ để hỗ trợ cá nhân hóa.
- Thêm tính năng lưu manga yêu thích và đồng bộ tiến độ đọc.
- Tối ưu hóa hiệu suất và bảo mật cho các yêu cầu API.
- Triển khai ứng dụng trên Vercel để người dùng trải nghiệm thực tế.

**Ngày Báo Cáo**: 14/04/2025  
