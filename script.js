const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const amountButtons = document.querySelectorAll("[data-amount]");
const impactTitle = document.querySelector("[data-impact-title]");
const impactCopy = document.querySelector("[data-impact-copy]");
const meterRing = document.querySelector(".meter-ring");
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const quote = document.querySelector("[data-quote]");
const quoteAuthor = document.querySelector("[data-quote-author]");
const prevQuote = document.querySelector("[data-prev]");
const nextQuote = document.querySelector("[data-next]");

const impactMap = {
  15: {
    progress: "38%",
    title: "Heu fuer 3 Tage",
    copy: "15 EUR helfen, einen Teil der woechentlichen Heuversorgung fuer unsere Seniorenherde zu sichern."
  },
  35: {
    progress: "62%",
    title: "Medizin & Pflege",
    copy: "35 EUR unterstuetzen Verbandsmaterial, Medikamente und Kontrolltermine fuer Tiere mit besonderem Bedarf."
  },
  80: {
    progress: "86%",
    title: "Eine Patenschaft",
    copy: "80 EUR decken einen grossen Teil der monatlichen Versorgung eines Paten-Tieres ab."
  }
};

const quotes = [
  {
    text: "\"Man merkt sofort: Hier wird nicht verwaltet, hier wird wirklich hingeschaut.\"",
    author: "Familie Berger, Patenschaft seit 2022"
  },
  {
    text: "\"Der offene Hoftag war ruhig, professionell und unglaublich herzlich organisiert.\"",
    author: "Miriam K., Besucherin"
  },
  {
    text: "\"Unsere Schulklasse hat verstanden, dass Tierschutz jeden Tag aus vielen kleinen Entscheidungen besteht.\"",
    author: "Herr Wolff, Klassenleitung"
  }
];

let activeQuote = 0;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1100;
  const started = performance.now();

  function tick(now) {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

reveals.forEach((item) => revealObserver.observe(item));
counters.forEach((counter) => counterObserver.observe(counter));
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
});

amountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const amount = button.dataset.amount;
    const impact = impactMap[amount];

    amountButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    meterRing.style.setProperty("--progress", impact.progress);
    impactTitle.textContent = impact.title;
    impactCopy.textContent = impact.copy;
  });
});

function renderQuote(index) {
  const selected = quotes[index];
  quote.animate([
    { opacity: 0, transform: "translateY(8px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 320, easing: "ease-out" });
  quote.textContent = selected.text;
  quoteAuthor.textContent = selected.author;
}

prevQuote.addEventListener("click", () => {
  activeQuote = (activeQuote - 1 + quotes.length) % quotes.length;
  renderQuote(activeQuote);
});

nextQuote.addEventListener("click", () => {
  activeQuote = (activeQuote + 1) % quotes.length;
  renderQuote(activeQuote);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").toString().trim();
  formStatus.textContent = `Danke, ${name || "das hat geklappt"}! Deine Demo-Nachricht wurde vorbereitet.`;
  form.reset();
});
