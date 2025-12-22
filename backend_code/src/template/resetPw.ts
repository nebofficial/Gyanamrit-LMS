import { config } from "../config/config";

const resetPasswordMail = (userName: string, resetPasswordLink: string, ) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4f46e5, #3b82f6); padding: 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 15px;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 15px; margin-bottom: 25px;">
            We received a request to reset your password. Please use the code below or click the button to set up a new password. 
            This code is valid for <strong>15 minutes</strong>.
          </p>

          <!-- Reset Code -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordLink}" 
              style="display: inline-block; padding: 14px 28px; background: #f59e0b; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 6px; text-decoration: none;">
              Verify My Account
            </a>
          </div>

         
          <p style="font-size: 15px; margin-top: 25px; color: #6b7280;">
            If you didn’t request a password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
        </div>

        <!-- Security Tips -->
        <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
          <h3 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 12px;">🔒 Security Tips</h3>
          <ul style="font-size: 14px; color: #4b5563; padding-left: 20px; margin: 0;">
            <li>Never share this code or link with anyone — even our support team.</li>
            <li>Choose a strong password with letters, numbers, and symbols.</li>
            <li>Change your password regularly to keep your account safe.</li>
            <li>If you notice suspicious activity, contact our support immediately.</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} ${config.siteName}. All rights reserved.  
          <br />
          <a href="#" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
        </div>
      </div>
    </div>
  `;
};

export default resetPasswordMail;