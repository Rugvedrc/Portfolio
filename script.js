/* ========================================
   RUGVED CHANDEKAR — PORTFOLIO SCRIPTS
   Lightweight, no Three.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== AOS INIT =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
        });
    }

    // ===== TYPEWRITER =====
    const initTypewriter = () => {
        const el = document.getElementById('typewriter');
        if (!el) return;

        const phrases = [
            'LLM-based AI Systems',
            'Machine Learning Pipelines',
            'Backend Applications',
            'Real-time Collaborative Tools',
            'RAG Architectures',
            'Explainable AI Models',
        ];

        let pi = 0, ci = 0, deleting = false, speed = 80;

        const tick = () => {
            const phrase = phrases[pi];
            if (deleting) {
                el.textContent = phrase.substring(0, --ci);
                speed = 35;
            } else {
                el.textContent = phrase.substring(0, ++ci);
                speed = 80;
            }

            if (!deleting && ci === phrase.length) {
                speed = 2200;
                deleting = true;
            } else if (deleting && ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                speed = 400;
            }
            setTimeout(tick, speed);
        };

        setTimeout(tick, 1200);
    };
    initTypewriter();

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        let cur = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 130) cur = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
        });
    });

    // ===== MOBILE NAV =====
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });
        navLinks.forEach(l => l.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }));
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== SKILL BARS =====
    const skillBars = document.querySelectorAll('.sbar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => {
                    bar.style.width = bar.getAttribute('data-w') + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach(b => skillObserver.observe(b));

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.metric-num');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const dur = 2000;
                const inc = target / (dur / 16);
                let val = 0;
                const update = () => {
                    val += inc;
                    if (val < target) {
                        el.textContent = Math.ceil(val);
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                };
                update();
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));

    // ===== VANILLA TILT FOR GLASS CARDS =====
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.skill-card'), {
            max: 6,
            speed: 400,
            glare: true,
            'max-glare': 0.1,
        });
        VanillaTilt.init(document.querySelectorAll('.project-card'), {
            max: 4,
            speed: 400,
            glare: true,
            'max-glare': 0.08,
        });
    }

    // ===== CONTACT FORM =====
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const orig = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';
            btn.disabled = true;
            btn.style.opacity = '0.8';

            setTimeout(() => {
                btn.innerHTML = '<span>Sent! ✓</span>';
                btn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
                btn.style.opacity = '1';

                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                    form.reset();
                }, 2500);
            }, 1500);
        });
    }

    // ===== PARALLAX BLOBS =====
    let ticking = false;
    window.addEventListener('mousemove', e => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            document.querySelectorAll('.blob-cont').forEach((b, i) => {
                const s = (i + 1) * 12;
                b.style.transform = `translate(${x * s}px, ${y * s}px)`;
            });
            ticking = false;
        });
    });

    // ===== MAGNETIC FLOAT BADGES =====
    document.querySelectorAll('.float-badge').forEach(badge => {
        badge.addEventListener('mousemove', e => {
            const rect = badge.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            badge.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px) scale(1.3)`;
        });
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = '';
        });
    });

    // ===== SPOTLIGHT EFFECT =====
    document.querySelectorAll('.glass-panel').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ===== ENTRANCE ANIMATION =====
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

});
