/* ========================================
   RUGVED CHANDEKAR — PORTFOLIO SCRIPTS
   Enhanced Animations & Interactivity
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

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.appendChild(progressBar);

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorGlow);

    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });

    // Smooth glow follow
    function animateCursor() {
        glowX += (cursorX - glowX) * 0.12;
        glowY += (cursorY - glowY) * 0.12;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions
    const interactiveEls = document.querySelectorAll('a, button, .glass-panel, .chip, .float-badge, .nav-link, .nav-cta, .btn-glow, .btn-glass, .contact-btn, .pcard-link');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorGlow.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorGlow.classList.remove('cursor-hover');
        });
    });

    // ===== PARTICLE CANVAS =====
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-canvas');
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouseParticle = { x: -1000, y: -1000 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(168,85,247,', 'rgba(244,63,94,'][Math.floor(Math.random() * 4)];
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseParticle.x - this.x;
            const dy = mouseParticle.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }

            // Pulse opacity
            this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.15;

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + Math.max(0, this.currentOpacity) + ')';
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    let animTime = 0;
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animTime++;
        particles.forEach(p => {
            p.update(animTime);
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', (e) => {
        mouseParticle.x = e.clientX;
        mouseParticle.y = e.clientY;
    });

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

    // ===== SCROLL HANDLER =====
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar
        navbar.classList.toggle('scrolled', scrollY > 60);

        // Active section
        let cur = '';
        sections.forEach(s => {
            if (scrollY >= s.offsetTop - 130) cur = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
        });

        // Scroll progress
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / maxScroll) * 100;
        progressBar.style.width = progress + '%';

        // Navbar hide on scroll down, show on scroll up
        if (scrollY > lastScroll && scrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = scrollY;
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

    // ===== TEXT SCRAMBLE EFFECT =====
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.originalText = el.textContent;
            this.isAnimating = false;
        }
        animate() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const text = this.originalText;
            const length = text.length;
            let iteration = 0;
            const maxIterations = length * 2;

            const interval = setInterval(() => {
                this.el.textContent = text.split('').map((char, index) => {
                    if (index < iteration / 2) return char;
                    if (char === ' ') return ' ';
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                }).join('');

                iteration++;
                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    this.el.textContent = text;
                    this.isAnimating = false;
                }
            }, 30);
        }
    }

    // Apply scramble to section headings on scroll
    const headings = document.querySelectorAll('.section-heading');
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get only the direct text nodes (not the gradient spans)
                const textNodes = [];
                entry.target.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        textNodes.push(node);
                    }
                });
                // Add scramble class for visual feedback
                entry.target.classList.add('heading-revealed');
                scrambleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    headings.forEach(h => scrambleObserver.observe(h));

    // ===== SCROLL-TRIGGERED PARALLAX =====
    function parallaxOnScroll() {
        const scrollY = window.scrollY;

        // Hero elements parallax
        const heroLeft = document.querySelector('.hero-left');
        const heroRight = document.querySelector('.hero-right');
        if (heroLeft && scrollY < window.innerHeight) {
            heroLeft.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroRight.style.transform = `translateY(${scrollY * 0.08}px)`;
        }

        // Section labels float effect
        document.querySelectorAll('.section-label').forEach(label => {
            const rect = label.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * 0.03;
                label.style.transform = `translateX(${offset}px)`;
            }
        });
    }
    window.addEventListener('scroll', parallaxOnScroll, { passive: true });

    // ===== STAGGERED REVEAL FOR SKILL TAGS =====
    const skillTagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tags span');
                tags.forEach((tag, i) => {
                    tag.style.transitionDelay = (i * 0.06) + 's';
                    tag.classList.add('tag-visible');
                });
                skillTagObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-card').forEach(card => skillTagObserver.observe(card));

    // ===== STAGGERED REVEAL FOR EXPERIENCE LIST ITEMS =====
    const expObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('li');
                items.forEach((li, i) => {
                    li.style.transitionDelay = (i * 0.1 + 0.2) + 's';
                    li.classList.add('li-revealed');
                });
                expObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.exp-card').forEach(card => expObserver.observe(card));

    // ===== MAGNETIC HOVER FOR NAV LINKS =====
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });


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

    // ===== RIPPLE EFFECT ON BUTTONS =====
    document.querySelectorAll('.btn-glow, .btn-glass, .contact-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ===== DYNAMIC GRADIENT SHIFT ON HERO =====
    let hueShift = 0;
    function shiftGradient() {
        hueShift += 0.15;
        const heroName = document.querySelector('.hero-name');
        if (heroName) {
            heroName.style.filter = `hue-rotate(${Math.sin(hueShift * 0.01) * 15}deg)`;
        }
        requestAnimationFrame(shiftGradient);
    }
    shiftGradient();

    // ===== TIMELINE DRAW ON SCROLL =====
    const timeline = document.querySelector('.exp-timeline');
    if (timeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('timeline-animated');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        timelineObserver.observe(timeline);
    }

    // ===== FLOATING HERO PARTICLES =====
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.classList.add('hero-spark');
            spark.style.left = Math.random() * 100 + '%';
            spark.style.top = Math.random() * 100 + '%';
            spark.style.animationDelay = (Math.random() * 5) + 's';
            spark.style.animationDuration = (Math.random() * 3 + 3) + 's';
            spark.style.setProperty('--spark-size', (Math.random() * 3 + 1) + 'px');
            heroSection.appendChild(spark);
        }
    }

    // ===== ACHIEVEMENT CARDS COUNT-UP EFFECT =====
    document.querySelectorAll('.ach-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('ach-hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('ach-hovered');
        });
    });

    // ===== SECTION DIVIDER GLOW LINES =====
    document.querySelectorAll('.section').forEach(section => {
        const divider = document.createElement('div');
        divider.classList.add('section-glow-divider');
        section.appendChild(divider);
    });

    // ===== MARQUEE PAUSE ON HOVER =====
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const marqueeContainer = marqueeTrack.parentElement;
        marqueeContainer.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeContainer.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

    // ===== SCROLL-TRIGGERED CLASS ADDITIONS =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.about-layout, .skills-cards, .projects-grid, .achievements-row, .contact-layout, .code-terminal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== ENTRANCE ANIMATION =====
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // ===== SMOOTH SCROLL VELOCITY DETECTION =====
    let scrollVelocity = 0;
    let prevScrollY = 0;
    function trackVelocity() {
        scrollVelocity = Math.abs(window.scrollY - prevScrollY);
        prevScrollY = window.scrollY;

        // Speed-up particles when scrolling fast
        particles.forEach(p => {
            p.speedY += (scrollVelocity > 5 ? 0.1 : -0.05) * (p.speedY > 0 ? 1 : -1);
            p.speedY = Math.max(-1, Math.min(1, p.speedY));
        });

        requestAnimationFrame(trackVelocity);
    }
    trackVelocity();

    // ===== FOOTER WAVE ANIMATION =====
    const footer = document.querySelector('.footer');
    if (footer) {
        const wave = document.createElement('div');
        wave.classList.add('footer-wave');
        wave.innerHTML = `<svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="rgba(124,58,237,0.05)"/>
            <path d="M0,25 C360,50 720,5 1080,35 C1260,50 1380,15 1440,25 L1440,0 L0,0 Z" fill="rgba(6,182,212,0.03)"/>
        </svg>`;
        footer.insertBefore(wave, footer.firstChild);
    }

});
