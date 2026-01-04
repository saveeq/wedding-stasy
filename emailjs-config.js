const EMAILJS_CONFIG = {
    // TODO: Вставьте ваш Public Key из EmailJS Dashboard → Account → API Keys
    PUBLIC_KEY: 'bCFykcE_YaJokIqC-',
    
    // TODO: Вставьте ваш Service ID из EmailJS Dashboard → Email Services
    SERVICE_ID: 'service_hb8x70e',
    
    // TODO: Вставьте ваш Template ID из EmailJS Dashboard → Email Templates
    TEMPLATE_ID: 'template_y9uad0s'
};

// ============================================================================
// ПРОВЕРКА КОНФИГУРАЦИИ
// ============================================================================

function isConfigured() {
    return EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE' &&
           EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID_HERE' &&
           EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID_HERE' &&
           EMAILJS_CONFIG.PUBLIC_KEY.length > 10 &&
           EMAILJS_CONFIG.SERVICE_ID.length > 10 &&
           EMAILJS_CONFIG.TEMPLATE_ID.length > 10;
}

// ============================================================================
// ЭКСПОРТ КОНФИГУРАЦИИ
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAILJS_CONFIG, isConfigured };
}
