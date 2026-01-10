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

    const typeProjetLabels: { [key: string]: string } = {
      'web': 'Site Web',
      'ecommerce': 'E-Commerce',
      'consultation': 'Consultation',
      'other': 'Autre'
    };

    const budgetLabels: { [key: string]: string } = {
      '1000': 'Moins de 1 000€',
      '5000': '1 000€ - 5 000€',
      '10000': '5 000€ - 10 000€',
      '25000': '10 000€ - 25 000€',
      '50000': 'Plus de 25 000€'
    };

    const delaiLabels: { [key: string]: string } = {
      'urgent': 'Urgent (moins d\'un mois)',
      'soon': 'Rapide (1-3 mois)',
      'flexible': 'Flexible (3+ mois)'
    };

    const typeLabel = typeProjetLabels[typeProjet] || typeProjet;
    const subject = `${typeLabel} - ${nom}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6F3FFF 0%, #7A8FFF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #6F3FFF; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #6F3FFF; padding-bottom: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="section">
              <div class="section-title">📋 INFORMATIONS CLIENT</div>
              <div class="info-row"><span class="label">Nom complet :</span> <span class="value">${nom}</span></div>
              <div class="info-row"><span class="label">Email :</span> <span class="value">${email}</span></div>
              <div class="info-row"><span class="label">Entreprise :</span> <span class="value">${entreprise || 'Non renseignée'}</span></div>
            </div>

            <div class="section">
              <div class="section-title">💼 DÉTAILS DU PROJET</div>
              <div class="info-row"><span class="label">Type de projet :</span> <span class="value">${typeLabel}</span></div>
              <div class="info-row"><span class="label">Budget estimé :</span> <span class="value">${budget ? budgetLabels[budget] : 'Non renseigné'}</span></div>
              <div class="info-row"><span class="label">Délai souhaité :</span> <span class="value">${delai ? delaiLabels[delai] : 'Non renseigné'}</span></div>
            </div>

            <div class="section">
              <div class="section-title">📝 DESCRIPTION DU PROJET</div>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6F3FFF;">
                ${details.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div class="footer">
            Message envoyé depuis netcy.fr
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `NOUVEAU CONTACT - FORMULAIRE NETCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom complet     : ${nom}
Email           : ${email}
Entreprise      : ${entreprise || 'Non renseignée'}

💼 DÉTAILS DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type de projet  : ${typeLabel}
Budget estimé   : ${budget ? budgetLabels[budget] : 'Non renseigné'}
Délai souhaité  : ${delai ? delaiLabels[delai] : 'Non renseigné'}

📝 DESCRIPTION DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${details}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message envoyé depuis netcy.fr`;

    await transporter.sendMail({
      from: `"Formulaire NETCY" <${process.env.EMAIL_USER}>`,
      to: 'contact@netcy.fr',
      subject: subject,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    });

    const confirmationHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; }
          .header { background: linear-gradient(135deg, #6F3FFF 0%, #7A8FFF 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .highlight-box { background: #f8f5ff; border-left: 4px solid #6F3FFF; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { margin: 12px 0; }
          .label { font-weight: bold; color: #6F3FFF; display: block; margin-bottom: 5px; }
          .footer { background: #2a2a2a; color: #999; text-align: center; padding: 30px; font-size: 13px; }
          .footer a { color: #7A8FFF; text-decoration: none; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #6F3FFF 0%, #7A8FFF 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Votre message nous est bien parvenu !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${nom}</strong>,</p>
            
            <div class="highlight-box">
              <p style="margin: 0; font-size: 16px; color: #333;">
                Merci d'avoir contacté <strong>NETCY</strong>. Votre demande a bien été enregistrée et je reviendrai vers vous dans les plus brefs délais, généralement sous <strong>24 heures</strong>.
              </p>
            </div>

            <h3 style="color: #6F3FFF; margin-top: 30px;">📋 Récapitulatif de votre demande</h3>
            <div class="info-box">
              <div class="info-row"><span class="label">Type de projet :</span> ${typeLabel}</div>
              <div class="info-row"><span class="label">Budget estimé :</span> ${budget ? budgetLabels[budget] : 'Non renseigné'}</div>
              <div class="info-row"><span class="label">Délai souhaité :</span> ${delai ? delaiLabels[delai] : 'Non renseigné'}</div>
            </div>

            <h3 style="color: #6F3FFF; margin-top: 30px;">💬 Votre message</h3>
            <div class="info-box">
              <p style="margin: 0; white-space: pre-wrap;">${details}</p>
            </div>

            <p style="margin-top: 30px;">
              En attendant ma réponse, n'hésitez pas à consulter mes services et réalisations sur <a href="https://netcy.fr" style="color: #6F3FFF; font-weight: bold;">netcy.fr</a>.
            </p>

            <p style="margin-top: 25px;">
              À très bientôt,<br>
              <strong>Jung Jean-Marie • CEO & Founder</strong><br>
              <span style="color: #7A8FFF;">NETCY - Network Cybersecurity</span>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #aaa;">
              <strong style="color: #fff;">NETCY</strong> - Création de sites internet & Cybersécurité Réseau
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <div style="margin-bottom: 12px;">
                <img src="https://netcy.fr/images/icons/mail.png" alt="Email" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle; margin-right: 8px;" />
                <a href="mailto:contact@netcy.fr" style="color: #7A8FFF; text-decoration: none; font-size: 14px; vertical-align: middle;">contact@netcy.fr</a>
              </div>
              <div>
                <img src="https://netcy.fr/images/icons/tel.png" alt="Téléphone" style="width: auto; height: 24px; max-width: 24px; object-fit: contain; vertical-align: middle; margin-right: 8px;" />
                <span style="color: #7A8FFF; font-size: 14px; vertical-align: middle;">07 49 64 44 78</span>
              </div>
            </div>
            <p style="margin: 20px 0 5px 0; font-size: 11px; color: #666;">
              145 chemin du pan perdu, 13160 Châteaurenard<br>
              SIREN: 995 301 546 | SIRET: 99530154600025
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const confirmationTextContent = `Bonjour ${nom},

Merci d'avoir contacté NETCY !

Votre demande a bien été enregistrée et je reviendrai vers vous dans les plus brefs délais, généralement sous 24 heures.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RÉCAPITULATIF DE VOTRE DEMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type de projet  : ${typeLabel}
Budget estimé   : ${budget ? budgetLabels[budget] : 'Non renseigné'}
Délai souhaité  : ${delai ? delaiLabels[delai] : 'Non renseigné'}

💬 VOTRE MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${details}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En attendant ma réponse, n'hésitez pas à consulter mes services et réalisations sur netcy.fr.

À très bientôt,

Jung Jean-Marie
NETCY - Network Cybersecurity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NETCY - Création de sites internet & Cybersécurité Réseau

📧 contact@netcy.fr
📱 07 49 64 44 78

145 chemin du pan perdu, 13160 Châteaurenard
SIREN: 995 301 546 | SIRET: 99530154600025`;

    await transporter.sendMail({
      from: `"NETCY" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirmation de votre demande de contact - NETCY',
      text: confirmationTextContent,
      html: confirmationHtmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
