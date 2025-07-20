const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email transporter configuration
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // Use Ethereal Email for development testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to DnD Dice Roller SaaS! 🎲',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🎲 Welcome to DnD Dice Roller!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hi ${data.firstName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Thank you for joining DnD Dice Roller SaaS! You're now ready to roll dice like never before.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Your API Key:</h3>
            <code style="background: #f1f3f4; padding: 10px; border-radius: 4px; font-family: monospace; display: block; word-break: break-all;">
              ${data.apiKey}
            </code>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              Keep this secure! You'll need it to access our API.
            </p>
          </div>
          
          <h3 style="color: #333;">What's next?</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li>Explore our <a href="${process.env.CLIENT_URL}/dashboard">Dashboard</a></li>
            <li>Check out the <a href="${process.env.CLIENT_URL}/docs">API Documentation</a></li>
            <li>Roll your first dice with our API!</li>
            <li>Upgrade to Pro for unlimited rolls</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started →
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            Questions? Reply to this email or visit our <a href="${process.env.CLIENT_URL}/support">support center</a>.
            <br>
            Happy rolling! 🎯
          </p>
        </div>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Password - DnD Dice Roller',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🔒 Password Reset Request</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hi ${data.firstName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            For security, this link can only be used once and will expire in 1 hour.
          </p>
        </div>
      </div>
    `
  }),

  'subscription-created': (data) => ({
    subject: `Welcome to ${data.plan} - Your subscription is active! 🚀`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🚀 Subscription Activated!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hi ${data.firstName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Your ${data.plan} subscription is now active! You now have access to:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Your ${data.plan} Benefits:</h3>
            <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
              ${data.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/dashboard" style="background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Dashboard →
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            Questions about your subscription? Contact our support team anytime.
          </p>
        </div>
      </div>
    `
  }),

  'api-limit-warning': (data) => ({
    subject: '⚠️ API Limit Warning - DnD Dice Roller',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">⚠️ API Limit Warning</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hi ${data.firstName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            You've used ${data.usage}% of your monthly API quota (${data.currentUsage}/${data.limit} requests).
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffa726;">
            <p style="margin: 0; color: #666;">
              Consider upgrading to avoid service interruption when you reach 100%.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/billing" style="background: #ffa726; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Upgrade Plan →
            </a>
          </div>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, template, data, subject, html }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else if (subject && html) {
      emailContent = { subject, html };
    } else {
      throw new Error('Either template or subject+html must be provided');
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'DnD Dice Roller <noreply@dnddiceroller.site>',
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      to,
      subject: emailContent.subject,
      messageId: result.messageId
    });

    return result;
  } catch (error) {
    logger.error('Email sending failed', {
      to,
      template,
      error: error.message
    });
    throw error;
  }
};

// Bulk email function
const sendBulkEmail = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ success: true, email: email.to, messageId: result.messageId });
    } catch (error) {
      results.push({ success: false, email: email.to, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
};