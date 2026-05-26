(function ($) {

  "use strict";

    // MENU MOBILE: Slide & Page Shift
    var $navbarCollapse = $('.navbar-collapse');
    var $body = $('body');
    var $pageWrapper = $('#page-wrapper');

    // Tambahkan kelas saat menu mulai terbuka
    $navbarCollapse.on('show.bs.collapse', function () {
      $body.addClass('mobile-menu-open');
      $pageWrapper.addClass('mobile-menu-open');
    });

    // Hapus kelas saat menu selesai tertutup
    $navbarCollapse.on('hidden.bs.collapse', function () {
      $body.removeClass('mobile-menu-open');
      $pageWrapper.removeClass('mobile-menu-open');
    });

    // Logika penutupan menu saat item diklik
    $('.navbar-collapse a').on('click',function(event){
      // Cek apakah yang diklik BUKAN dropdown toggle di dalam navbar-collapse
      // Atau jika link memiliki class 'smoothscroll' (agar scroll tetap jalan)
      if (!$(this).hasClass('dropdown-toggle') || $(this).hasClass('smoothscroll')) {
          // Jika menu sedang terbuka, tutup
          if ($navbarCollapse.hasClass('show')) {
             $navbarCollapse.collapse('hide');
          }
      } else {
          // Jika itu dropdown toggle, cegah event agar tidak menutup collapse parent
          event.stopPropagation();
          // Biarkan Bootstrap menangani toggle dropdown-menu itu sendiri
      }
    });

    // CUSTOM LINK SMOOTHSCROLL
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      if (!elWrapped.length) {
        return true;
      }
      // Kurangi tinggi navbar saat sticky
      var header_height = $('.sticky-wrapper.is-sticky .navbar').height() || $('.navbar').height(); // Ambil tinggi saat sticky, atau default jika belum

      scrollToDiv(elWrapped,header_height);
      return false;

      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop - navheight; // Kurangi tinggi navbar

        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    // Menutup menu saat klik di luar
    $(document).on('click', function(event) {
        var $navbarToggler = $('.navbar-toggler');
        // Cek jika menu terbuka DAN klik terjadi di luar area menu DAN di luar tombol toggler
        if ($navbarCollapse.hasClass('show') && !$navbarCollapse.is(event.target) && $navbarCollapse.has(event.target).length === 0 && !$navbarToggler.is(event.target) && $navbarToggler.has(event.target).length === 0) {
            $navbarCollapse.collapse('hide');
        }
    });

    // Galeri berjalan: buka gambar dalam modal zoom.
    var galleryImages = $('.gallery-zoom-trigger').map(function() {
      return {
        src: $(this).data('gallery-src'),
        title: $(this).data('gallery-title') || 'Galeri KJS'
      };
    }).get();
    var activeGalleryIndex = 0;

    function showGalleryImage(index, direction) {
      if (!galleryImages.length) {
        return;
      }

      activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
      var image = galleryImages[activeGalleryIndex];
      var animationClass = direction === 'prev' ? 'is-changing-prev' : direction === 'next' ? 'is-changing-next' : '';
      var $zoomImage = $('#galleryZoomImage');

      $zoomImage
        .removeClass('is-changing-next is-changing-prev')
        .attr('src', image.src)
        .attr('alt', image.title);
      $('#galleryZoomModalLabel').text(image.title);

      if (animationClass) {
        window.requestAnimationFrame(function() {
          $zoomImage.addClass(animationClass);
        });
      }
    }

    $('.gallery-zoom-trigger').on('click', function() {
      var $zoomModal = $('#galleryZoomModal');
      var imageSrc = $(this).data('gallery-src');

      if (!imageSrc || !$zoomModal.length) {
        return;
      }

      var selectedIndex = galleryImages.findIndex(function(image) {
        return image.src === imageSrc;
      });
      showGalleryImage(selectedIndex >= 0 ? selectedIndex : 0);

      var modal = bootstrap.Modal.getOrCreateInstance($zoomModal[0]);
      modal.show();
    });

    $('#galleryZoomPrev').on('click', function() {
      showGalleryImage(activeGalleryIndex - 1, 'prev');
    });

    $('#galleryZoomNext').on('click', function() {
      showGalleryImage(activeGalleryIndex + 1, 'next');
    });

    $('#galleryZoomModal').on('keydown', function(event) {
      if (event.key === 'ArrowLeft') {
        showGalleryImage(activeGalleryIndex - 1, 'prev');
      }
      if (event.key === 'ArrowRight') {
        showGalleryImage(activeGalleryIndex + 1, 'next');
      }
    });

    $('#galleryZoomModal').on('hidden.bs.modal', function() {
      $('#galleryZoomImage')
        .removeClass('is-changing-next is-changing-prev')
        .attr('src', '')
        .attr('alt', '');
    });

    // Sticky Navbar (Kode ini ada di jquery.sticky.js)
    // Pastikan file jquery.sticky.js dimuat dan kode $(document).ready di dalamnya berjalan

})(window.jQuery);
