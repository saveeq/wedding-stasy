<?php
/* ============================================
   Wedding Invitation RSVP Form Handler - V2
   PHP email sender with checkbox support
   ============================================ */

// ===== CONFIGURATION =====
// TODO: Set your email address here
$RECIPIENT_EMAIL = 'YOUR_EMAIL_HERE@example.com';  // <-- CHANGE THIS!

// Email settings
$EMAIL_SUBJECT = 'Новый ответ на свадебное приглашение';
$FROM_EMAIL = 'no-reply@yourdomain.tld';  // Change to match your domain
$FROM_NAME = 'Wedding RSVP System';

// ===== Security Headers =====
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ===== Helper Functions =====
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validate_length($value, $max_length) {
    return strlen($value) <= $max_length;
}

// ===== Get POST Data =====
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$guest_name = isset($_POST['guest_name']) ? sanitize_input($_POST['guest_name']) : '';
$attending = isset($_POST['attending']) ? sanitize_input($_POST['attending']) : '';
$drinks = isset($_POST['drinks']) ? sanitize_input($_POST['drinks']) : ''; // Now comes as comma-separated string
$dietary = isset($_POST['dietary']) ? sanitize_input($_POST['dietary']) : '';
$honeypot = isset($_POST['website']) ? $_POST['website'] : '';

// ===== Honeypot Check (Anti-Spam) =====
if (!empty($honeypot)) {
    // Silently reject spam
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// ===== Validate Required Fields =====
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (!validate_length($name, 100)) {
    $errors[] = 'Name is too long';
}

if (empty($attending) || !in_array($attending, ['yes', 'no'])) {
    $errors[] = 'Attending status is required';
}

if (!validate_length($guest_name, 100)) {
    $errors[] = 'Guest name is too long';
}

if (!validate_length($drinks, 500)) {
    $errors[] = 'Drinks preferences are too long';
}

if (!validate_length($dietary, 300)) {
    $errors[] = 'Dietary preferences are too long';
}

// Return errors if validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Validation failed: ' . implode(', ', $errors)
    ]);
    exit;
}

// ===== Check if recipient email is configured =====
if ($RECIPIENT_EMAIL === 'YOUR_EMAIL_HERE@example.com') {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Recipient email not configured. Please set $RECIPIENT_EMAIL in send.php'
    ]);
    exit;
}

// ===== Prepare Email Content =====
$attending_text = ($attending === 'yes') ? 'Да, с удовольствием' : 'К сожалению, не смогу';

$email_body = "=== Новый ответ на свадебное приглашение ===\n\n";
$email_body .= "ФИО гостя: $name\n";

if (!empty($guest_name)) {
    $email_body .= "ФИО сопровождающего: $guest_name\n";
}

$email_body .= "Придёт ли: $attending_text\n\n";

if (!empty($drinks)) {
    $email_body .= "Предпочтения по напиткам:\n$drinks\n\n";
} else {
    $email_body .= "Предпочтения по напиткам: Не указано\n\n";
}

if (!empty($dietary)) {
    $email_body .= "Особенности питания:\n$dietary\n\n";
}

$email_body .= "--- Детали отправки ---\n";
$email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "Время: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";

// ===== Email Headers =====
$headers = [];
$headers[] = "From: $FROM_NAME <$FROM_EMAIL>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . phpversion();

// ===== Send Email =====
$mail_sent = mail(
    $RECIPIENT_EMAIL,
    $EMAIL_SUBJECT,
    $email_body,
    implode("\r\n", $headers)
);

// ===== Return Response =====
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'RSVP received successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please check server mail configuration.'
    ]);
}

/* ===== SECURITY NOTES =====
 * 
 * 1. Ensure your server has mail() configured properly (e.g., sendmail, SMTP)
 * 2. For production, consider using PHPMailer or similar library for better reliability
 * 3. Add CAPTCHA (e.g., Google reCAPTCHA) if spam becomes an issue
 * 4. Keep PHP and server updated for security patches
 * 5. Consider rate limiting to prevent abuse
 * 6. Log failed attempts for monitoring
 * 7. Use HTTPS to protect form data in transit
 * 8. Validate/sanitize all inputs (done above)
 * 
 * For better email delivery:
 * - Use a dedicated SMTP service (SendGrid, Mailgun, etc.)
 * - Set up SPF, DKIM, DMARC records for your domain
 * - Use a real domain email as FROM address
 */
?>