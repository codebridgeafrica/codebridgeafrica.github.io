<?php
/**
 * ============================================================================
 * CodeBridge Africa - PHP Email Handler
 * File: php/send_email.php
 *
 * PURPOSE:
 *   Handles form submissions (registration & contact) and sends emails via
 *   Gmail SMTP using PHPMailer.
 *
 * HOW IT WORKS:
 *   1. JavaScript POSTs form data to this script as JSON.
 *   2. This script validates the data.
 *   3. Sends a notification email to the admin (CodeBridge Gmail account).
 *   4. Sends an automatic reply email to the person who submitted.
 *   5. Returns a JSON response that JavaScript can read.
 *
 * REQUIREMENTS:
 *   - PHP 7.4+ with allow_url_fopen enabled
 *   - PHPMailer library (install via Composer: composer require phpmailer/phpmailer)
 *   - A Gmail account with an App Password (NOT your regular password)
 *
 * SETUP GMAIL APP PASSWORD:
 *   1. Go to your Google Account → Security
 *   2. Enable 2-Step Verification (required)
 *   3. Under "2-Step Verification" → scroll to "App passwords"
 *   4. Create an App Password for "Mail" on "Other device (custom name)"
 *   5. Copy the 16-character password into GMAIL_APP_PASSWORD below
 *
 * GITHUB PAGES NOTE:
 *   GitHub Pages is static-only and CANNOT run PHP.
 *   To use this file, you need a PHP host. Free options:
 *   - InfinityFree (free PHP + MySQL hosting)
 *   - 000webhost (Hostinger's free tier)
 *   - Railway.app (Node/PHP containers)
 *   - Render.com
 *   Then call this URL from main.js instead of Formspree.
 *
 * SECURITY:
 *   - All inputs are sanitised and validated.
 *   - CORS headers restrict which origins can call this API.
 *   - Rate limiting should be added for production use (see bottom).
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
   1. CONFIGURATION — Update these values
--------------------------------------------------------------------------- */

define('GMAIL_USERNAME',     'your.gmail.account@gmail.com'); // Your Gmail address
define('GMAIL_APP_PASSWORD', 'xxxx xxxx xxxx xxxx');          // 16-char App Password (with spaces is fine)
define('ADMIN_EMAIL',        'your.gmail.account@gmail.com'); // Who receives notifications
define('ADMIN_NAME',         'CodeBridge Africa');
define('SITE_NAME',          'CodeBridge Africa');
define('SITE_URL',           'https://codebridgeafrica.github.io');

/* ---------------------------------------------------------------------------
   2. CORS HEADERS
   Allow requests from your GitHub Pages domain only
--------------------------------------------------------------------------- */

// Allow your GitHub Pages site to call this script
header('Access-Control-Allow-Origin: https://codebridgeafrica.github.io');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request (browsers send this before POST)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Method not allowed.', 405);
}

/* ---------------------------------------------------------------------------
   3. LOAD PHPMAILER
   Assumes Composer autoloader. Run: composer require phpmailer/phpmailer
--------------------------------------------------------------------------- */
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as MailException;

/* ---------------------------------------------------------------------------
   4. PARSE & SANITISE INCOMING DATA
   Accepts JSON body (sent by fetch in main.js) or form-encoded data
--------------------------------------------------------------------------- */

// Try to decode JSON body first (for fetch() calls from JavaScript)
$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

// Fallback to $_POST if not JSON (standard HTML form submit)
if (!$data || !is_array($data)) {
    $data = $_POST;
}

// Determine form type from the 'form_type' field sent by JavaScript
$formType = sanitiseString($data['form_type'] ?? 'contact');

/* ---------------------------------------------------------------------------
   5. ROUTE TO APPROPRIATE HANDLER
--------------------------------------------------------------------------- */

if ($formType === 'registration') {
    handleRegistration($data);
} elseif ($formType === 'contact') {
    handleContact($data);
} else {
    sendJsonResponse(false, 'Unknown form type.');
}

/* ===========================================================================
   REGISTRATION HANDLER
   Validates and sends registration notification + auto-reply
=========================================================================== */

/**
 * Handle new student registration submissions
 * @param array $data  Cleaned POST data
 */
function handleRegistration(array $data): void {

    /* ---- Validate required fields ---- */
    $errors = [];

    $fullName      = sanitiseString($data['full_name'] ?? '');
    $email         = sanitiseEmail($data['email'] ?? '');
    $phone         = sanitiseString($data['phone'] ?? '');
    $dateOfBirth   = sanitiseString($data['date_of_birth'] ?? '');
    $courseInterest = sanitiseString($data['course_interest'] ?? '');
    $referralSource = sanitiseString($data['referral_source'] ?? 'Not specified');
    $notes         = sanitiseString($data['notes'] ?? '');

    if (strlen($fullName) < 3)       $errors[] = 'Full name is required (min 3 characters).';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email address is required.';
    if (empty($dateOfBirth))         $errors[] = 'Date of birth is required.';
    if (empty($courseInterest))      $errors[] = 'Course interest is required.';

    if (!empty($errors)) {
        sendJsonResponse(false, implode(' ', $errors));
    }

    /* ---- Course name lookup (for readable emails) ---- */
    $courseNames = [
        'codebridge-kids'  => 'CodeBridge Kids (Ages 6–12)',
        'teen-techies'     => 'Teen Techies (Ages 13–19)',
        'adult-pro'        => 'Adult Pro / Degrees (18+)',
        'web-development'  => 'Web Development',
        'data-science'     => 'Data Science & Analytics',
        'cybersecurity'    => 'Cybersecurity',
        'it-consulting'    => 'IT Consulting / Support',
    ];
    $courseName = $courseNames[$courseInterest] ?? $courseInterest;

    /* ---- Build ADMIN notification email ---- */
    $adminSubject = '🎓 New Student Registration — ' . SITE_NAME;
    $adminBody    = buildEmailTemplate(
        title:   'New Student Registration',
        icon:    '🎓',
        intro:   'A new student has submitted a registration application.',
        rows: [
            'Full Name'       => $fullName,
            'Email'           => $email,
            'Phone'           => $phone ?: 'Not provided',
            'Date of Birth'   => $dateOfBirth,
            'Course Interest' => $courseName,
            'Referral Source' => $referralSource,
            'Notes'           => $notes ?: 'None',
            'Submitted At'    => date('D, d M Y H:i:s T'),
        ],
        footer: 'This registration was submitted via the CodeBridge Africa website.'
    );

    /* ---- Build STUDENT auto-reply email ---- */
    $studentSubject = '✅ Application Received — ' . SITE_NAME;
    $studentBody    = buildEmailTemplate(
        title:   'Thank You, ' . explode(' ', $fullName)[0] . '!',
        icon:    '✅',
        intro:   "We've received your application for <strong>{$courseName}</strong> at CodeBridge Africa.",
        rows: [
            'Your Name'   => $fullName,
            'Programme'   => $courseName,
            'Status'      => 'Under Review',
            'Next Steps'  => 'Our admissions team will contact you within 24 hours.',
        ],
        footer: 'If you have any questions, reply to this email or visit ' . SITE_URL
    );

    /* ---- Send emails ---- */
    $adminSent   = sendEmail(ADMIN_EMAIL, ADMIN_NAME, $adminSubject, $adminBody, $email, $fullName);
    $studentSent = sendEmail($email, $fullName, $studentSubject, $studentBody);

    if ($adminSent) {
        // Log registration to a CSV file for records (optional)
        logSubmission('registration', [
            'name'    => $fullName,
            'email'   => $email,
            'course'  => $courseName,
            'date'    => date('Y-m-d H:i:s'),
        ]);
        sendJsonResponse(true, '🎉 Application submitted! Check your email for confirmation.');
    } else {
        sendJsonResponse(false, 'There was a problem sending your application. Please try again.');
    }
}

/* ===========================================================================
   CONTACT HANDLER
   Validates and sends contact notification + auto-reply
=========================================================================== */

/**
 * Handle contact form submissions
 * @param array $data  Cleaned POST data
 */
function handleContact(array $data): void {

    $errors = [];

    $name    = sanitiseString($data['name'] ?? '');
    $email   = sanitiseEmail($data['email'] ?? '');
    $subject = sanitiseString($data['subject'] ?? 'General Enquiry');
    $message = sanitiseString($data['message'] ?? '');

    if (strlen($name) < 2)       $errors[] = 'Name is required.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
    if (strlen($message) < 10)   $errors[] = 'Message is too short (min 10 characters).';

    if (!empty($errors)) {
        sendJsonResponse(false, implode(' ', $errors));
    }

    /* ---- Admin notification email ---- */
    $adminSubject = '📬 Contact Message — ' . SITE_NAME . ': ' . $subject;
    $adminBody    = buildEmailTemplate(
        title:   'New Contact Message',
        icon:    '📬',
        intro:   'Someone has sent a message via the contact form.',
        rows: [
            'Name'         => $name,
            'Email'        => $email,
            'Subject'      => $subject,
            'Message'      => nl2br(htmlspecialchars($message)),
            'Submitted At' => date('D, d M Y H:i:s T'),
        ],
        footer: 'Reply directly to this email to respond to ' . $name . '.'
    );

    /* ---- Auto-reply to sender ---- */
    $replySubject = '📩 We Received Your Message — ' . SITE_NAME;
    $replyBody    = buildEmailTemplate(
        title:   'Message Received!',
        icon:    '📩',
        intro:   "Hi <strong>{$name}</strong>, thank you for reaching out to CodeBridge Africa.",
        rows: [
            'Your Subject' => $subject,
            'Response Time' => 'We typically respond within 24 hours on business days.',
        ],
        footer: 'If this is urgent, please WhatsApp us or call our office number. Visit ' . SITE_URL
    );

    $adminSent = sendEmail(ADMIN_EMAIL, ADMIN_NAME, $adminSubject, $adminBody, $email, $name);
    $replySent = sendEmail($email, $name, $replySubject, $replyBody);

    if ($adminSent) {
        logSubmission('contact', [
            'name'    => $name,
            'email'   => $email,
            'subject' => $subject,
            'date'    => date('Y-m-d H:i:s'),
        ]);
        sendJsonResponse(true, '✅ Message sent! We\'ll get back to you within 24 hours.');
    } else {
        sendJsonResponse(false, 'Failed to send message. Please email us directly.');
    }
}

/* ===========================================================================
   PHPMAILER — SEND EMAIL VIA GMAIL SMTP
=========================================================================== */

/**
 * Send an HTML email via Gmail SMTP using PHPMailer
 *
 * @param string $toEmail      Recipient email address
 * @param string $toName       Recipient display name
 * @param string $subject      Email subject line
 * @param string $htmlBody     Full HTML body content
 * @param string $replyToEmail Optional: reply-to address (defaults to admin)
 * @param string $replyToName  Optional: reply-to name
 * @return bool                True on success, false on failure
 */
function sendEmail(
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    string $replyToEmail = '',
    string $replyToName  = ''
): bool {

    $mail = new PHPMailer(true); // true = enable exceptions

    try {
        /* ---- SMTP Configuration (Gmail) ---- */
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';          // Gmail SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = GMAIL_USERNAME;            // Your Gmail address
        $mail->Password   = GMAIL_APP_PASSWORD;        // Gmail App Password (NOT your account password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use STARTTLS
        $mail->Port       = 587;                       // Standard Gmail SMTP port

        /* ---- OPTIONAL: Enable verbose debugging (set to 0 in production) ---- */
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;

        /* ---- Sender ---- */
        $mail->setFrom(GMAIL_USERNAME, ADMIN_NAME);

        /* ---- Recipient ---- */
        $mail->addAddress($toEmail, $toName);

        /* ---- Reply-To (useful for admin emails so we can reply to the student) ---- */
        if (!empty($replyToEmail)) {
            $mail->addReplyTo($replyToEmail, $replyToName ?: $replyToEmail);
        }

        /* ---- Email Content ---- */
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        // Plain text fallback (strip HTML tags)
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));

        $mail->send();
        return true;

    } catch (MailException $e) {
        // Log the error (do not expose details to the client)
        error_log('[CodeBridge Email Error] ' . $mail->ErrorInfo);
        return false;
    }
}

/* ===========================================================================
   EMAIL HTML TEMPLATE BUILDER
   Builds a professional branded HTML email
=========================================================================== */

/**
 * Build a branded HTML email body
 *
 * @param string $title   Email heading
 * @param string $icon    Emoji icon for the heading
 * @param string $intro   Introductory paragraph
 * @param array  $rows    Key => Value pairs for the data table
 * @param string $footer  Footer note
 * @return string         Full HTML email body
 */
function buildEmailTemplate(
    string $title,
    string $icon,
    string $intro,
    array  $rows,
    string $footer
): string {

    /* Build the data rows */
    $rowsHtml = '';
    foreach ($rows as $label => $value) {
        $rowsHtml .= "
        <tr>
          <td style='padding:10px 16px;font-weight:600;color:#1A2B4A;
                     background:#F5F3EE;border-right:2px solid #DDD8D0;
                     white-space:nowrap;width:30%'>{$label}</td>
          <td style='padding:10px 16px;color:#5A5A5A'>{$value}</td>
        </tr>";
    }

    return "
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1'>
  <title>{$title}</title>
</head>
<body style='margin:0;padding:0;background:#F5F3EE;font-family:\"Segoe UI\",Arial,sans-serif'>

  <!-- Outer wrapper -->
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#F5F3EE;padding:32px 0'>
    <tr>
      <td align='center'>

        <!-- Email card -->
        <table width='600' cellpadding='0' cellspacing='0'
               style='max-width:600px;width:100%;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(26,43,74,0.12)'>

          <!-- Header -->
          <tr>
            <td style='background:linear-gradient(135deg,#1A2B4A 0%,#243656 100%);
                       padding:32px 32px 24px;text-align:center'>
              <!-- Logo text (use actual img tag if hosting images) -->
              <div style='font-family:Georgia,serif;font-size:24px;font-weight:700;
                          color:#E85D1A;letter-spacing:0.02em'>CodeBridge Africa</div>
              <div style='height:4px;margin:12px auto 0;width:60px;
                          background:linear-gradient(90deg,#E85D1A,#F0B429,#2E7D32)'>
              </div>
            </td>
          </tr>

          <!-- Icon + Title -->
          <tr>
            <td style='padding:32px 32px 16px;text-align:center'>
              <div style='font-size:3rem;margin-bottom:12px'>{$icon}</div>
              <h1 style='margin:0;font-family:Georgia,serif;font-size:1.75rem;
                         font-weight:700;color:#1A2B4A'>{$title}</h1>
            </td>
          </tr>

          <!-- Intro paragraph -->
          <tr>
            <td style='padding:0 32px 24px'>
              <p style='margin:0;font-size:1rem;color:#5A5A5A;line-height:1.7;
                        text-align:center'>{$intro}</p>
            </td>
          </tr>

          <!-- Data table -->
          <tr>
            <td style='padding:0 32px 32px'>
              <table width='100%' cellpadding='0' cellspacing='0'
                     style='border-collapse:collapse;border-radius:8px;overflow:hidden;
                            border:1px solid #DDD8D0'>
                {$rowsHtml}
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style='padding:0 32px 32px;text-align:center'>
              <a href='" . SITE_URL . "'
                 style='display:inline-block;background:#E85D1A;color:#ffffff;
                        text-decoration:none;font-weight:600;font-size:0.95rem;
                        padding:12px 28px;border-radius:8px'>
                Visit CodeBridge Africa →
              </a>
            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style='background:#1A2B4A;padding:20px 32px;text-align:center'>
              <p style='margin:0;font-size:0.8rem;color:rgba(255,255,255,0.6)'>
                {$footer}
              </p>
              <p style='margin:8px 0 0;font-size:0.75rem;color:rgba(255,255,255,0.4)'>
                &copy; " . date('Y') . " CodeBridge Africa · Accra, Ghana
              </p>
            </td>
          </tr>

        </table><!-- /email card -->

      </td>
    </tr>
  </table>

</body>
</html>";
}

/* ===========================================================================
   UTILITY FUNCTIONS
=========================================================================== */

/**
 * Sanitise a general string input (trim + strip HTML)
 * @param string $value
 * @return string
 */
function sanitiseString(string $value): string {
    return trim(strip_tags($value));
}

/**
 * Sanitise an email address
 * @param string $value
 * @return string
 */
function sanitiseEmail(string $value): string {
    return filter_var(trim($value), FILTER_SANITIZE_EMAIL);
}

/**
 * Send a JSON response and terminate execution
 *
 * @param bool   $success  Whether the operation succeeded
 * @param string $message  Human-readable message
 * @param int    $code     HTTP status code (default 200)
 */
function sendJsonResponse(bool $success, string $message, int $code = 200): never {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ]);
    exit();
}

/**
 * Append a submission record to a CSV log file (for audit trail)
 * File is stored in php/logs/ — make sure this directory is NOT web-accessible
 * (add an .htaccess with "Deny from all" inside php/logs/)
 *
 * @param string $type  'registration' | 'contact'
 * @param array  $data  Data to log
 */
function logSubmission(string $type, array $data): void {
    $logDir  = __DIR__ . '/logs/';
    $logFile = $logDir . $type . '_log.csv';

    // Create logs directory if it doesn't exist
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
        // Prevent direct web access to logs
        file_put_contents($logDir . '.htaccess', 'Deny from all');
    }

    // Write header row if file is new
    if (!file_exists($logFile)) {
        file_put_contents($logFile, implode(',', array_keys($data)) . "\n");
    }

    // Append the data row (CSV-encoded to handle commas in values)
    $row = implode(',', array_map(
        fn($v) => '"' . str_replace('"', '""', $v) . '"',
        array_values($data)
    ));
    file_put_contents($logFile, $row . "\n", FILE_APPEND | LOCK_EX);
}

/*
 * =============================================================================
 * COMPOSER SETUP INSTRUCTIONS
 * =============================================================================
 *
 * 1. In the /php/ directory (where this file lives), run:
 *      composer require phpmailer/phpmailer
 *
 * 2. This creates:
 *      php/vendor/          (PHPMailer and autoloader)
 *      php/composer.json
 *      php/composer.lock
 *
 * 3. Upload your entire project (except node_modules) to your PHP host.
 *
 * 4. In js/main.js, update the fetch URL from Formspree to:
 *      fetch('https://your-php-host.com/php/send_email.php', { ... })
 *    and add { form_type: 'registration' } or { form_type: 'contact' } to
 *    your formData.
 *
 * =============================================================================
 * RATE LIMITING (Recommended for production)
 * =============================================================================
 * Add this at the top of this file to limit submissions to 5 per IP per hour:
 *
 *   $ip       = $_SERVER['REMOTE_ADDR'];
 *   $cacheKey = sys_get_temp_dir() . '/cba_rate_' . md5($ip);
 *   $count    = (int)(file_exists($cacheKey) ? file_get_contents($cacheKey) : 0);
 *   if ($count >= 5) sendJsonResponse(false, 'Too many requests. Please try again later.', 429);
 *   file_put_contents($cacheKey, $count + 1);
 *   if ($count === 0) { touch($cacheKey); }  // Start 1-hour window via file mtime
 *
 * =============================================================================
 */
