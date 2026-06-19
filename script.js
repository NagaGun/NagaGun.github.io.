const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const canvas = document.querySelector("#auroraCanvas");
const ctx = canvas.getContext("2d");

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

window.initDynamicContent = function() {
  document.querySelectorAll(".reveal:not(.observed)").forEach((item) => {
    item.classList.add("observed");
    revealObserver.observe(item);
  });
};

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

window.initInteractions = function() {

  document.querySelectorAll("[data-scroll-timeline]:not(.bound)").forEach((button) => {
    button.classList.add("bound");
    button.addEventListener("click", () => {
      const timeline = document.querySelector("#experienceTimeline");
      if (!timeline) return;
      const direction = Number(button.dataset.scrollTimeline);
      timeline.scrollBy({ left: direction * 380, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".tilt-card:not(.bound)").forEach((card) => {
    card.classList.add("bound");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
};

// Initial bind for hardcoded elements
window.initDynamicContent();
window.initInteractions();

let particles = [];
let width = 0;
let height = 0;
let animationFrame = 0;

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(width / 18)) }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 1 + Math.random() * 2.2,
    hue: index % 3
  }));
}

function drawAurora() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(76, 201, 240, 0.07)");
  gradient.addColorStop(0.5, "rgba(181, 108, 255, 0.08)");
  gradient.addColorStop(1, "rgba(255, 111, 216, 0.06)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    const color = particle.hue === 0 ? "76, 201, 240" : particle.hue === 1 ? "181, 108, 255" : "116, 247, 196";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, 0.7)`;
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 130) {
        ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - distance / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawAurora);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawAurora();

window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
