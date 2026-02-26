// ============================================
//  ADENIRAN PRECIOUS ADEBAYO — Portfolio JS
// ============================================

// ----- SELECTORS -----
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
const contactForm = document.querySelector('.contact-form');

// ============================================
// 1. MOBILE MENU TOGGLE
// ============================================
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ============================================
// 2. STICKY HEADER + ACTIVE NAV ON SCROLL
// ============================================
window.onscroll = () => {

    // Sticky header
    header.classList.toggle('sticky', window.scrollY > 50);

    // Active nav link highlight
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 120;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.navbar a[href*="${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });

    // Close mobile menu on scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// ============================================
// 3. CLOSE MENU WHEN NAV LINK IS CLICKED
// ============================================
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

// ============================================
// 4. SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible — no need to re-trigger
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe all sections and portfolio cards
document.querySelectorAll('section, .portfolio-card, .service-box').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ============================================
// 5. CONTACT FORM — n8n WEBHOOK
// ============================================

// 🔁 Replace this with your actual n8n webhook URL when ready
const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const message = contactForm.querySelector('textarea').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                showFormMessage('Message sent! I will get back to you shortly.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }

        } catch (error) {
            showFormMessage('Something went wrong. Please try again or email me directly.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Helper: show form feedback message
function showFormMessage(msg, type) {
    // Remove existing message if any
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `form-message ${type}`;
    div.textContent = msg;

    // Style inline so it works without extra CSS
    div.style.cssText = `
        margin-top: 12px;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        background: ${type === 'success' ? '#0d3b2e' : '#3b0d0d'};
        color: ${type === 'success' ? '#4ade80' : '#f87171'};
        border: 1px solid ${type === 'success' ? '#16a34a' : '#dc2626'};
    `;

    contactForm.appendChild(div);

    // Auto-remove after 5 seconds
    setTimeout(() => div.remove(), 5000);
}

// ============================================
// 6. TYPED TEXT EFFECT (Home Section)
// ============================================
const typedTarget = document.querySelector('.home-content h3');

if (typedTarget) {
    const roles = [
        'Embedded Systems Engineer',
        'IoT Developer',
        'AI Automation Specialist',
        'Firmware Developer',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        // Finished typing
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, 1800); // Pause before deleting
            return;
        }

        // Finished deleting
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(type, isDeleting ? 50 : 90);
    }

    // Start typing after a short delay
    setTimeout(type, 800);
}