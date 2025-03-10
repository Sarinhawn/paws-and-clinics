let lastScrollY = 0; // Guarda a posição do scroll
let ticking = false;

function animateImage() {
    let scrollTop = lastScrollY;
    let scaleFactor = 1 + scrollTop * 0.0003;  // Ajusta a taxa de crescimento
    let maxScale = Math.min(scaleFactor, 1.5); 

    document.querySelector(".hero-image img").style.transform = `scale(${maxScale})`;
    ticking = false;
}

window.addEventListener("scroll", function() {
    lastScrollY = window.scrollY;

    if (!ticking) {
        requestAnimationFrame(animateImage);
        ticking = true;
    }
});