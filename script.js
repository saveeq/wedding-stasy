/* ============================================
   Wedding Invitation JavaScript - With EmailJS
   Vanilla JS - Winter theme
   ============================================ */

// TODO: Убедитесь, что файл emailjs-config.js подключен ПЕРЕД этим файлом
// TODO: В HTML должна быть строка: <script src="emailjs-config.js"></script>
// TODO: И ПОСЛЕ неё: <script src="script.js"></script>

// ===== EMAILJS INITIALIZATION (вне IIFE) =====
if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined' && typeof isConfigured === 'function') {
    if (isConfigured()) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS инициализирован успешно');
    } else {
        console.warn('⚠️ ВНИМАНИЕ: EmailJS не настроен!');
        console.warn('Откройте файл emailjs-config.js и следуйте инструкциям TODO');
    }
} else if (typeof emailjs === 'undefined') {
    console.error('❌ ОШИБКА: EmailJS SDK не загружен!');
    console.error('Убедитесь, что файл libs/emailjs.min.js существует');
} else if (typeof EMAILJS_CONFIG === 'undefined') {
    console.error('❌ ОШИБКА: emailjs-config.js не подключен!');
}

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        snowParticles: 80,
        animationSpeed: 0.8,
        respectReducedMotion: true
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Snow Animation =====
    let snowEnabled = !prefersReducedMotion;
    let animationFrame;
    let snowflakes = [];

    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const snowToggle = document.getElementById('snowToggle');

    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.radius = Math.random() * 3 + 1.5;
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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(168, 216, 234, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(168, 216, 234, ${this.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(168, 216, 234, ${this.opacity * 0.4})`);

            ctx.fillStyle = gradient;
            ctx.fill();

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
        if (!canvas || !ctx) {
            console.warn('⚠️ Canvas не найден - снегопад отключен');
            return;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

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

    // ===== Maps Buttons =====
    const mapsBtns = document.querySelectorAll('.maps-btn');
    
    mapsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const mapsUrl = this.getAttribute('data-maps-url');

            if (!mapsUrl || mapsUrl.includes('YOUR_ADDRESS_HERE')) {
                alert('Адрес места проведения будет указан позже');
                return;
            }

            const appUrl = mapsUrl.replace('https://', 'yandexmaps://');
            window.open(appUrl, '_blank');

            setTimeout(() => {
                if (!document.hidden) {
                    window.open(mapsUrl, '_blank');
                }
            }, 1500);
        });
    });

    // ===== Form Handling =====
    const form = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const modal = document.getElementById('successModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    function validateForm() {
        let isValid = true;

        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Пожалуйста, укажите ваше имя';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

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

    function getDrinksPreferences() {
        const checkboxes = document.querySelectorAll('input[name="drinks[]"]:checked');
        if (checkboxes.length === 0) {
            return 'Не указано';
        }
        return Array.from(checkboxes).map(cb => cb.value).join(', ');
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                console.log('Spam detected');
                return;
            }

            if (typeof emailjs === 'undefined') {
                alert('⚠️ EmailJS SDK не загружен. Убедитесь, что файл libs/emailjs.min.js существует.');
                return;
            }

            if (typeof EMAILJS_CONFIG === 'undefined' || typeof isConfigured === 'undefined' || !isConfigured()) {
                alert('⚠️ EmailJS не настроен. Откройте файл emailjs-config.js и заполните ваши ключи API.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            if (spinner) spinner.style.display = 'inline-block';
            const btnText = submitBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Отправка...';

            const formData = {
                name: document.getElementById('name').value,
                guest_name: document.getElementById('guestName').value || 'Не указано',
                attending: document.querySelector('input[name="attending"]:checked').value === 'yes' 
                    ? 'Да, приду с удовольствием' 
                    : 'К сожалению, не смогу',
                drinks: getDrinksPreferences(),
                dietary: document.getElementById('dietary').value || 'Нет особых пожеланий',
                submission_date: new Date().toLocaleString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            try {
                const response = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );

                console.log('✅ Письмо отправлено успешно:', response);
                showModal();
                form.reset();

            } catch (error) {
                console.error('❌ Ошибка отправки:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');

            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                if (spinner) spinner.style.display = 'none';
                if (btnText) btnText.textContent = 'Отправить';
            }
        });

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
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            setTimeout(() => modalContent.focus(), 100);
        }

        trapFocus(modal);
    }

    function hideModal() {
        if (!modal) return;

        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
        document.body.style.overflow = '';
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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
            hideModal();
        }
    });

    // ===== Smooth Scroll Reveal =====
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

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    } else {
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    }

    // ===== Initialize =====
    function init() {
        console.log('🎉 Страница загружена');
        
        // Инициализация снегопада
        initSnow();
        
        // Проверка EmailJS
        if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined' && typeof isConfigured === 'function' && isConfigured()) {
            console.log('✅ EmailJS готов к работе');
        } else if (typeof emailjs === 'undefined') {
            console.warn('⚠️ EmailJS SDK не загружен - проверьте libs/emailjs.min.js');
        } else {
            console.warn('⚠️ Настройте EmailJS в файле emailjs-config.js');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
