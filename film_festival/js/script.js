// Show or hide the Featured Films section using the Intersection Observer API
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting === true) {
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
});

const items = document.querySelectorAll('.featured .row');

items.forEach((item, index) => {
  observer.observe(item, index);
});