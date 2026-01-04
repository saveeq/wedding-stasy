// ============================================================================
// КОНФИГУРАЦИЯ - ВСТАВЬТЕ СВОИ ДАННЫЕ СЮДА
// ============================================================================

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
    return EMAILJS_CONFIG.PUBLIC_KEY !== 'bCFykcE_YaJokIqC-' &&
           EMAILJS_CONFIG.SERVICE_ID !== 'service_hb8x70e' &&
           EMAILJS_CONFIG.TEMPLATE_ID !== 'template_y9uad0s';
}

// ============================================================================
// ЭКСПОРТ КОНФИГУРАЦИИ
// ============================================================================

// Не изменяйте код ниже
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAILJS_CONFIG, isConfigured };
}
