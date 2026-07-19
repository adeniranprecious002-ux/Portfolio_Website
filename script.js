// ================================================
//  ADENIRAN PRECIOUS ADEBAYO — Portfolio JS
//  Works on index.html AND all sub-pages
// ================================================

emailjs.init({
    publicKey: "mxQNZv39wc0Bm8IQe",
});

// ---- SELECTORS (null-safe) ----
const header      = document.getElementById('header');
const menuBtn     = document.getElementById('menu-btn');
const navbar      = document.getElementById('navbar');
const sections    = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.navbar a');
const contactForm = document.getElementById('contact-form');
const feedback    = document.getElementById('form-feedback');
const typedEl     = document.getElementById('typed-role');

// ================================================
// 1. STICKY HEADER + ACTIVE NAV
// ================================================
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (sections.length) {
      const scrollY = window.scrollY + 120;
      sections.forEach(section => {
        if (
          scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight
        ) {
          navLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.navbar a[href="#${section.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ================================================
// 2. MOBILE MENU TOGGLE
// ================================================
if (menuBtn && navbar) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ================================================
// 3. SCROLL REVEAL
//    Works on ALL pages:
//    - Adds reveal + observes dynamic elements (index.html)
//    - Observes elements already marked reveal in HTML (sub-pages)
// ================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
);

// Step 1: dynamically add reveal to index.html elements
document.querySelectorAll(
  'section, .service-card, .port-card, .skill-tag, .blog-featured, .cert-card, .proj-card'
).forEach((el) => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

// Step 2: observe ALL .reveal elements on the page (covers both index + sub-pages)
document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger sibling cards
  if (el.matches('.service-card, .port-card, .skill-tag, .cert-card, .proj-card')) {
    const siblings = el.parentElement.querySelectorAll(
      '.service-card, .port-card, .skill-tag, .cert-card, .proj-card'
    );
    const idx = Array.from(siblings).indexOf(el);
    if (!el.style.transitionDelay) {
      el.style.transitionDelay = `${idx * 0.07}s`;
    }
  }
  revealObserver.observe(el);
});

// ================================================
// 4. TYPED TEXT EFFECT (index.html only)
// ================================================
if (typedEl) {
  const roles = [
    'Embedded Systems Engineer',
    'IoT Developer',
    'AI Automation Specialist',
    'Firmware Developer',
    'TinyML Practitioner',
  ];
  let rIdx = 0, cIdx = 0, deleting = false;
  const type = () => {
    const role = roles[rIdx];
    typedEl.textContent = deleting ? role.slice(0, cIdx - 1) : role.slice(0, cIdx + 1);
    deleting ? cIdx-- : cIdx++;
    if (!deleting && cIdx === role.length) { deleting = true; setTimeout(type, 2200); return; }
    if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    setTimeout(type, deleting ? 40 : 80);
  };
  setTimeout(type, 1000);
}

// ================================================
// 5. CONTACT FORM — EmailJS
// ================================================

const showFeedback = (msg, type) => {
  if (!feedback) return;

  feedback.textContent = msg;
  feedback.className = `form-feedback ${type}`;

  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "form-feedback";
  }, 6000);
};

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      showFeedback("Please fill in all fields.", "error");
      return;
    }

    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {

      await emailjs.send(
        "service_4t51ldi",
        "template_vccmxga",
        {
          name: name,
          email: email,
          message: message,
        }
      );

      showFeedback("Message sent! I'll get back to you soon.", "success");
      contactForm.reset();

    } catch (error) {
      console.error(error);
      showFeedback("Failed to send message. Please try again.", "error");
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}
