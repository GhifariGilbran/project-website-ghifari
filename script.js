// LOADING SCREEN
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1800); // Tampil 1.8 detik
});

// PARTICLES
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    )
      this.reset();
  }
  draw() {
    const primaryRgb = getComputedStyle(document.documentElement).getPropertyValue("--primary-rgb").trim();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${primaryRgb}, 0.3)`;
    ctx.fill();
  }
}
for (let i = 0; i < 70; i++) particles.push(new Particle());
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();


// HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-menu");
const navItems = document.querySelectorAll(".nav-item");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  // Change icon logic if needed
  const icon = hamburger.querySelector("i");
  if (navLinks.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Close nav when clicking a link
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active");
    const icon = hamburger.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });
});

// REVEAL ON SCROLL
function reveal() {
  const reveals = document.querySelectorAll(".reveal-on-scroll");
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
      
      // Khusus untuk Skill Bars (Option K)
      if (el.classList.contains("about-skills-table-wrapper")) {
        const progressBars = el.querySelectorAll(".skill-progress-fill");
        progressBars.forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    }
  });
}
window.addEventListener("scroll", reveal);
document.addEventListener("DOMContentLoaded", reveal);

// THEME TOGGLE (DARK/LIGHT MODE)
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const body = document.body;

// Check for saved theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "light") {
  body.classList.add("light-mode");
  themeIcon.classList.replace("fa-sun", "fa-moon");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  
  if (body.classList.contains("light-mode")) {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

// COLOR PICKER LOGIC (Option E)
const colorDots = document.querySelectorAll(".color-dot");
const root = document.querySelector(":root");

// Helper function to convert hex to RGB for CSS variables
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function setAccentColor(color) {
  root.style.setProperty("--primary", color);
  root.style.setProperty("--primary-rgb", hexToRgb(color));
  
  // Update active dot UI
  colorDots.forEach(dot => {
    dot.classList.remove("active");
    if (dot.dataset.color === color) dot.classList.add("active");
  });
  
  localStorage.setItem("accentColor", color);
}

colorDots.forEach(dot => {
  dot.addEventListener("click", () => {
    setAccentColor(dot.dataset.color);
  });
});

// Load saved accent color
const savedColor = localStorage.getItem("accentColor");
if (savedColor) {
  setAccentColor(savedColor);
}

// CUSTOM CURSOR
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Hover effect on interactable elements
  const setupCursorHover = () => {
    const interactables = document.querySelectorAll("a, button, input, textarea, .social-btn, .project-card, .tech-item, .contact-card, .experience-card");
    
    interactables.forEach(el => {
      // Remove previous event listeners to avoid duplication if called again
      el.removeEventListener("mouseenter", addCursorHover);
      el.removeEventListener("mouseleave", removeCursorHover);
      
      el.addEventListener("mouseenter", addCursorHover);
      el.addEventListener("mouseleave", removeCursorHover);
    });
  };

  const addCursorHover = () => document.body.classList.add("cursor-hover");
  const removeCursorHover = () => document.body.classList.remove("cursor-hover");

  // Initial setup
  setupCursorHover();
}

// TYPEWRITER EFFECT
const texts = ["Mahasiswa Informatika", "Data Analyst", "Web Developer"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

function type() {
  const typewriterElement = document.getElementById("typewriter");
  if (!typewriterElement) return;

  if (count === texts.length) {
    count = 0;
  }
  
  currentText = texts[count];

  if (isDeleting) {
    letter = currentText.slice(0, --index);
  } else {
    letter = currentText.slice(0, ++index);
  }

  typewriterElement.textContent = letter;

  let typeSpeed = 100;

  if (isDeleting) {
    typeSpeed /= 2; // Delete faster
  }

  if (!isDeleting && letter.length === currentText.length) {
    typeSpeed = 2000; // Pause at the end
    isDeleting = true;
  } else if (isDeleting && letter.length === 0) {
    isDeleting = false;
    count++;
    typeSpeed = 500; // Pause before typing next word
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", type);

// PROJECT FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      // Add animation trick
      card.style.animation = 'none';
      card.offsetHeight; /* trigger reflow */
      card.style.animation = null;

      if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  });
});

// CONTACT FORM TO WHATSAPP
function sendToWhatsApp(event) {
  event.preventDefault();
  
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const message = document.getElementById('sender-message').value;
  
  // Nomor HP tujuan (sama dengan tombol WhatsApp)
  const targetPhone = "6285891189980"; 
  
  // Format teks untuk WhatsApp (menggunakan encodeURIComponent agar rapi)
  const waText = encodeURIComponent(`Halo Ghifari!\nSaya ${name} (${email}).\n\n${message}`);
  const waUrl = `https://wa.me/${targetPhone}?text=${waText}`;
  
  // Feedback visual pada tombol
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Ubah tombol jadi "Mengirim..."
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  
  setTimeout(() => {
    // Buka tab WhatsApp
    window.open(waUrl, '_blank');
    
    // Efek Confetti (Option F)
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(), "#ffffff", "#818cf8"]
    });

    // Ubah tombol jadi "Berhasil"
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Dialihkan ke WhatsApp!';
    submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'; // Warna hijau
    
    // Reset form setelah beberapa detik
    setTimeout(() => {
      event.target.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = ''; // Kembali ke warna asli
    }, 4000);
  }, 800);
}

// SCROLL PROGRESS BAR + BACK TO TOP + ACTIVE NAV
const scrollProgress = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');
const allNavItems = document.querySelectorAll('.nav-item');
const allSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // 1. Scroll Progress Bar
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

  // 2. Back To Top Button
  if (backToTopBtn) {
    if (scrollTop > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // 3. Active Nav Highlight
  let currentSection = '';
  allSections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollTop >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  allNavItems.forEach(item => {
    item.classList.remove('active-nav');
    if (item.getAttribute('href') === '#' + currentSection) {
      item.classList.add('active-nav');
    }
  });
});

// Back to top click
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
