(function ($) {

  "use strict";

    // MENU MOBILE: Slide & Page Shift
    var $navbarCollapse = $('.navbar-collapse');
    var $body = $('body');

    // Tambahkan kelas saat menu mulai terbuka
    $navbarCollapse.on('show.bs.collapse', function () {
      $body.addClass('mobile-menu-open');
    });

    // Hapus kelas saat menu selesai tertutup
    $navbarCollapse.on('hidden.bs.collapse', function () {
      $body.removeClass('mobile-menu-open');
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

    // Sticky Navbar (Kode ini ada di jquery.sticky.js)
    // Pastikan file jquery.sticky.js dimuat dan kode $(document).ready di dalamnya berjalan

})(window.jQuery);