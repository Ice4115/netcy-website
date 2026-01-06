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
          <div class="header">
            <h1 style="margin: 0;">📧 Nouveau Contact - NETCY</h1>
          </div>
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

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
