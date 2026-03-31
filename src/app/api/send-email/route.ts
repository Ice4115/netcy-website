import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Properly escape HTML to prevent XSS in email content
function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function escapeHtmlMultiline(str: unknown): string {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, entreprise, typeProjet, budget, delai, details } = body;

    // Input validation
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Nom requis' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Email invalide' }, { status: 400 });
    }
    if (!details || typeof details !== 'string' || details.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Message requis' }, { status: 400 });
    }
    if (nom.length > 100 || email.length > 200 || (details && details.length > 5000)) {
      return NextResponse.json({ success: false, message: 'Données trop longues' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const isPortfolio = typeProjet === 'Contact depuis Portfolio';

    // Escaped values for safe HTML insertion
    const sNom = escapeHtml(nom);
    const sEmail = escapeHtml(email);
    const sEntreprise = escapeHtml(entreprise);
    const sTypeProjet = escapeHtml(typeProjet);
    const sBudget = escapeHtml(budget);
    const sDelai = escapeHtml(delai);
    const sDetails = escapeHtmlMultiline(details);

    const subject = isPortfolio
      ? `Nouveau contact Portfolio — ${nom}`
      : `Nouveau contact NETCY — ${nom}`;

    // ─── NETCY Admin Template ─────────────────────────────────────────────────
    const netcyAdminHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau contact NETCY</title>
</head>
<body style="margin:0;padding:0;background:#0f0f10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f10;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#17181a;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 32px;background:linear-gradient(135deg,#0052FF 0%,#003EC7 100%);text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.12);border-radius:8px;padding:8px 16px;">
                      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:2px;">NETCY</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:-0.3px;">Nouveau message reçu</p>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">Depuis netcy.fr</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Contact Info -->
              <p style="margin:0 0 12px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Contact</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1e2023;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="color:rgba(255,255,255,0.45);font-size:12px;display:block;margin-bottom:2px;">Nom</span>
                    <span style="color:#ffffff;font-size:15px;font-weight:500;">${sNom}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="color:rgba(255,255,255,0.45);font-size:12px;display:block;margin-bottom:2px;">Email</span>
                    <a href="mailto:${sEmail}" style="color:#4d8aff;font-size:15px;font-weight:500;text-decoration:none;">${sEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="color:rgba(255,255,255,0.45);font-size:12px;display:block;margin-bottom:2px;">Entreprise</span>
                    <span style="color:${sEntreprise ? '#ffffff' : 'rgba(255,255,255,0.3)'};font-size:15px;">${sEntreprise || 'Non renseignée'}</span>
                  </td>
                </tr>
              </table>

              <!-- Project Details -->
              <p style="margin:0 0 12px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Projet</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="33%" style="padding-right:8px;">
                    <div style="background:#1e2023;border-radius:8px;padding:14px 16px;">
                      <span style="color:rgba(255,255,255,0.4);font-size:11px;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Type</span>
                      <span style="color:#ffffff;font-size:13px;font-weight:500;">${sTypeProjet || 'Non spécifié'}</span>
                    </div>
                  </td>
                  <td width="33%" style="padding-right:8px;padding-left:4px;">
                    <div style="background:#1e2023;border-radius:8px;padding:14px 16px;">
                      <span style="color:rgba(255,255,255,0.4);font-size:11px;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Budget</span>
                      <span style="color:#ffffff;font-size:13px;font-weight:500;">${sBudget || 'N/A'}</span>
                    </div>
                  </td>
                  <td width="33%" style="padding-left:8px;">
                    <div style="background:#1e2023;border-radius:8px;padding:14px 16px;">
                      <span style="color:rgba(255,255,255,0.4);font-size:11px;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Délai</span>
                      <span style="color:#ffffff;font-size:13px;font-weight:500;">${sDelai || 'N/A'}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 12px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Message</p>
              <div style="background:#1e2023;border-left:3px solid #0052FF;border-radius:0 8px 8px 0;padding:18px 20px;font-size:14px;color:#c8ccd0;line-height:1.7;white-space:pre-wrap;">
                ${sDetails}
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">
                Reçu depuis netcy.fr &nbsp;·&nbsp; Répondre à <a href="mailto:${sEmail}" style="color:#4d8aff;text-decoration:none;">${sEmail}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const netcyAdminText = `NOUVEAU CONTACT — NETCY
${'─'.repeat(40)}

CONTACT
Nom        : ${nom}
Email      : ${email}
Entreprise : ${entreprise || 'Non renseignée'}

PROJET
Type       : ${typeProjet || 'Non spécifié'}
Budget     : ${budget || 'N/A'}
Délai      : ${delai || 'N/A'}

MESSAGE
${'─'.repeat(40)}
${details}
${'─'.repeat(40)}

Reçu depuis netcy.fr`;

    // ─── Portfolio Admin Template ──────────────────────────────────────────────
    const portfolioAdminHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau contact Portfolio</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111113;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Portfolio</p>
                    <p style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">Nouveau message</p>
                  </td>
                  <td align="right" valign="middle">
                    <div style="background:rgba(255,255,255,0.06);border-radius:6px;padding:6px 14px;display:inline-block;">
                      <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:2px;">NETCY</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1b1e;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <span style="color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:3px;">Nom</span>
                    <span style="color:#ffffff;font-size:14px;">${sNom}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <span style="color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:3px;">Email</span>
                    <a href="mailto:${sEmail}" style="color:#4d8aff;font-size:14px;text-decoration:none;">${sEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:3px;">Entreprise</span>
                    <span style="color:${sEntreprise ? '#ffffff' : 'rgba(255,255,255,0.25)'};font-size:14px;">${sEntreprise || 'N/A'}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;color:rgba(255,255,255,0.35);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Message</p>
              <div style="background:#1a1b1e;border-left:2px solid rgba(255,255,255,0.15);border-radius:0 6px 6px 0;padding:16px 18px;font-size:14px;color:#9ca3af;line-height:1.7;white-space:pre-wrap;">
                ${sDetails}
              </div>

            </td>
          </tr>

          <tr>
            <td style="padding:18px 40px 24px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;">netcy.fr/portfolio</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const portfolioAdminText = `NOUVEAU CONTACT — PORTFOLIO
${'─'.repeat(40)}

Nom        : ${nom}
Email      : ${email}
Entreprise : ${entreprise || 'N/A'}

MESSAGE
${'─'.repeat(40)}
${details}
${'─'.repeat(40)}

Reçu depuis netcy.fr/portfolio`;

    await transporter.sendMail({
      from: `"${isPortfolio ? 'Contact Portfolio' : 'Formulaire NETCY'}" <${process.env.EMAIL_USER}>`,
      to: 'contact@netcy.fr',
      subject,
      text: isPortfolio ? portfolioAdminText : netcyAdminText,
      html: isPortfolio ? portfolioAdminHtml : netcyAdminHtml,
      replyTo: email,
    });

    // ─── NETCY Confirmation Template ──────────────────────────────────────────
    const netcyConfirmationHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre message a bien été reçu — NETCY</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ebee;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0052FF 0%,#003EC7 100%);padding:40px 40px 36px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:6px 18px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:3px;">NETCY</span>
              </div>
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">Message bien reçu !</p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Nous vous répondrons très rapidement.</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <p style="margin:0 0 24px;color:#1a1c1e;font-size:16px;">
                Bonjour <strong>${sNom}</strong>,
              </p>

              <!-- Confirmation box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5ff;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:4px 0 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#0052FF;height:3px;border-radius:8px 8px 0 0;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;color:#1a2a4a;font-size:14px;line-height:1.7;">
                      Merci d'avoir contacté <strong>NETCY</strong>. Votre demande a bien été enregistrée et je vous répondrai dans les plus brefs délais, généralement sous <strong>24 heures</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Project summary -->
              <p style="margin:0 0 12px;color:rgba(0,0,0,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Votre projet — ${sTypeProjet || 'Web'}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #eef0f2;">
                    <span style="color:#6b7280;font-size:12px;display:block;margin-bottom:2px;">Budget estimé</span>
                    <span style="color:#1a1c1e;font-size:14px;font-weight:500;">${sBudget || 'À définir'}</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #eef0f2;border-left:1px solid #eef0f2;">
                    <span style="color:#6b7280;font-size:12px;display:block;margin-bottom:2px;">Délai souhaité</span>
                    <span style="color:#1a1c1e;font-size:14px;font-weight:500;">${sDelai || 'À définir'}</span>
                  </td>
                </tr>
              </table>

              <!-- Message recap -->
              <p style="margin:0 0 12px;color:rgba(0,0,0,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Votre message</p>
              <div style="background:#f8f9fa;border-radius:8px;padding:18px 20px;font-size:14px;color:#4b5563;line-height:1.7;white-space:pre-wrap;margin-bottom:32px;">
                ${sDetails}
              </div>

              <p style="margin:0 0 6px;color:#1a1c1e;font-size:14px;line-height:1.7;">
                En attendant, n'hésitez pas à consulter mes réalisations sur
                <a href="https://netcy.fr/portfolio" style="color:#0052FF;font-weight:600;text-decoration:none;">netcy.fr/portfolio</a>.
              </p>

              <p style="margin:28px 0 0;color:#1a1c1e;font-size:14px;line-height:1.8;">
                À très bientôt,<br>
                <strong style="font-size:15px;">Jung Jean-Marie</strong><br>
                <span style="color:#0052FF;font-size:13px;">NETCY — Network Cybersecurity</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1c1e;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 10px;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:1px;">NETCY</p>
              <p style="margin:0 0 14px;color:rgba(255,255,255,0.4);font-size:12px;">Création de sites web &amp; Cybersécurité Réseau</p>
              <p style="margin:0 0 4px;">
                <a href="mailto:contact@netcy.fr" style="color:#4d8aff;font-size:12px;text-decoration:none;">contact@netcy.fr</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">·</span>
                <span style="color:rgba(255,255,255,0.5);font-size:12px;">07 49 64 44 78</span>
              </p>
              <p style="margin:14px 0 0;color:rgba(255,255,255,0.2);font-size:11px;">
                145 chemin du pan perdu, 13160 Châteaurenard<br>
                SIREN: 995 301 546 &nbsp;|&nbsp; SIRET: 99530154600025
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const netcyConfirmationText = `Bonjour ${nom},

Merci d'avoir contacté NETCY !

Votre message a bien été reçu. Je vous répondrai dans les plus brefs délais, généralement sous 24 heures.

VOTRE PROJET : ${typeProjet || 'Web'}
Budget estimé  : ${budget || 'À définir'}
Délai souhaité : ${delai || 'À définir'}

${'─'.repeat(40)}
VOTRE MESSAGE
${'─'.repeat(40)}
${details}
${'─'.repeat(40)}

Retrouvez mes réalisations sur netcy.fr/portfolio.

À très bientôt,
Jung Jean-Marie
NETCY — Network Cybersecurity

contact@netcy.fr
07 49 64 44 78
145 chemin du pan perdu, 13160 Châteaurenard
SIREN: 995 301 546 | SIRET: 99530154600025`;

    // ─── Portfolio Confirmation Template ──────────────────────────────────────
    const portfolioConfirmationHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message bien reçu</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111113;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);">
              <div style="display:inline-block;background:rgba(255,255,255,0.06);border-radius:6px;padding:6px 16px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:3px;">NETCY</span>
              </div>
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">Message bien reçu</p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">Portfolio · netcy.fr</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:36px 40px 32px;">

              <p style="margin:0 0 24px;color:#e4e4e7;font-size:15px;">
                Bonjour <strong style="color:#ffffff;">${sNom}</strong>,
              </p>

              <!-- Info box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.7;">
                      Je vous remercie pour l'intérêt que vous portez à mon profil. Votre message a bien été reçu et je vous répondrai très prochainement.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message recap -->
              <p style="margin:0 0 12px;color:rgba(255,255,255,0.3);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Votre message</p>
              <div style="background:#1a1b1e;border-radius:8px;padding:18px 20px;font-size:14px;color:#6b7280;line-height:1.7;white-space:pre-wrap;font-style:italic;margin-bottom:32px;">
                ${sDetails}
              </div>

              <p style="margin:0;color:#e4e4e7;font-size:14px;line-height:1.9;">
                Cordialement,<br>
                <strong style="color:#ffffff;font-size:16px;">Jean-Marie Jung</strong><br>
                <span style="color:rgba(255,255,255,0.4);font-size:12px;">Étudiant BTS SIO option SISR</span>
              </p>

              <p style="margin:16px 0 0;">
                <a href="https://netcy.fr/portfolio" style="color:#4d8aff;font-size:13px;text-decoration:none;">Voir mon portfolio →</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 10px;color:rgba(255,255,255,0.15);font-size:12px;">
                Vous recevez cet email suite à votre demande de contact depuis netcy.fr/portfolio
              </p>
              <p style="margin:0;">
                <a href="https://linkedin.com/in/jean-marie-jung-40683b218" style="color:rgba(255,255,255,0.3);font-size:12px;text-decoration:none;">LinkedIn</a>
                <span style="color:rgba(255,255,255,0.1);margin:0 8px;">·</span>
                <a href="https://github.com/jean-marie-jung" style="color:rgba(255,255,255,0.3);font-size:12px;text-decoration:none;">GitHub</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const portfolioConfirmationText = `Bonjour ${nom},

Je vous remercie pour l'intérêt que vous portez à mon profil.
Votre message a bien été reçu et je vous répondrai très prochainement.

${'─'.repeat(40)}
VOTRE MESSAGE
${'─'.repeat(40)}
${details}
${'─'.repeat(40)}

Cordialement,

Jean-Marie Jung
Étudiant BTS SIO option SISR

Portfolio : https://netcy.fr/portfolio
LinkedIn  : https://linkedin.com/in/jean-marie-jung-40683b218
GitHub    : https://github.com/jean-marie-jung`;

    await transporter.sendMail({
      from: `"${isPortfolio ? 'Jean-Marie Jung' : 'NETCY'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: isPortfolio
        ? 'Confirmation de réception — Jean-Marie Jung'
        : 'Votre message a bien été reçu — NETCY',
      text: isPortfolio ? portfolioConfirmationText : netcyConfirmationText,
      html: isPortfolio ? portfolioConfirmationHtml : netcyConfirmationHtml,
    });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
