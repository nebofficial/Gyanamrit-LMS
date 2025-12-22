// Account Verification Email
 const accountVerificationMail = (userName: string, verificationLink: string) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Verify Your Account</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 15px;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 15px; margin-bottom: 25px;">
            Thank you for registering with us! To complete your account setup, please verify your email address by clicking the button below. 
            This link will expire in <strong>24 hours</strong>.
          </p>

          <!-- Verification Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
              style="display: inline-block; padding: 14px 28px; background: #f59e0b; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 6px; text-decoration: none;">
              Verify My Account
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            If you did not sign up for this account, you can ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} Gyanamrit. All rights reserved.  
          <br />
          <a href="#" style="color: #f59e0b; text-decoration: none;">Contact Support</a>
        </div>
      </div>
    </div>
  `;
};

const welcomeMail = (userName: string) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c2d12, #b45309); padding: 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Gyanamrit LMS 🕉️</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 15px;">Namaste <strong>${userName}</strong>,</p>

          <p style="font-size: 15px; margin-bottom: 20px;">
            We warmly welcome you to <strong>Gyanamrit Learning Management System</strong> — a dedicated platform created 
            to help learners explore the rich and timeless wisdom of <strong>Sanskrit (संस्कृतम्)</strong>.
          </p>

          <p style="font-size: 15px; margin-bottom: 20px;">
            Sanskrit is not just a language — it is the root of knowledge, philosophy, science, and spirituality. 
            By learning Sanskrit, you are rediscovering the foundation of ancient literature, Vedas, grammar, and culture.
          </p>

          <p style="font-size: 15px; margin-bottom: 25px;">
            Your learning journey begins now. Explore structured lessons, practice exercises, guides, and much more inside your dashboard.
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://gyanamritlms.com/login" 
              style="display: inline-block; padding: 14px 28px; background: #b45309; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 6px; text-decoration: none;">
              Start Learning Sanskrit
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            If you have questions or need guidance, we are always here to support your learning journey.
            <br/>
            <strong>“संस्कृतम् जगतः मातृभाषा।”</strong> — Sanskrit is the mother of all languages.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} Gyanamrit LMS. All rights reserved.  
          <br />
          <a href="https://gyanamritlms.com/support" style="color: #b45309; text-decoration: none;">Contact Support</a>
        </div>
      </div>
    </div>
  `;
};



const welcomeMail1 = (name:string, email:string, password:string, role:"admin" | "student" | "instructor") => {

  const roleText = role === "student" ? "Student" : "Instructor";
  const roleMessage =
    role === "student"
      ? "Start your Sanskrit learning journey now!"
      : "You can now create and manage courses, track student progress, and share your knowledge.";
  const ctaText =
    role === "student" ? "Go to Dashboard" : "Go to Instructor Dashboard";

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c2d12, #b45309); padding: 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Gyanamrit LMS 🕉️</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 15px;">Namaste <strong>${name}</strong>,</p>

          <p style="font-size: 15px; margin-bottom: 20px;">
            You have successfully registered as a <strong>${roleText}</strong> in <strong>Gyanamrit LMS</strong>.
          </p>

          <p style="font-size: 15px; margin-bottom: 20px;">
            Your login credentials are:<br/>
            Email: <strong>${email}</strong><br/>
            Password: <strong>${password}</strong><br/>
            Role: <strong>${role}</strong>
          </p>

          <p style="font-size: 15px; margin-bottom: 20px;">
            ${roleMessage}
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://gyanamritlms.com/login" 
              style="display: inline-block; padding: 14px 28px; background: #b45309; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 6px; text-decoration: none;">
              ${ctaText}
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            If you have questions or need guidance, we are always here to support your journey.
            <br/>
            <strong>“संस्कृतम् जगतः मातृभाषा।”</strong> — Sanskrit is the mother of all languages.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} Gyanamrit LMS. All rights reserved.  
          <br />
          <a href="https://gyanamritlms.com/support" style="color: #b45309; text-decoration: none;">Contact Support</a>
        </div>

      </div>
    </div>
  `;
};



export {welcomeMail, welcomeMail1, accountVerificationMail}