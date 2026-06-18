import './style.css';
import { initScene, updateSceneProgress, disposeScene } from './scene.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '917302519340';
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

function openWhatsApp(message) {
  window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

// ─── DOM References ───────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const heroContent = document.querySelector('.hero-content');
const threeContainer = document.getElementById('three-container');
const featureCards = document.querySelectorAll('.feature-card');
const programCards = document.querySelectorAll('.program-card');
const pricingCards = document.querySelectorAll('.pricing-card');
const sectionHeaders = document.querySelectorAll('#features h2, #programs h2, #pricing h2');
const ctaHeading = document.querySelector('#cta h2');

// ─── WhatsApp: Floating Icon ──────────────────────────────────────
const whatsappFloat = document.getElementById('whatsappFloat');
if (whatsappFloat) {
  whatsappFloat.addEventListener('click', (e) => {
    e.preventDefault();
    openWhatsApp(
      'Hi Velocity Wellness! 👋\n\nI\'m interested in learning more about your gym and membership options. Could you share more details?'
    );
  });
}

// ─── WhatsApp: "Join the Movement" Button ─────────────────────────
const joinMovementBtn = document.getElementById('joinMovementBtn');
if (joinMovementBtn) {
  joinMovementBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openWhatsApp(
      'Hello Velocity Wellness! 🏋️‍♂️\n\nI\'d like to join the movement! I\'m interested in your gym and would love to know more about memberships, pricing, and how to get started. Please share the details. Thank you!'
    );
  });
}

// ─── WhatsApp: Pricing Plan Buttons ───────────────────────────────
document.querySelectorAll('.pricing-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = btn.getAttribute('data-plan');
    const messages = {
      Starter:
        'Hi Velocity Wellness! 👋\n\nI\'m interested in the **Starter** plan ($49/month). Could you tell me more about what\'s included and how I can sign up?',
      Core:
        'Hi Velocity Wellness! 🏆\n\nI\'m interested in the **Core** plan ($99/month) — your most popular option! Please share the details and how I can get started. I\'m ready to join!',
      Elite:
        'Hi Velocity Wellness! 💪\n\nI\'m interested in the **Elite** plan ($199/month). I\'m looking for a premium experience with 1-on-1 coaching. Please tell me more about availability and how to enroll.',
    };
    openWhatsApp(messages[plan] || 'Hi Velocity Wellness! I\'m interested in your membership plans.');
  });
});

// ─── Web3Form Modal ───────────────────────────────────────────────
const formModal = document.getElementById('formModal');
const claimPassBtn = document.getElementById('claimPassBtn');
const modalClose = document.getElementById('modalClose');
const web3form = document.getElementById('web3form');
const formStatus = document.getElementById('formStatus');

function openModal() {
  formModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  formModal.classList.add('hidden');
  document.body.style.overflow = '';
  formStatus.classList.add('hidden');
}

if (claimPassBtn) {
  claimPassBtn.addEventListener('click', openModal);
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

// Close modal on backdrop click
formModal?.addEventListener('click', (e) => {
  if (e.target === formModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !formModal.classList.contains('hidden')) {
    closeModal();
  }
});

// Web3Form submission
if (web3form) {
  web3form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formStatus.classList.remove('hidden');
    formStatus.className = 'text-sm text-center text-slate-500';
    formStatus.textContent = 'Sending your request...';

    const formData = new FormData(web3form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        formStatus.className = 'text-sm text-center text-green-600 font-medium';
        formStatus.textContent = '✅ Request submitted successfully! We\'ll reach out to you shortly.';
        web3form.reset();
        setTimeout(closeModal, 2500);
      } else {
        formStatus.className = 'text-sm text-center text-red-500';
        formStatus.textContent = result.message || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      formStatus.className = 'text-sm text-center text-red-500';
      formStatus.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  });
}

// ─── Privacy Policy Modal ─────────────────────────────────────────
const privacyBtn = document.getElementById('privacyBtn');
const privacyModal = document.getElementById('privacyModal');
const privacyModalClose = document.getElementById('privacyModalClose');

function openPrivacy() {
  privacyModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePrivacy() {
  privacyModal.classList.add('hidden');
  document.body.style.overflow = '';
}

privacyBtn?.addEventListener('click', openPrivacy);
privacyModalClose?.addEventListener('click', closePrivacy);
privacyModal?.addEventListener('click', (e) => {
  if (e.target === privacyModal) closePrivacy();
});

// ─── Terms of Use Modal ───────────────────────────────────────────
const termsBtn = document.getElementById('termsBtn');
const termsModal = document.getElementById('termsModal');
const termsModalClose = document.getElementById('termsModalClose');

function openTerms() {
  termsModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeTerms() {
  termsModal.classList.add('hidden');
  document.body.style.overflow = '';
}

termsBtn?.addEventListener('click', openTerms);
termsModalClose?.addEventListener('click', closeTerms);
termsModal?.addEventListener('click', (e) => {
  if (e.target === termsModal) closeTerms();
});

// ─── Newsletter Form ──────────────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    if (email) {
      alert('🎉 Thanks for subscribing! Welcome to the Velocity community.');
      newsletterForm.reset();
    }
  });
}

// ─── Initial Reveals ──────────────────────────────────────────────
setTimeout(() => {
  heroContent?.classList.add('visible');
}, 200);

// ─── Init Three.js Scene ──────────────────────────────────────────
let sceneReady = false;

function init3D() {
  const container = threeContainer;
  if (!container) return;

  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) {
    disposeScene();
  }

  initScene(container);
  sceneReady = true;
}

init3D();

// Re-init on resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const hasCanvas = threeContainer?.querySelector('canvas');
    if (hasCanvas) {
      disposeScene();
    }
    init3D();
  }, 300);
});

// ─── GSAP Scroll Animations ───────────────────────────────────────

// 1. Navbar background on scroll
gsap.to(navbar, {
  scrollTrigger: {
    trigger: document.body,
    start: '100px top',
    toggleClass: { targets: navbar, className: 'nav-scrolled' },
    invalidateOnRefresh: true,
  },
});

// 2. 3D Kettlebell scroll-driven movement
if (sceneReady) {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    ScrollTrigger.create({
      trigger: featuresSection,
      start: 'top bottom',
      end: 'center center',
      onUpdate: (self) => {
        updateSceneProgress(self.progress);
      },
    });
  }
}

// 3. Feature cards reveal on scroll
featureCards.forEach((card) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    onEnter: () => card.classList.add('visible'),
    once: true,
  });
});

// 4. Program cards reveal
programCards.forEach((card) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    onEnter: () => card.classList.add('visible'),
    once: true,
  });
});

// 5. Pricing cards reveal
pricingCards.forEach((card) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    onEnter: () => card.classList.add('visible'),
    once: true,
  });
});

// 6. Section headers reveal
sectionHeaders.forEach((header) => {
  ScrollTrigger.create({
    trigger: header,
    start: 'top 85%',
    onEnter: () => header.classList.add('section-visible'),
    once: true,
  });
});

// 7. Footer CTA reveal
if (ctaHeading) {
  ScrollTrigger.create({
    trigger: ctaHeading,
    start: 'top 85%',
    onEnter: () => ctaHeading.classList.add('visible'),
    once: true,
  });
}

// ─── Smooth Scroll for Nav Links ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Refresh ScrollTrigger on load ───────────────────────────────
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

let refreshTimeout;
window.addEventListener('resize', () => {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
});

console.log('🚀 VELOCITY WELLNESS — Movement. Reimagined.');