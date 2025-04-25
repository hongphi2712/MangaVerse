document.addEventListener('DOMContentLoaded', function() {
    const userDropdown = document.querySelector('.user-dropdown');
    const userBtn = userDropdown.querySelector('.user-btn');
    const dropdownLinks = userDropdown.querySelectorAll('.dropdown-content a');

    userBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Ngăn chặn sự kiện click từ các link trong dropdown lan truyền lên
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Đóng dropdown khi click bên ngoài
    document.addEventListener('click', function(e) {
        if (!userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
});