(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs and keep instance to sync later when content is toggled
    var wow = new WOW();
    wow.init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-white shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-white shadow-sm').css('top', '-150px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: true,
        items: 1
    });

    /* 3D hero interaction: mousemove tilt + depth-based parallax for layers */
    (function () {
        try {
            var carousel = document.querySelector('.header-carousel');
            if (!carousel) return;

            var layers = carousel.querySelectorAll('[data-depth]');
            var plate = carousel.querySelector('.hero-plate');
            var rect = null;
            var centerX = 0, centerY = 0;
            var maxRotate = 10; // degrees

            function updateRect() {
                rect = carousel.getBoundingClientRect();
                centerX = rect.left + rect.width / 2;
                centerY = rect.top + rect.height / 2;
            }

            // Only enable on wider screens for performance / UX
            function enabled() {
                return window.innerWidth > 991;
            }

            function handleMove(e) {
                if (!enabled()) return;
                var clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
                var clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
                var x = clientX - centerX;
                var y = clientY - centerY;
                var rotY = (x / rect.width) * maxRotate;
                var rotX = -(y / rect.height) * maxRotate;

                // rotate the whole carousel subtly
                carousel.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

                // translate layers based on their depth
                layers.forEach(function (el) {
                    var depth = parseFloat(el.getAttribute('data-depth')) || 0;
                    // small XY offset for stronger parallax
                    var px = (x / rect.width) * (Math.abs(depth) * 0.18);
                    var py = (y / rect.height) * (Math.abs(depth) * 0.18);
                    // translateZ uses depth (positive moves forward)
                    var tz = depth;
                    el.style.transform = 'translateZ(' + tz + 'px) translateX(' + px + 'px) translateY(' + py + 'px)';
                });
            }

            function reset() {
                carousel.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
                carousel.style.transform = 'rotateX(0deg) rotateY(0deg)';
                layers.forEach(function (el) {
                    el.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
                    el.style.transform = 'translateZ(0px) translateX(0px) translateY(0px)';
                });
                // clear the transition after it's done so move is snappy again
                setTimeout(function () {
                    carousel.style.transition = '';
                    layers.forEach(function (el) { el.style.transition = ''; });
                }, 650);
            }

            updateRect();
            window.addEventListener('resize', updateRect);

            carousel.addEventListener('mousemove', handleMove);
            carousel.addEventListener('touchmove', handleMove, { passive: true });
            carousel.addEventListener('mouseleave', reset);
            carousel.addEventListener('touchend', reset);
        } catch (err) {
            console.error('3D hero init error', err);
        }
    })();


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        dots: true,
        loop: true,
        nav: false
    });

    // Services carousel
    $(".service-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 1500,
        margin: 20,
        loop: true,
        nav: true,
        dots: false,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2,
                margin: 30
            },
            992: {
                items: 3,
                margin: 30
            }
        }
    });
})(jQuery);
// Projects carousel
var projectOwl = $(".project-carousel");
projectOwl.owlCarousel({
  autoplay: true,
  center: true,
  loop: true,
  margin: 30,
  dots: true,
  nav: false, // we'll use our custom buttons instead
  responsive: {
    0: { items: 1 },
    768: { items: 2 },
    992: { items: 3 }
  }
});

// Custom buttons
$(".next-btn").click(function() {
  projectOwl.trigger("next.owl.carousel");
});

$(".prev-btn").click(function() {
  projectOwl.trigger("prev.owl.carousel");
});

// Team toggle behavior
$(function() {
    var $btnFounders = $("#btn-founders");
    var $btnTeam = $("#btn-team");
    var $founders = $(".founders");
    var $creative = $(".creative-team");

    $btnFounders.on('click', function() {
        if ($(this).hasClass('active')) return;
        $btnFounders.addClass('active');
        $btnTeam.removeClass('active');
        $creative.addClass('d-none');
        $founders.removeClass('d-none');
        // sync WOW to re-evaluate visibility/animations
        try { wow.sync(); } catch (e) {}
    });

    $btnTeam.on('click', function() {
        if ($(this).hasClass('active')) return;
        $btnTeam.addClass('active');
        $btnFounders.removeClass('active');
        $founders.addClass('d-none');
        $creative.removeClass('d-none');
        // sync WOW to re-evaluate visibility/animations
        try { wow.sync(); } catch (e) {}
    });
});