/* ============================================
   Wedding Invitation JavaScript - V2
   Vanilla JS - Winter theme
   ============================================ */

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        snowParticles: 80, // Increased for better visibility
        animationSpeed: 0.8,
        respectReducedMotion: true
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Snow Animation =====
    let snowEnabled = !prefersReducedMotion;
    let animationFrame;
    let snowflakes = [];

    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const snowToggle = document.getElementById('snowToggle');

    // Snowflake class with visible icy blue color
    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.7 + 0.3; // Higher opacity for visibility
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.radius = Math.random() * 3 + 1.5; // Larger snowflakes
            this.speed = Math.random() * 1.2 + 0.6;
            this.drift = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.y += this.speed * CONFIG.animationSpeed;
            this.x += this.drift;

            if (this.y > canvas.height) {
                this.reset();
            }

            if (this.x > canvas.width || this.x < 0) {
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            // Draw snowflake in icy blue color (visible against ivory background)
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            // Gradient for better visibility
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(168, 216, 234, ${this.opacity})`); // #a8d8ea
            gradient.addColorStop(0.5, `rgba(168, 216, 234, ${this.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(168, 216, 234, ${this.opacity * 0.4})`);

            ctx.fillStyle = gradient;
            ctx.fill();

            // Add a subtle white center for sparkle effect
            if (this.radius > 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
                ctx.fill();
            }
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }

    function initSnow() {
        if (!canvas || !ctx) return;

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create snowflakes
        for (let i = 0; i < CONFIG.snowParticles; i++) {
            snowflakes.push(new Snowflake());
        }

        if (snowEnabled && !prefersReducedMotion) {
            animateSnow();
        } else {
            canvas.style.display = 'none';
        }
    }

    function animateSnow() {
        if (!snowEnabled || prefersReducedMotion) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        animationFrame = requestAnimationFrame(animateSnow);
    }

    function toggleSnow() {
        snowEnabled = !snowEnabled;

        if (snowEnabled) {
            canvas.style.display = 'block';
            animateSnow();
            snowToggle.classList.remove('snow-off');
            snowToggle.setAttribute('title', 'Выключить снег');
        } else {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
            snowToggle.classList.add('snow-off');
            snowToggle.setAttribute('title', 'Включить снег');
        }
    }

    if (snowToggle) {
        snowToggle.addEventListener('click', toggleSnow);
        if (!snowEnabled) {
            snowToggle.classList.add('snow-off');
            snowToggle.setAttribute('title', 'Включить снег');
        }
    }

    // ===== Maps Button Deep-link Logic =====
    const mapsBtn = document.getElementById('mapsBtn');
    const mapsBtn1 = document.getElementById('mapsBtn1');

    if (mapsBtn) {
        mapsBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the Yandex Maps URL from data attribute
            const mapsUrl = this.getAttribute('data-maps-url');

            if (!mapsUrl || mapsUrl.includes('YOUR_ADDRESS_HERE')) {
                alert('Адрес места проведения будет указан позже');
                return;
            }

            // Try to open Yandex Maps app first (mobile deep-link)
            const appUrl = mapsUrl.replace('https://', 'yandexmaps://');

            // Attempt to open app
            const appAttempt = window.open(appUrl, '_blank');

            // Fallback to web version after short delay
            setTimeout(() => {
                if (!document.hidden) {
                    window.open(mapsUrl, '_blank');
                }
            }, 1500);
        });
    }
   if (mapsBtn1) {
        mapsBtn1.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the Yandex Maps URL from data attribute
            const mapsUrl1 = this.getAttribute('data-maps-url');

            if (!mapsUrl1 || mapsUrl1.includes('YOUR_ADDRESS_HERE')) {
                alert('Адрес места проведения будет указан позже');
                return;
            }

            // Try to open Yandex Maps app first (mobile deep-link)
            const appUrl1 = mapsUrl1.replace('https://', 'yandexmaps://');

            // Attempt to open app
            const appAttempt1 = window.open(appUrl1, '_blank');

            // Fallback to web version after short delay
            setTimeout(() => {
                if (!document.hidden) {
                    window.open(mapsUrl1, '_blank');
                }
            }, 1500);
        });
    }

    // ===== Form Handling =====
    const form = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const modal = document.getElementById('successModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    // Form validation
    function validateForm() {
        let isValid = true;

        // Name validation
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Пожалуйста, укажите ваше имя';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Attending validation
        const attendingInputs = document.querySelectorAll('input[name="attending"]');
        const attendingError = document.getElementById('attendingError');
        const attendingChecked = Array.from(attendingInputs).some(input => input.checked);

        if (!attendingChecked) {
            attendingError.textContent = 'Пожалуйста, выберите один из вариантов';
            isValid = false;
        } else {
            attendingError.textContent = '';
        }

        return isValid;
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Check honeypot
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                // Silently reject spam
                console.log('Spam detected');
                return;
            }

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // Prepare form data with checkboxes
            const formData = new FormData();

            // Add text fields
            formData.append('name', document.getElementById('name').value);
            formData.append('guest_name', document.getElementById('guestName').value);
            formData.append('dietary', document.getElementById('dietary').value);

            // Add attending radio
            const attendingInput = document.querySelector('input[name="attending"]:checked');
            if (attendingInput) {
                formData.append('attending', attendingInput.value);
            }

            // Add drinks checkboxes as array
            const drinksCheckboxes = document.querySelectorAll('input[name="drinks[]"]:checked');
            const selectedDrinks = Array.from(drinksCheckboxes).map(cb => cb.value);
            formData.append('drinks', selectedDrinks.join(', ') || 'Не указано');

            try {
                const response = await fetch('send.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success modal
                    showModal();

                    // Reset form
                    form.reset();
                } else {
                    alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
                    console.error('Form error:', result.error);
                }
            } catch (error) {
                alert('Произошла ошибка при отправке. Проверьте подключение к интернету.');
                console.error('Network error:', error);
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });

        // Real-time validation on blur
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                const nameError = document.getElementById('nameError');
                if (!this.value.trim()) {
                    nameError.textContent = 'Пожалуйста, укажите ваше имя';
                } else {
                    nameError.textContent = '';
                }
            });
        }

        // Attending validation on change
        const attendingInputs = document.querySelectorAll('input[name="attending"]');
        attendingInputs.forEach(input => {
            input.addEventListener('change', function() {
                const attendingError = document.getElementById('attendingError');
                attendingError.textContent = '';
            });
        });
    }

    // ===== Modal Functions =====
    function showModal() {
        if (!modal) return;

        modal.removeAttribute('hidden');
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.focus();
        }

        // Trap focus in modal
        trapFocus(modal);
    }

    function hideModal() {
        if (!modal) return;

        modal.setAttribute('hidden', '');
    }

    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
            hideModal();
        }
    });

    // ===== Smooth Scroll Reveal Animation =====
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    } else {
        // If reduced motion, show all sections immediately
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    }

    // ===== Initialize =====
    function init() {
        initSnow();
        console.log('Wedding invitation initialized ❄✨');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
