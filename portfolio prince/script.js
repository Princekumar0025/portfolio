// Custom Cursor
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add some delay for the outline for a fluid effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

links.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// Update Year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll Animation Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show-animation");
        }
    });
});

const hiddenElements = document.querySelectorAll(".section-title, .skill-card, .project-card, .timeline-item, .cert-item");
hiddenElements.forEach((el) => observer.observe(el));
