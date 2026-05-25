// Registering companies
// login
// logout
// forgot password
// reset password

// import { Role } from "../../../generated/prisma/enums.js";
import { prismaClient } from "../../config/db.js";
import { comparePassword, hashpassword } from "../../shared/utils/hash.js";
import { generateAccessToken, verifyToken } from "../../shared/utils/jwt.js";

import {
  ConflictError,
  MatchError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import crypto from "crypto";
import { sendEmail } from "../../shared/utils/sendEmail.js";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.validation.js";
import { Role } from "@prisma/client";
export class AuthService {
  static async registerService(payload: RegisterInput) {
    // destructuring the payload
    const {
      companyEmail,
      companyName,
      adminEmail,
      adminName,
      password,
      companyAddress,
      companyPhone,
    } = payload;
    // We take out every whitespace from input

    const normalizedCompanyEmail = companyEmail.toLocaleLowerCase().trim();
    const normalizedAdminEmail = adminEmail.toLocaleLowerCase().trim();
    // check if company already exists in database
    const existingCompany = await prismaClient.company.findUnique({
      where: { email: normalizedCompanyEmail },
    });
    // Throw an error if company exists 
    // You shouldn't have two companies with the same email

    if (existingCompany) {
      throw new ConflictError("Company Already Exists");
    }
    // Check if user exists cos two people should not have the same email

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: normalizedAdminEmail,
      },
    });

    if (existingUser) {
      throw new ConflictError("User Already Exists");
    }
    // Next , we hash the password
    const hashedPassword = await hashpassword(password);
    // Next , we start a transaction
    const result = await prismaClient.$transaction(async (tx) => {
      // We create the company record . We require the email , name , phone(optional ) , address ( optional)
      const company = await tx.company.create({
        data: {
          email: normalizedCompanyEmail,
          name: companyName,
          phone: companyPhone || "",
          address: companyAddress || "",
        },
      });
      // This is where we create a user record

      const user = await tx.user.create({
        data: {
          name: adminName,
          email: normalizedAdminEmail,
          password: hashedPassword,
          role: Role.HR_ADMIN,
          companyId: company.id,
        },
      });
      return {
        company,
        user,
      };
    });
    // This token will be required to be sent as an auth token
    // The three fields are what we require for basic authentication 

    const token = generateAccessToken({
      userId: result.user.id,
      role: result.user.role,
      companyId: result.company.id,
    });

    // At this point , an email will be sent to them

    try {
      await sendEmail({
        to: companyEmail,
        subject: "Company Onboarding",
        html: `
      <h2>Welcome to 360Degrees HR</h2>
      <p>Your company onboarding was successful.</p>
    `,
      });
    } catch (error) {
      console.error("Onboarding email failed:", error);
    }
    // The frontend receives this and uses it the way it needs to 
    
    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
      },
    };
  }

  static async loginService(payload: LoginInput) {
    const { userEmail, password } = payload;
    // check if user exists from email

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!existingUser) {
      throw new ConflictError("You are unauthorized to perform this action ");
    }

    /**
     * Check active account
     */
    if (!existingUser.isActive) {
      throw new UnauthorizedError("Account is inactive");
    }
    
    const isPasswordMatch = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new MatchError("Password Mismatch");
    }
    const token = generateAccessToken({
      userId: existingUser.id,
      companyId: existingUser.companyId,
      role: existingUser.role,
    });

    return {
      token,
      user: {
        userId: existingUser?.id,
        role: existingUser?.role,
        companyId: existingUser.companyId,
      },
    };
  }

  static async authMeService(authToken: string) {
    let data = verifyToken(authToken);

    const user = await prismaClient.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedError();
    }
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };
  }

  static async forgotPasswordService(payload: ForgotPasswordInput) {
    // check if user exists
    const user = await prismaClient.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    //
    if (!user) {
      return {
        success: true,
        message: "If this email exists , a link will be sent to it",
      };
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // update user table . Set the expiry and expiry date
    await prismaClient.user.update({
      where: {
        id: user?.id,
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-token?token=${resetToken}`;
    // next we send the email .
    await sendEmail({
      // to: user.email,
      to : "omnidev.build@gmail.com",
      subject: "Reset Your Password",
      html: `
    <h2>Password Reset</h2>

    <p>You requested a password reset.</p>

    <p>
      Click the link below to reset your password:
    </p>

    <a href="${resetLink}">
      Reset Password
    </a>

    <p>
      This link expires in 15 minutes.
    </p>
  `,
    });
    return {
      success: true,
      message: "If this email exists , a link will be sent to it",
    };
  }

  static async resetPasswordService(payload: ResetPasswordInput) {
    let hashedToken = crypto
      .createHash("sha256")
      .update(payload.token)
      .digest("hex");

    // first we get the email from the payload and then check if it exists
    const user = await prismaClient.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or Expired Token",
      };
    }

    const hashedPassword = await hashpassword(payload.password);

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `
    <h2>Password Reset</h2>

    <p>You password has been reset successfully.</p> 
  `,
    });
    return {
      success: true,
      message: "Password Reset Successfully",
    };

    // next we compare the hash of the token sent with the one in the user's database

    // Next we compare the two tokens . The one in database and the one that has been hashed
  }
}
