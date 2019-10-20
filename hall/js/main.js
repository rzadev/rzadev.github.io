$(function () {

  var $window = $(window);

  // Hide Nav
  $window.on('scroll', function () {
    var $nav = $('.navbar');
    if ($window.scrollTop() > 40) {
      // $nav.hide();
      $nav.fadeOut();
    } else {
      // $nav.show();
      $nav.fadeIn();
    }
  });


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
      // centerMode: true,
      // centerPadding: '30px',
      mobileFirst: true,
      prevArrow: '<i class="fa fa-angle-left"></i>',
      nextArrow: '<i class="fa fa-angle-right"></i>'
    });
  }


  // Newsletter
  var $newsletter = $('.newsletter form');

  function checkWidth() {
    var windowSize = $window.width();
    if (windowSize < 768) {
      $newsletter.removeClass("form-inline").addClass("form");
    } else {
      $newsletter.addClass('form-inline');
    }
  }

  // Execute on load
  checkWidth();
  // Bind event listener
  $(window).resize(checkWidth);

});