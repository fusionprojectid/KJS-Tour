// Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Gallery Modal
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');

galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const imageUrl = item.getAttribute('data-src');
        modalImage.setAttribute('src', imageUrl);
        modal.classList.remove('hidden');
    });
});

function closeModal() {
    modal.classList.add('hidden');
    modalImage.setAttribute('src', ''); // Hapus src untuk menghentikan pemuatan
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    // Tutup modal jika latar belakang overlay diklik, bukan gambar itu sendiri
    if (e.target === modal) {
        closeModal();
    }
});

// Tutup modal dengan tombol Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});