// Responsive menu
$(document).ready(function() {
    $('a.mobile_menu').on('click', function() {
        var currentNavHeight = $('nav').height(); //Utk cari tinggi nav
        
        if(currentNavHeight < 5) {
            var newNavHeight = $('nav ul').height() + 5; //Utk cari tahu tinggi top lvl nav, +5px, +5 bisa di delete supaya tidak ada height lebih di bawahnya
            $('nav').animate({'height': newNavHeight+'px'}, 300); //utk animasi menu
        } else {
            $('nav').animate({'height':'0px'}, 300, function() {
               $(this).removeAttr('style'); //this refer to nav, remove height=0  
            });
        }
    });
});


//Search
$('.fa-search').click(function() {
	$('.search').fadeToggle(300);
});


// Carousel
var slideIndex = 1;
showSlides(slideIndex);

var prev = $('.prev');
var next = $('.next');

prev.click(function() {
	plusSlides(-1);
});

next.click(function() {
	plusSlides(1);
});

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName('mySlides');
	var dots = document.getElementsByClassName('dot'); 
	if (n>slides.length) {slideIndex = 1};
	if (n < 1) {slideIndex = slides.length}
	for (i=0; i<slides.length; i++) {
		slides[i].style.display = 'none';
	}
	for (i=0; i<dots.length; i++) {
		dots[i].className = dots[i].className.replace('active', '');
	}
	slides[slideIndex-1].style.display = 'block';
	dots[slideIndex-1].className += ' active';
}













