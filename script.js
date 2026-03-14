// Theme handling
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const navMenuBtn = document.getElementById("nav-menu-btn");
const navDrawer = document.getElementById("nav-drawer");
const yearEl = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function setInitialTheme() {
  const stored = window.localStorage.getItem("ma-portfolio-theme");
  if (stored === "light") {
    body.classList.add("theme-light");
  }
}

setInitialTheme();

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("theme-light");
    const mode = body.classList.contains("theme-light") ? "light" : "dark";
    window.localStorage.setItem("ma-portfolio-theme", mode);
  });
}

if (navMenuBtn && navDrawer) {
  navMenuBtn.addEventListener("click", () => {
    navMenuBtn.classList.toggle("is-open");
    navDrawer.classList.toggle("is-open");
  });

  navDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenuBtn.classList.remove("is-open");
      navDrawer.classList.remove("is-open");
    });
  });
}

// AOS initialization
if (window.AOS) {
  AOS.init({
    once: true,
    offset: 80,
    duration: 600,
    easing: "ease-out-cubic",
  });
}

// GSAP hero micro animation
if (window.gsap) {
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from(".hero-title span", { y: 24, opacity: 0, duration: 0.6, ease: "power3.out" })
    .from(".hero-subtitle", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(".hero-cta .btn", { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
    .from(".hero-orbit-card", { y: 26, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
}

// Skill bars animation on scroll
const skillFills = document.querySelectorAll(".meter-fill");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const level = el.getAttribute("data-skill-level");
        if (!el.dataset.animated) {
          el.style.transition = "width 900ms cubic-bezier(0.32, 0.72, 0, 1)";
          el.style.width = `${level}%`;
          el.dataset.animated = "true";
        }
      }
    });
  },
  { threshold: 0.4 }
);

skillFills.forEach((fill) => observer.observe(fill));

// Background orbital particles
const canvas = document.getElementById("orbital-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * (Math.min(w, h) * 0.35);
      particles.push({
        baseRadius: radius,
        angle,
        speed: (Math.random() * 0.3 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);

    particles.forEach((p) => {
      const x = Math.cos(p.angle) * p.baseRadius;
      const y = Math.sin(p.angle) * (p.baseRadius * 0.45);

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
      gradient.addColorStop(0, `rgba(94, 234, 212, ${p.alpha})`);
      gradient.addColorStop(0.7, `rgba(79, 70, 229, ${p.alpha * 0.4})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
      ctx.fill();

      p.angle += p.speed * 0.002;
    });

    ctx.restore();
    requestAnimationFrame(draw);
  }

  resize();
  createParticles(75);
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles(75);
  });
}

// Contact form basic validation (front-end)
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (e) => {
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      e.preventDefault();
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "#f97373";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      e.preventDefault();
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.style.color = "#f97373";
      return;
    }

    formStatus.textContent = "Sending message...";
    formStatus.style.color = "";
  });
}


