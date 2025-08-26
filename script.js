document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua tombol navigasi
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Ambil semua bagian konten halaman
    const pageContents = document.querySelectorAll('.page-content');

    // Tambahkan event listener untuk setiap tombol navigasi
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Mencegah link berpindah halaman secara default
            event.preventDefault();

            // Ambil target ID dari atribut 'data-target'
            const targetId = this.getAttribute('data-target');

            // Sembunyikan semua bagian konten
            pageContents.forEach(content => {
                content.classList.remove('active');
            });

            // Tampilkan hanya konten yang sesuai dengan target
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});


