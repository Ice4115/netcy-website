import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, entreprise, typeProjet, budget, delai, details } = body;

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

    // ─── Email de notification (reçu par l'admin) ────────────────────────
    const subject = isPortfolio ? `Nouveau contact Portfolio – ${nom}` : `Nouveau contact NETCY – ${nom}`;

    // NETCY Admin Template
    const netcyAdminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6F3FFF 0%, #7A8FFF 100%); color: white; padding: 28px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.85; }
          .content { padding: 30px; }
          .section { margin-bottom: 24px; }
          .section-title { color: #6F3FFF; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 2px solid #ede9fe; padding-bottom: 6px; }
          .info-row { display: flex; gap: 8px; margin: 8px 0; font-size: 14px; }
          .label { font-weight: bold; color: #555; min-width: 110px; }
          .value { color: #222; }
          .message-box { background: #f8f5ff; border-left: 4px solid #6F3FFF; padding: 16px 18px; border-radius: 0 6px 6px 0; font-size: 14px; color: #333; white-space: pre-wrap; }
          .footer { background: #1a1a2e; color: #888; text-align: center; padding: 18px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Nouveau message — NETCY</h1>
            <p>Reçu depuis netcy.fr</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">👤 Informations du contact</div>
              <div class="info-row"><span class="label">Nom :</span><span class="value">${nom}</span></div>
              <div class="info-row"><span class="label">Email :</span><span class="value"><a href="mailto:${email}" style="color:#6F3FFF;">${email}</a></span></div>
              <div class="info-row"><span class="label">Entreprise :</span><span class="value">${entreprise || '<em style="color:#999">Non renseignée</em>'}</span></div>
            </div>
            <div class="section">
              <div class="section-title">🚀 Détails du projet</div>
              <div class="info-row"><span class="label">Type :</span><span class="value">${typeProjet || 'Non spécifié'}</span></div>
              <div class="info-row"><span class="label">Budget :</span><span class="value">${budget || 'Non spécifié'} €</span></div>
              <div class="info-row"><span class="label">Délai :</span><span class="value">${delai || 'Non spécifié'}</span></div>
            </div>
            <div class="section">
              <div class="section-title">💬 Message</div>
              <div class="message-box">${(details || '').replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">Message envoyé depuis netcy.fr · Répondre à <a href="mailto:${email}" style="color:#7A8FFF;">${email}</a></div>
        </div>
      </body>
      </html>
    `;

    const netcyAdminTextContent = `NOUVEAU CONTACT — NETCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 INFORMATIONS DU CONTACT
Nom         : ${nom}
Email       : ${email}
Entreprise  : ${entreprise || 'Non renseignée'}

🚀 DÉTAILS DU PROJET
Type        : ${typeProjet || 'Non spécifié'}
Budget      : ${budget || 'Non spécifié'}
Délai       : ${delai || 'Non spécifié'}

💬 MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${details}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reçu depuis netcy.fr`;

    // Portfolio Admin Template
    const portfolioAdminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #e4e4e7; background-color: #1e1e1e; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e1e1e; font-size: 14px; }
          .section { margin-bottom: 24px; }
          .section-title { color: #3b82f6; font-size: 16px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; border-bottom: 1px solid #3b82f6; padding-bottom: 4px; }
          .section-title span.icon { margin-right: 8px; font-size: 18px; }
          .info-row { display: flex; margin: 4px 0; padding: 4px; background-color: #252526; border-radius: 4px; }
          .info-row:nth-child(even) { background-color: #2d2d30; }
          .label { font-weight: bold; color: #a1a1aa; width: 150px; flex-shrink: 0; }
          .value { color: #fff; flex-grow: 1; }
          .value a { color: #60a5fa; text-decoration: none; }
          .value a:hover { text-decoration: underline; }
          .message-box { background: #252526; padding: 12px; border-left: 2px solid #3b82f6; color: #fff; white-space: pre-wrap; margin-top: 4px; border-radius: 0 4px 4px 0; }
          .footer { text-align: center; color: #71717a; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="section">
            <div class="section-title"><span class="icon">📋</span> INFORMATIONS CLIENT</div>
            <div class="info-row"><span class="label">Nom complet :</span><span class="value">${nom}</span></div>
            <div class="info-row"><span class="label">Email :</span><span class="value"><a href="mailto:${email}">${email}</a></span></div>
            <div class="info-row"><span class="label">Entreprise :</span><span class="value">${entreprise || 'N/A'}</span></div>
          </div>
          <div class="section">
            <div class="section-title"><span class="icon">📝</span> DESCRIPTION DU PROJET</div>
            <div class="message-box">${(details || '').replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            Message envoyé depuis netcy.fr/portfolio
          </div>
        </div>
      </body>
      </html>
    `;

    const portfolioAdminTextContent = `
INFORMATIONS CLIENT
Nom complet : ${nom}
Email : ${email}
Entreprise : ${entreprise || 'N/A'}

DESCRIPTION DU PROJET
${details}

Message envoyé depuis netcy.fr/portfolio`;

    await transporter.sendMail({
      from: `"${isPortfolio ? 'Contact Portfolio' : 'Formulaire NETCY'}" <${process.env.EMAIL_USER}>`,
      to: 'contact@netcy.fr',
      subject: subject,
      text: isPortfolio ? portfolioAdminTextContent : netcyAdminTextContent,
      html: isPortfolio ? portfolioAdminHtmlContent : netcyAdminHtmlContent,
      replyTo: email,
    });

    // ─── Email de confirmation (envoyé à l'expéditeur) ───────────────────
    
    // NETCY Confirmation Template
    const netcyConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6F3FFF 0%, #7A8FFF 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; }
          .content { padding: 36px 30px; }
          .highlight-box { background: #f8f5ff; border-left: 4px solid #6F3FFF; padding: 18px 20px; margin: 24px 0; border-radius: 0 6px 6px 0; font-size: 15px; color: #333; }
          .details-summary { background: #f9f9f9; border-radius: 8px; padding: 18px; margin: 12px 0; font-size: 14px; color: #444; }
          .message-box { background: #f9f9f9; border-radius: 8px; padding: 18px; margin: 12px 0; font-size: 14px; color: #444; white-space: pre-wrap; }
          .footer { background: #2a2a2a; color: #999; text-align: center; padding: 28px 20px; font-size: 13px; }
          .footer a { color: #7A8FFF; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Votre message est bien arrivé !</h1>
          </div>
          <div class="content">
            <p style="font-size:15px;">Bonjour <strong>${nom}</strong>,</p>

            <div class="highlight-box">
              Merci d'avoir contacté <strong>NETCY</strong>. Votre message a bien été reçu et je vous répondrai dans les plus brefs délais, généralement sous <strong>24 heures</strong>.
            </div>

            <h3 style="color:#6F3FFF; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin-top:28px;">🚀 Votre projet (${typeProjet || 'Web'})</h3>
            <div class="details-summary">
              <strong>Budget :</strong> ${budget || 'À définir'}<br>
              <strong>Délai :</strong> ${delai || 'À définir'}
            </div>

            <h3 style="color:#6F3FFF; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin-top:28px;">💬 Votre message</h3>
            <div class="message-box">${(details || '').replace(/\n/g, '<br>')}</div>

            <p style="margin-top:28px; font-size:14px;">
              En attendant, n'hésitez pas à consulter mes réalisations sur <a href="https://netcy.fr/portfolio" style="color:#6F3FFF;font-weight:bold;">netcy.fr/portfolio</a>.
            </p>

            <p style="margin-top:24px; font-size:14px;">
              À très bientôt,<br>
              <strong>Jung Jean-Marie</strong><br>
              <span style="color:#7A8FFF;">NETCY — Network Cybersecurity</span>
            </p>
          </div>
          <div class="footer">
            <p style="margin:0 0 14px;font-size:14px;color:#aaa;"><strong style="color:#fff;">NETCY</strong> — Création de sites web &amp; Cybersécurité Réseau</p>
            <div style="margin-bottom:10px;">
              <img src="https://netcy.fr/images/icons/mail.png" alt="Email" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;" />
              <a href="mailto:contact@netcy.fr" style="color:#7A8FFF;font-size:13px;vertical-align:middle;">contact@netcy.fr</a>
            </div>
            <div>
              <img src="https://netcy.fr/images/icons/tel.png" alt="Tél" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;" />
              <span style="color:#7A8FFF;font-size:13px;vertical-align:middle;">07 49 64 44 78</span>
            </div>
            <p style="margin:18px 0 0;font-size:11px;color:#555;">
              145 chemin du pan perdu, 13160 Châteaurenard<br>
              SIREN: 995 301 546 | SIRET: 99530154600025
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const netcyConfirmationText = `Bonjour ${nom},

Merci d'avoir contacté NETCY !

Votre message a bien été reçu. Je vous répondrai dans les plus brefs délais, généralement sous 24 heures.

🚀 VOTRE PROJET : ${typeProjet || 'Web'}
Budget estimé : ${budget || 'À définir'}
Délai souhaité : ${delai || 'À définir'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 VOTRE MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${details}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En attendant, retrouvez mes réalisations sur netcy.fr/portfolio.

À très bientôt,
Jung Jean-Marie
NETCY — Network Cybersecurity

📧 contact@netcy.fr
📱 07 49 64 44 78
145 chemin du pan perdu, 13160 Châteaurenard
SIREN: 995 301 546 | SIRET: 99530154600025`;

    // Portfolio Confirmation Template
    const portfolioConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #121216; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; }
          .header { background: transparent; color: #fff; padding: 40px 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
          .content { padding: 36px 30px; color: #e4e4e7; }
          .highlight-box { background: rgba(59, 130, 246, 0.1); border-left: 2px solid #3b82f6; padding: 18px 20px; margin: 24px 0; font-size: 15px; color: #e4e4e7; }
          .message-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 18px; margin: 12px 0; font-size: 14px; color: #a1a1aa; white-space: pre-wrap; font-style: italic; }
          .footer { background: #0A0A0A; color: #71717a; text-align: center; padding: 28px 20px; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
          .footer a { color: #a1a1aa; text-decoration: none; transition: color 0.2s; }
          .footer a:hover { color: #fff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message bien reçu</h1>
          </div>
          <div class="content">
            <p style="font-size:15px; color:#fff;">Bonjour <strong>${nom}</strong>,</p>

            <div class="highlight-box">
              Je vous remercie pour l'intérêt que vous portez à mon profil. J'ai bien reçu votre message via mon portfolio et je vous répondrai très prochainement.
            </div>

            <h3 style="color:#a1a1aa; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-top:32px; font-weight: 600;">Votre message</h3>
            <div class="message-box">${(details || '').replace(/\n/g, '<br>')}</div>

            <p style="margin-top:32px; font-size:14px; color:#e4e4e7;">
              Cordialement,<br>
              <br>
              <strong style="color:#fff; font-size: 16px;">Jean-Marie Jung</strong><br>
              <span style="color:#a1a1aa;">Étudiant BTS SIO option SISR</span><br>
              <a href="https://netcy.fr/portfolio" style="color:#3b82f6; text-decoration: none; font-size: 13px; margin-top: 4px; display: inline-block;">Visualiser mon portfolio</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin:0 0 12px;">Vous recevez cet email suite à votre demande de contact depuis netcy.fr/portfolio</p>
            <div style="display: flex; justify-content: center; gap: 16px;">
              <a href="https://linkedin.com/in/jean-marie-jung-40683b218">LinkedIn</a>
              <span>·</span>
              <a href="https://github.com/jean-marie-jung">GitHub</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const portfolioConfirmationText = `Bonjour ${nom},

Je vous remercie pour l'intérêt que vous portez à mon profil. 
J'ai bien reçu votre message via mon portfolio et je vous répondrai très prochainement.

--- Votre message ---
${details}
---------------------

Cordialement,

Jean-Marie Jung
Étudiant BTS SIO option SISR

Portfolio: https://netcy.fr/portfolio
LinkedIn: https://linkedin.com/in/jean-marie-jung-40683b218
GitHub: https://github.com/jean-marie-jung`;

    await transporter.sendMail({
      from: `"${isPortfolio ? 'Jean-Marie Jung' : 'NETCY'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: isPortfolio ? 'Confirmation de réception - Jean-Marie Jung' : 'Votre message a bien été reçu — NETCY',
      text: isPortfolio ? portfolioConfirmationText : netcyConfirmationText,
      html: isPortfolio ? portfolioConfirmationHtml : netcyConfirmationHtml,
    });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
