import os
import re

# Danh sách các thay thế URL cần thực hiện
replacements = {
    r'/truyen-tranh/([^/]+)': r'/manga/\1',  # Ví dụ: /truyen-tranh/one-piece → /manga/one-piece
    r'/truyen-tranh/([^/]+)/([^/]+)': r'/manga/\1/\2',  # Ví dụ: /truyen-tranh/one-piece/chap-1 → /manga/one-piece/chap-1
    r'/tim-kiem': r'/search',  # Ví dụ: /tim-kiem?q=one-piece → /search?q=one-piece
    r'/the-loai/([^/]+)': r'/genres/\1',  # Ví dụ: /the-loai/action → /genres/action
    r'/danh-sach/([^/]+)': r'/lists/\1',  # Ví dụ: /danh-sach/top → /lists/top
    r'/trang-chu': r'/',  # Ví dụ: /trang-chu → /
    r'/truyen-tranh/([^/]+)/([^/]+)/([^/]+)': r'/manga/\1/\2/\3',  # Ví dụ: /truyen-tranh/one-piece/chap-1/part-1 → /manga/one-piece/chap-1/part-1
    r'/tai-xuong/([^/]+)': r'/download/\1',  # Ví dụ: /tai-xuong/one-piece-ep-1 → /download/one-piece-ep-1
    r'/goi-y': r'/suggestions',  # Ví dụ: /goi-y → /suggestions
    r'/thanh-toan': r'/payment',  # Ví dụ: /thanh-toan → /payment
    r'/thanh-vien': r'/members',  # Ví dụ: /thanh-vien → /members
    r'/lich-su': r'/history'  # Ví dụ: /lich-su → /history
}


# Các thư mục và file cần quét (theo đúng cấu trúc của bạn)
target_paths = [
    'controllers/',    # Tất cả file controller
    'routes/',         # Tất cả file route
    'views/pages/',    # Các file view EJS
    'views/layouts/',  # Layout files
    'views/partials/', # Partial files
    'config/index.js'  # File cấu hình
]

def update_file(filepath):
    """Cập nhật URL trong file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        for pattern, replacement in replacements.items():
            new_content, count = re.subn(pattern, replacement, content)
            if count > 0:
                content = new_content
                updated = True
        
        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'✅ Đã cập nhật: {filepath}')
        else:
            print(f'⏩ Không thay đổi: {filepath}')
            
    except Exception as e:
        print(f'❌ Lỗi khi xử lý {filepath}: {str(e)}')

def scan_directory(directory):
    """Quét toàn bộ thư mục"""
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.ejs', '.html')):
                update_file(os.path.join(root, file))

def main():
    print("🔄 Bắt đầu chuyển đổi URL...")
    
    for path in target_paths:
        if os.path.exists(path):
            if os.path.isfile(path):
                update_file(path)
            else:
                scan_directory(path)
        else:
            print(f"⚠️ Không tìm thấy: {path}")
    
    print("🎉 Hoàn tất chuyển đổi URL!")

if __name__ == "__main__":
    main()