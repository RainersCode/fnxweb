import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
// You'll need to add RESEND_API_KEY to your environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { name, email, phone, subject, message, interest } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailSubject = `[RK Fēnikss Kontaktforma] ${subject}`;
    
    // Create HTML email body with responsive design
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #115e59; border-bottom: 2px solid #115e59; padding-bottom: 10px;">Jauna ziņa no kontaktformas</h2>
        
        <div style="margin: 20px 0;">
          <p><strong>Vārds:</strong> ${name}</p>
          <p><strong>E-pasts:</strong> <a href="mailto:${email}" style="color: #115e59;">${email}</a></p>
          ${phone ? `<p><strong>Tālrunis:</strong> ${phone}</p>` : ''}
          <p><strong>Interese:</strong> ${mapInterestToLabel(interest)}</p>
          <p><strong>Tēma:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #115e59;">Ziņojums:</h3>
          <p style="white-space: pre-line;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          <p>Šis e-pasts tika automātiski nosūtīts no RK "Fēnikss" tīmekļa vietnes kontaktformas.</p>
        </div>
      </div>
    `;

    // Send email
    const data = await resend.emails.send({
      from: 'RK Fēnikss Kontaktforma <noreply@fnx-rugby.lv>', // Updated to use verified domain
      to: 'rainerslovkins@gmail.com', // Recipient email address
      subject: emailSubject,
      html: htmlContent,
      reply_to: email,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Helper function to map interest values to human-readable labels
function mapInterestToLabel(interest: string): string {
  const interestMap: Record<string, string> = {
    general: 'Vispārīgs jautājums',
    membership: 'Dalība',
    sponsorship: 'Sponsorēšana',
    volunteer: 'Brīvprātīgais darbs',
  };
  
  return interestMap[interest] || interest;
} 