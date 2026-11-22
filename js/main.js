const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

window.addEventListener("load", () => {
  document.body.classList.remove("loading");
  window.setTimeout(() => $(".loader")?.classList.add("done"), 650);
});

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuButton = $(".menu-toggle");
const nav = $(".desktop-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  nav.classList.toggle("open", open);
});
$$(".desktop-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
  }),
);

// Scroll-driven reveals and interface states
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.setProperty("--skill-width", bar.dataset.width);
        bar.classList.add("animated");
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.5 },
);
$$(".skill-track i").forEach((bar) => skillObserver.observe(bar));

const header = $(".site-header");
const backTop = $(".back-top");
function onScroll() {
  const active = window.scrollY > 30;
  header.classList.toggle("scrolled", active);
  backTop.classList.toggle("visible", window.scrollY > 650);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
backTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// Project category filters and search
const cards = $$(".project-card");
const searchInput = $("#project-search");
let activeFilter = "all";
function filterProjects() {
  const term = searchInput.value.trim().toLowerCase();
  let shown = 0;
  cards.forEach((card) => {
    const categoryMatch =
      activeFilter === "all" || card.dataset.category === activeFilter;
    const textMatch =
      !term ||
      `${card.dataset.name} ${card.textContent}`.toLowerCase().includes(term);
    const visible = categoryMatch && textMatch;
    card.classList.toggle("hidden", !visible);
    if (visible) shown++;
  });
  $("#project-note").textContent = shown
    ? ""
    : "No projects match that search. Try another keyword or category.";
}
$$(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    $$(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    filterProjects();
  }),
);
searchInput.addEventListener("input", filterProjects);

// Subtle pointer-follow glow on devices with a fine pointer
const glow = $(".cursor-glow");
if (
  window.matchMedia("(pointer:fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  window.addEventListener(
    "pointermove",
    (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );
}

// Contact form: compose an email without requiring a server
$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const subject = data.get("subject").trim();
  const message = data.get("message").trim();
  const body = `Hello Fadlurrahman,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;
  const mailto = `mailto:criffad24@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $("#form-note").textContent = "Opening your email app…";
  window.location.href = mailto;
});

// Gentle magnetic movement for the main call-to-action
if (window.matchMedia("(pointer:fine)").matches) {
  $$(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener(
      "pointerleave",
      () => (button.style.transform = ""),
    );
  });
}
