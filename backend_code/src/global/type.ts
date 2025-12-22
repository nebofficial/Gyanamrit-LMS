import { Request } from "express";
import { PAYMENT_FREE_STATUS, PAYMENT_PAID_STATUS, PAYMENT_PENDING_STATUS, PAYMENT_REFUND_STATUS } from "../constant/paymntStatus";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;

  contactNumber?: string | null;

  role: "student" | "instructor" | "admin";

  // verification
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  otp?: string | null;
  otpExpiresAt?: Date | null;

  status: "pending" | "active" | "suspended";

  // profile
  profileImage?: string | null;
  bio?: string | null;
  address?: string | null;
  country?: string | null;

  // instructor extras
  expertise?: string | null;
  experience?: string | null;
  qualification?: string | null;
  socialLinks?: Record<string, string> | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExtendRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    role: string;
    status: string;
  };
}

export interface ILoginedUserType {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  status: string;
}

export interface ICategoryType {
  name: string;
  description: string;
  slug: string;
  isActive: Boolean;
}

export interface ICourseType {
  id: string; // UUID
  title: string;
  slug: string;
  description?: string | null;

  // CATEGORY + INSTRUCTOR
  categoryId?: string | null;
  instructorId: string;

  // MEDIA
  thumbnail?: string | null;

  // COURSE META
  level:string
  language: string;
  duration?: string | null;

  // PRICING
  price: number;
  discountPrice?: number | null;

  // LISTS
  learningOutcomes?: any[] | null;
  requirements?: any[] | null;

  // STATS
  totalStudents: number;
  rating: number;
  totalRatings: number;

  // SYSTEM FIELDS
  status: "draft" | "published" | "archived";
  isApproved: boolean;

  // TIMESTAMPS
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ILessonType {
  id?: string;               // UUID (optional when creating)
  courseId: string;          // required
  title: string;             // required
  description?: string;      // optional
  videoUrl?: string;         // optional (YouTube, Cloudinary)
  fileUrl?: string;          // optional (PDF, ZIP, etc.)
  imageUrl?: string;         // optional (thumbnail)
  createdAt?: Date;          // auto-generated
  updatedAt?: Date;          // auto-generated
}

export interface IEnrollType {
  id?: string; // optional when creating, Sequelize will generate
  userId: string;
  courseId: string;
  progress?: number; // 0 - 100%, default 0
  paymentStatus?: 
    | typeof PAYMENT_FREE_STATUS
    | typeof PAYMENT_PENDING_STATUS
    | typeof PAYMENT_PAID_STATUS
    | typeof PAYMENT_REFUND_STATUS;
  enrolledAt: Date;
  completedAt?: Date | null; // optional
  createdAt?: Date;
  updatedAt?: Date;
}
