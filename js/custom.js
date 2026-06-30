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

    // 1. DYNAMIC BOOKING FORM & COST ESTIMATOR
    var $bookingForm = $('#kjsBookingForm');
    if ($bookingForm.length) {
        var $bookingPackage = $('#bookingPackage');
        var $bookingQty = $('#bookingQty');
        var $bookingQtyWarning = $('#bookingQtyWarning');
        
        var $summaryPackage = $('#summaryPackage');
        var $summaryUnitPrice = $('#summaryUnitPrice');
        var $summaryQty = $('#summaryQty');
        var $summaryTotal = $('#summaryTotal');

        function formatRupiah(number) {
            return 'Rp ' + number.toLocaleString('id-ID');
        }

        function calculateEstimator() {
            var selectedOption = $bookingPackage.find('option:selected');
            var packageName = selectedOption.text().split(' (')[0];
            var price = parseInt(selectedOption.data('price')) || 0;
            var qty = parseInt($bookingQty.val()) || 0;

            // Validasi & warning minimal 10 orang
            if (qty < 10) {
                $bookingQtyWarning.removeClass('d-none');
            } else {
                $bookingQtyWarning.addClass('d-none');
            }

            var total = price * qty;

            // Update UI Card
            $summaryPackage.text(packageName);
            $summaryUnitPrice.text(formatRupiah(price));
            $summaryQty.text(qty + ' Orang');
            $summaryTotal.text(formatRupiah(total));
        }

        // Event Listeners
        $bookingPackage.on('change', calculateEstimator);
        $bookingQty.on('input change', calculateEstimator);

        // Initial Calculation
        calculateEstimator();

        // Submit Form
        $bookingForm.on('submit', function (e) {
            e.preventDefault();
            
            var name = $('#bookingName').val();
            var date = $('#bookingDate').val();
            var selectedOption = $bookingPackage.find('option:selected');
            var packageName = selectedOption.text().split(' (')[0];
            var price = parseInt(selectedOption.data('price')) || 0;
            var qty = parseInt($bookingQty.val()) || 0;
            var notes = $('#bookingNotes').val() || '-';
            var total = price * qty;

            // Format tanggal agar lebih mudah dibaca (YYYY-MM-DD -> DD/MM/YYYY)
            var formattedDate = date;
            if (date) {
                var dateParts = date.split('-');
                if (dateParts.length === 3) {
                    formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
                }
            }

            // Pesan WhatsApp terformat rapi
            var waMessage = "Halo Pokdarwis KJS, saya ingin memesan paket wisata:\n\n" +
                "*Nama Lengkap:* " + name + "\n" +
                "*Tanggal Kunjungan:* " + formattedDate + "\n" +
                "*Pilihan Paket:* " + packageName + "\n" +
                "*Jumlah Peserta:* " + qty + " Orang\n" +
                "*Estimasi Total Biaya:* " + formatRupiah(total) + "\n" +
                "*Catatan Tambahan:* " + notes + "\n\n" +
                "Mohon konfirmasi ketersediaan jadwal. Terima kasih!";

            var encodedMessage = encodeURIComponent(waMessage);
            var waUrl = "https://wa.me/6285232705259?text=" + encodedMessage;

            window.open(waUrl, '_blank');
        });
    }

    // 2. QUICK INQUIRY FORM
    var $inquiryForm = $('#kjsInquiryForm');
    if ($inquiryForm.length) {
        $inquiryForm.on('submit', function (e) {
            e.preventDefault();

            var name = $('#inquiryName').val();
            var phone = $('#inquiryPhone').val();
            var message = $('#inquiryMessage').val();

            var waMessage = "Halo Pokdarwis KJS, saya ingin mengajukan pertanyaan:\n\n" +
                "*Nama Lengkap:* " + name + "\n" +
                "*Nomor Kontak/WA:* " + phone + "\n" +
                "*Pertanyaan/Pesan:* " + message + "\n\n" +
                "Mohon info lebih lanjut. Terima kasih!";

            var encodedMessage = encodeURIComponent(waMessage);
            var waUrl = "https://wa.me/6285232705259?text=" + encodedMessage;

            window.open(waUrl, '_blank');
        });
    }

    // Sticky Navbar (Kode ini ada di jquery.sticky.js)
    // Pastikan file jquery.sticky.js dimuat dan kode $(document).ready di dalamnya berjalan

    // Back to Top Button behavior
    var $backToTop = $('#backToTop');
    if ($backToTop.length) {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $backToTop.addClass('show');
            } else {
                $backToTop.removeClass('show');
            }
        });

        $backToTop.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 300);
            return false;
        });
    }

    // Smooth scroll to top when clicking logo on the homepage
    $('.navbar-brand').on('click', function (e) {
        var path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html') || path === '' || $('#section_1').length > 0 && !path.includes('news') && !path.includes('paket') && !path.includes('event')) {
            var $hero = $('#section_1');
            if ($hero.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: 0
                }, 300);
                // Close mobile menu if open
                if ($('.navbar-collapse').hasClass('show')) {
                    $('.navbar-collapse').collapse('hide');
                }
            }
        }
    });

})(window.jQuery);
