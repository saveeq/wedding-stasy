/* ============================================
   Wedding Invitation JavaScript - With EmailJS
   Vanilla JS - Winter theme
   ============================================ */

// TODO: Убедитесь, что файл emailjs-config.js подключен ПЕРЕД этим файлом
// TODO: В HTML должна быть строка: <script src="emailjs-config.js"></script>
// TODO: И ПОСЛЕ неё: <script src="script.js"></script>

// ===== EMAILJS INITIALIZATION (вне IIFE) =====
// Инициализация EmailJS должна быть ДО IIFE
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
    console.error('Возможно, браузер блокирует CDN. Попробуйте:');
    console.error('1. Отключить блокировку трекеров для этого сайта');
    console.error('2. Или скачать emailjs локально');
} else if (typeof EMAILJS_CONFIG === 'undefined') {
    console.error('❌ ОШИБКА: emailjs-config.js не подключен!');
    console.error('Добавьте в HTML перед script.js:');
    console.error('<script src="emailjs-config.js"></script>');
}

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        snowParticles: 80,
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
        if (!canvas || !ctx) return;

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

    // ===== Maps Buttons with forEach =====
    const mapsBtns = document.querySelectorAll('.maps-btn');
    
    mapsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const mapsUrl = this.getAttribute('data-maps-url');

            if (!mapsUrl || mapsUrl.includes('YOUR_ADDRESS_HERE')) {
                alert('Адрес места проведения будет указан позже');
                return;
            }

            // Try to open Yandex Maps app first (mobile deep-link)
            const appUrl = mapsUrl.replace('https://', 'yandexmaps://');

            // Attempt to open app
            window.open(appUrl, '_blank');

            // Fallback to web version after short delay
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

    // Get drinks preferences
    function getDrinksPreferences() {
        const checkboxes = document.querySelectorAll('input[name="drinks[]"]:checked');
        if (checkboxes.length === 0) {
            return 'Не указано';
        }
        return Array.from(checkboxes).map(cb => cb.value).join(', ');
    }

    // Form submission with EmailJS
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Check honeypot (spam protection)
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                console.log('Spam detected');
                return;
            }

            // Check EmailJS configuration
            if (typeof emailjs === 'undefined') {
                alert('⚠️ EmailJS SDK не загружен. Возможно, браузер блокирует загрузку. Попробуйте отключить блокировку трекеров.');
                return;
            }

            if (typeof EMAILJS_CONFIG === 'undefined' || typeof isConfigured === 'undefined' || !isConfigured()) {
                alert('⚠️ EmailJS не настроен. Проверьте файл emailjs-config.js');
                return;
            }

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            spinner.style.display = 'inline-block';
            submitBtn.querySelector('.btn-text').textContent = 'Отправка...';

            // Prepare form data for EmailJS
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
                // Send via EmailJS
                const response = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );

                console.log('✅ Письмо отправлено успешно:', response);

                // Show success modal
                showModal();

                // Reset form
                form.reset();

            } catch (error) {
                console.error('❌ Ошибка отправки:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.');

            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                spinner.style.display = 'none';
                submitBtn.querySelector('.btn-text').textContent = 'Отправить';
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
        initSnow();
        console.log('🎉 Страница загружена ❄✨');
        
        // Check EmailJS status
        if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined' && typeof isConfigured === 'function' && isConfigured()) {
            console.log('✅ EmailJS готов к работе');
        } else if (typeof emailjs === 'undefined') {
            console.warn('⚠️ EmailJS SDK не загружен - форма не будет работать');
        } else {
            console.warn('⚠️ Настройте EmailJS в файле emailjs-config.js');
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ============================================================================
// EMAILJS INITIALIZATION
// ============================================================================

// TODO: Проверьте, что EMAILJS_CONFIG импортирован из emailjs-config.js
(function() {
    if (typeof EMAILJS_CONFIG === 'undefined') {
        console.error('❌ ОШИБКА: emailjs-config.js не подключен!');
        console.error('Добавьте в HTML перед script.js:');
        console.error('<script src="emailjs-config.js"></script>');
        return;
    }

    if (!isConfigured()) {
        console.warn('⚠️ ВНИМАНИЕ: EmailJS не настроен!');
        console.warn('Откройте файл emailjs-config.js и следуйте инструкциям TODO');
        return;
    }

    // Инициализация EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS инициализирован успешно');
})();

// ============================================================================
// FORM VALIDATION & SUBMISSION
// ============================================================================

const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');
const modal = document.getElementById('successModal');

// Валидация имени
function validateName(name) {
    return name.trim().length >= 2;
}

// Валидация выбора присутствия
function validateAttending() {
    return document.querySelector('input[name="attending"]:checked') !== null;
}

// Показ ошибки
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Скрытие ошибки
function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Валидация в реальном времени
document.getElementById('name').addEventListener('blur', function() {
    if (!validateName(this.value)) {
        showError('name', 'Пожалуйста, введите ваше полное имя');
    } else {
        hideError('name');
    }
});

document.querySelectorAll('input[name="attending"]').forEach(radio => {
    radio.addEventListener('change', function() {
        hideError('attending');
    });
});

// ============================================================================
// FORM SUBMISSION WITH EMAILJS
// ============================================================================

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Проверка honeypot (защита от ботов)
    if (document.getElementById('website').value !== '') {
        return false;
    }
    
    // Валидация формы
    let isValid = true;
    
    const name = document.getElementById('name').value;
    if (!validateName(name)) {
        showError('name', 'Пожалуйста, введите ваше полное имя');
        isValid = false;
    } else {
        hideError('name');
    }
    
    if (!validateAttending()) {
        showError('attending', 'Пожалуйста, выберите один из вариантов');
        isValid = false;
    } else {
        hideError('attending');
    }
    
    if (!isValid) {
        return;
    }
    
    // Проверка конфигурации EmailJS
    if (typeof EMAILJS_CONFIG === 'undefined' || !isConfigured()) {
        alert('⚠️ EmailJS не настроен. Проверьте файл emailjs-config.js');
        return;
    }
    
    // Отключение кнопки и показ спиннера
    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';
    submitBtn.querySelector('.btn-text').textContent = 'Отправка...';
    
    // Сбор данных формы
    const formData = {
        name: name,
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
        // Отправка через EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            formData
        );
        
        console.log('✅ Письмо отправлено успешно:', response);
        
        // Показ модального окна успеха
        showSuccessModal();
        
        // Очистка формы
        form.reset();
        
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
        
        // Показ ошибки пользователю
        alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.');
        
    } finally {
        // Возврат кнопки в исходное состояние
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        submitBtn.querySelector('.btn-text').textContent = 'Отправить';
    }
});

// Получение выбранных напитков
function getDrinksPreferences() {
    const checkboxes = document.querySelectorAll('input[name="drinks[]"]:checked');
    if (checkboxes.length === 0) {
        return 'Не указано';
    }
    return Array.from(checkboxes).map(cb => cb.value).join(', ');
}

// ============================================================================
// SUCCESS MODAL
// ============================================================================

function showSuccessModal() {
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Фокус на кнопке закрытия для доступности
    setTimeout(() => {
        document.getElementById('modalClose').focus();
    }, 100);
}

function closeSuccessModal() {
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeSuccessModal);
document.getElementById('modalOverlay').addEventListener('click', closeSuccessModal);

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeSuccessModal();
    }
});

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initSnow();
    console.log('🎉 Страница загружена');
    
    // Проверка конфигурации EmailJS
    if (typeof EMAILJS_CONFIG !== 'undefined' && isConfigured()) {
        console.log('✅ EmailJS готов к работе');
    } else {
        console.warn('⚠️ Настройте EmailJS в файле emailjs-config.js');
    }
});
