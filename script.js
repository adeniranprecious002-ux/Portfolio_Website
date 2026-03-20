// ================================================
//  ADENIRAN PRECIOUS ADEBAYO — Portfolio JS
//  Clean, modern, no dependencies
// ================================================

// ---- SELECTORS ----
const header = document.getElementById('header');
const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const typedEl = document.getElementById('typed-role');

// ================================================
// 1. STICKY HEADER + ACTIVE NAV
// ================================================
const onScroll = () => {
    // Sticky background
    header.classList.toggle('scrolled', window.scrollY > 40);

    // Highlight active nav link
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
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ================================================
// 2. MOBILE MENU TOGGLE
// ================================================
menuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ================================================
// 3. SCROLL REVEAL
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
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(
    'section, .service-card, .port-card, .skill-tag, .blog-featured'
).forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards within their parent
    if (el.matches('.service-card, .port-card, .skill-tag')) {
        const siblings = el.parentElement.querySelectorAll(el.tagName + ', .service-card, .port-card, .skill-tag');
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${idx * 0.06}s`;
    }
    revealObserver.observe(el);
});

// ================================================
// 4. TYPED TEXT EFFECT
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
        typedEl.textContent = deleting
            ? role.slice(0, cIdx - 1)
            : role.slice(0, cIdx + 1);

        deleting ? cIdx-- : cIdx++;

        if (!deleting && cIdx === role.length) {
            deleting = true;
            setTimeout(type, 2200);
            return;
        }
        if (deleting && cIdx === 0) {
            deleting = false;
            rIdx = (rIdx + 1) % roles.length;
        }
        setTimeout(type, deleting ? 40 : 80);
    };

    setTimeout(type, 1000);
}

// ================================================
// 5. CONTACT FORM — n8n WEBHOOK
// ================================================

// 🔁 Replace with your actual n8n webhook URL
const N8N_WEBHOOK = 'YOUR_N8N_WEBHOOK_URL_HERE';

const showFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
    }, 6000);
};

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if (!name || !email || !message) {
            showFeedback('Please fill in all fields.', 'error');
            return;
        }

        // Check webhook is configured
        if (N8N_WEBHOOK === 'YOUR_N8N_WEBHOOK_URL_HERE') {
            showFeedback('Contact form not yet configured. Please email me directly.', 'error');
            return;
        }

        const origText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;

        try {
            const res = await fetch(N8N_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                showFeedback('Message sent! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }
        } catch {
            showFeedback('Something went wrong. Please email me directly.', 'error');
        } finally {
            btn.textContent = origText;
            btn.disabled = false;
        }
    });
}