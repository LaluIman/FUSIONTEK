// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        }
    });
});

ScrollReveal({ 
    reset: true,
    distance:'80px',
    duration:2000,
    delay:200
 });

 ScrollReveal().reveal('.heading, .show-off img, .show-off-2-text, .future h1' , { origin: 'bottom'});
 ScrollReveal().reveal('.subheading, .first-text, .show-off-2-button, .future span' , { origin: 'bottom', delay: 800});
 ScrollReveal().reveal('.wave, .second-text, .show-off-2-image' , { origin: 'bottom', delay: 1000 });