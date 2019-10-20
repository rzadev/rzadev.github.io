$(function () {
  // Slick slider
  if ($.fn.slick) {
    $('.slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      dots: true,
      focusOnSelect: true,
      slide: 'div',
      autoplay: true,
      mobileFirst: true,
      prevArrow: '<i class="fas fa-chevron-left"></i>',
      nextArrow: '<i class="fas fa-chevron-right"></i>'
    });
  }

});

