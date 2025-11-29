# Student API Service Documentation

## Overview

This document describes all API endpoints accessible to **Student** users in the Gyanamrit LMS system. Students can browse available courses, enroll in courses, view enrolled courses, and access course content.

## Base URL

```
https://gyanamritlms.onrender.com/v1/api
```

## Authentication

All protected endpoints require JWT authentication:

```
Authorization: Bearer <student_token>
```

---

## Authentication APIs

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "student",
  "contactNumber": "+1234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully. Please verify your email."
}
```

**Fields:**
- `name` (string, required): Student's full name
- `email` (string, required): Valid email address (unique)
- `password` (string, required): Minimum 8 characters, must include uppercase, lowercase, number, and special character
- `confirmPassword` (string, required): Must match password
- `role` (enum, optional): Defaults to `student` if not specified
- `contactNumber` (string, optional): Contact phone number

---

### 2. Sign In
**Endpoint:** `POST /auth/signin`

**Access:** Public

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

---

### 3. Request Verification Token
**Endpoint:** `POST /auth/request-token`

**Access:** Public

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Verification token sent to your email"
}
```

---

### 4. Verify Account
**Endpoint:** `GET /auth/verify/:email/:token`

**Access:** Public

**Example:** `GET /auth/verify/student@example.com/40716f22c5799e46d34eb802f0eff8fd67cda56b5fce6ac4cadbb231998640dc`

**Response:**
```json
{
  "status": "success",
  "message": "Account verified successfully"
}
```

---

### 5. Request Password Reset
**Endpoint:** `POST /auth/forget-password`

**Access:** Public

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset link sent to your email"
}
```

---

### 6. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Access:** Public

**Request Body:**
```json
{
  "email": "student@example.com",
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

---

## Profile Management APIs

### 7. Get Own Profile
**Endpoint:** `GET /user/profile`

**Access:** Authenticated users (all roles)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "student",
    "contactNumber": "+1234567890",
    "country": "USA",
    "bio": "Student bio",
    "isEmailVerified": true,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Fields:**
- `id` (UUID): Student unique identifier
- `name` (string): Student's full name
- `email` (string): Student's email address
- `role` (enum): Always `student`
- `contactNumber` (string, optional): Contact phone number
- `country` (string, optional): Student's country
- `bio` (string, optional): Student biography
- `isEmailVerified` (boolean): Email verification status
- `status` (enum): `pending` | `active` | `suspended`
- `createdAt` (datetime): Account creation date

---

### 8. Update Own Profile
**Endpoint:** `PATCH /user/profile`

**Access:** Authenticated users (all roles)

**Request Body:**
```json
{
  "name": "Updated Student Name",
  "contactNumber": "+9876543210",
  "country": "Canada",
  "bio": "Updated student bio"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Updated Student Name",
    "contactNumber": "+9876543210",
    "country": "Canada",
    "bio": "Updated student bio"
  }
}
```

**Fields:**
- `name` (string, optional): Updated name
- `contactNumber` (string, optional): Updated contact number
- `country` (string, optional): Updated country
- `bio` (string, optional): Updated bio

**Note:** Students cannot update `role`, `status`, or `email` (admin-only or system-managed).

---

### 9. Delete Own Profile
**Endpoint:** `DELETE /user/profile`

**Access:** Authenticated users (all roles)

**Response:**
```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

---

## Course Browsing APIs

### 10. Get Available Courses (Public)
**Endpoint:** `GET /course`

**Access:** Public (no authentication required)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Full Stack Web Development",
      "slug": "full-stack-web-development",
      "description": "Complete web development course",
      "categoryId": "uuid",
      "instructorId": "uuid",
      "thumbnail": "https://example.com/thumb.jpg",
      "level": "intermediate",
      "language": "English",
      "duration": "6 weeks",
      "price": "4999.00",
      "discountPrice": "2999.00",
      "learningOutcomes": ["Build websites", "Understand APIs"],
      "requirements": ["Basic HTML", "JavaScript knowledge"],
      "totalStudents": 150,
      "rating": 4.5,
      "totalRatings": 120,
      "status": "published",
      "isApproved": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "category": {
        "id": "uuid",
        "name": "Web Development"
      },
      "instructor": {
        "id": "uuid",
        "name": "Instructor Name",
        "email": "instructor@example.com"
      }
    }
  ]
}
```

**Important Notes:**
- Returns only courses with `status: "published"` and `isApproved: true`
- Students should filter on frontend to exclude already enrolled courses
- No authentication required, but filtering by enrollment status requires authentication

**Fields:**
- `id` (UUID): Course unique identifier
- `title` (string): Course title
- `slug` (string): URL-friendly course identifier
- `description` (string, optional): Course description
- `categoryId` (UUID, optional): Category reference
- `instructorId` (UUID): Instructor reference
- `thumbnail` (string, optional): Course thumbnail image URL
- `level` (enum): `basic` | `intermediate` | `advanced`
- `language` (string): Course language
- `duration` (string, optional): Course duration
- `price` (decimal): Course price
- `discountPrice` (decimal, optional): Discounted price
- `learningOutcomes` (array, optional): List of learning outcomes
- `requirements` (array, optional): Prerequisites
- `totalStudents` (integer): Number of enrolled students
- `rating` (float): Average rating (0-5)
- `totalRatings` (integer): Number of ratings
- `status` (enum): Always `published` for public endpoint
- `isApproved` (boolean): Always `true` for public endpoint
- `category` (object, optional): Category details
- `instructor` (object, optional): Instructor details

---

## Course Enrollment APIs

### 11. Enroll in Course
**Endpoint:** `POST /enrollment`

**Access:** Student (self-enrollment), Admin, Instructor

**Request Body:**
```json
{
  "userId": "uuid",
  "courseId": "uuid"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Enrollment created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "courseId": "uuid",
    "progress": 0,
    "paymentStatus": "pending",
    "enrolledAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Fields:**
- `userId` (UUID, required): Student's user ID (must match authenticated user for students)
- `courseId` (UUID, required): Course to enroll in

**Important Notes:**
- Students can only enroll themselves (`userId` must match authenticated user ID)
- Default `paymentStatus` is `pending`
- Backend automatically sets `enrolledAt` date
- Enrollment must be approved (payment status changed to `free` or `paid`) before course access is granted

---

### 12. Get Own Enrollments
**Endpoint:** `GET /enrollment/course`

**Access:** Student (own enrollments), Instructor, Admin

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "courseId": "uuid",
      "progress": 45.5,
      "paymentStatus": "paid",
      "enrolledAt": "2025-01-01T00:00:00.000Z",
      "completedAt": null,
      "course": {
        "id": "uuid",
        "title": "Course Title",
        "slug": "course-title",
        "description": "Course description",
        "thumbnail": "https://example.com/thumb.jpg",
        "level": "intermediate",
        "instructor": {
          "id": "uuid",
          "name": "Instructor Name",
          "email": "instructor@example.com"
        }
      }
    }
  ]
}
```

**Fields:**
- `id` (UUID): Enrollment unique identifier
- `userId` (UUID): Student's user ID
- `courseId` (UUID): Course ID
- `progress` (float): Course completion percentage (0-100)
- `paymentStatus` (enum): `pending` | `free` | `paid` | `refund`
- `enrolledAt` (datetime): Enrollment date
- `completedAt` (datetime, optional): Course completion date
- `course` (object): Complete course details

**Note:** Students only see their own enrollments. The backend filters by authenticated user ID.

---

## Course Content APIs

### 13. Get Course Details (Enrolled Courses Only)
**Endpoint:** `GET /course/:courseId`

**Access:** Student (only if enrolled and payment approved)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Course Title",
    "slug": "course-title",
    "description": "Course description",
    "categoryId": "uuid",
    "instructorId": "uuid",
    "thumbnail": "https://example.com/thumb.jpg",
    "level": "intermediate",
    "language": "English",
    "duration": "6 weeks",
    "price": "4999.00",
    "discountPrice": "2999.00",
    "learningOutcomes": ["Outcome 1", "Outcome 2"],
    "requirements": ["Requirement 1"],
    "totalStudents": 150,
    "rating": 4.5,
    "totalRatings": 120,
    "status": "published",
    "isApproved": true,
    "lessons": [
      {
        "id": "uuid",
        "courseId": "uuid",
        "title": "Lesson 1",
        "description": "Lesson description",
        "videoUrl": "https://example.com/video.mp4",
        "fileUrl": "https://example.com/file.pdf",
        "imageUrl": "https://example.com/image.jpg",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "category": {
      "id": "uuid",
      "name": "Web Development"
    },
    "instructor": {
      "id": "uuid",
      "name": "Instructor Name",
      "email": "instructor@example.com"
    }
  }
}
```

**Access Requirements:**
1. Student must be enrolled in the course (`userId` and `courseId` match)
2. Enrollment `paymentStatus` must be `free` or `paid`
3. Course must have `status: "published"` and `isApproved: true`

**Error Responses:**
- `403 Forbidden`: "You are not enrolled in this course"
- `403 Forbidden`: "Your enrollment is pending approval"

---

### 14. Get Lessons by Course (Enrolled Courses Only)
**Endpoint:** `GET /course/:courseId`

**Access:** Student (only if enrolled and payment approved)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "title": "Lesson 1",
      "description": "Lesson description",
      "videoUrl": "https://example.com/video.mp4",
      "fileUrl": "https://example.com/file.pdf",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** Same access requirements as Get Course Details. Lessons are included in the course response or can be fetched separately.

---

### 15. Get Single Lesson (Enrolled Courses Only)
**Endpoint:** `GET /course/:courseId/:lessonId`

**Access:** Student (only if enrolled and payment approved)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Lesson Title",
    "description": "Lesson description",
    "videoUrl": "https://example.com/video.mp4",
    "fileUrl": "https://example.com/file.pdf",
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

**Access Requirements:**
- Same as Get Course Details
- Student must be enrolled
- Payment status must be `free` or `paid`

---

## Category APIs

### 16. Get All Categories
**Endpoint:** `GET /category`

**Access:** Public (no authentication required)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Web Development",
      "slug": "web-development",
      "description": "Web development courses",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Fields:**
- `id` (UUID): Category unique identifier
- `name` (string): Category name
- `slug` (string): URL-friendly identifier
- `description` (string, optional): Category description
- `isActive` (boolean): Active status
- `createdAt` (datetime): Creation timestamp
- `updatedAt` (datetime): Last update timestamp

**Note:** Students can view all categories but cannot create, update, or delete them (admin-only).

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "error": "Course ID is required"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized",
  "error": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Access denied",
  "error": "You are not enrolled in this course"
}
```

**Common 403 Errors:**
- "You are not enrolled in this course"
- "Your enrollment is pending approval"
- "You can only enroll yourself"

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found",
  "error": "Course with ID 'uuid' not found"
}
```

---

## Important Notes for Students

### Enrollment Workflow
1. **Browse Courses**: View available published and approved courses
2. **Enroll**: Click "Enroll Now" → Creates enrollment with `paymentStatus: "pending"`
3. **Wait for Approval**: Admin/Instructor updates `paymentStatus` to `free` or `paid`
4. **Access Course**: Once approved, "View Course" button becomes enabled
5. **View Content**: Access lessons, videos, files, and images

### Payment Status Behavior
- **`pending`**: Enrollment created but not approved. Cannot access course content.
- **`free`**: Enrollment approved, course is free. Can access all content.
- **`paid`**: Enrollment approved, payment received. Can access all content.
- **`refund`**: Enrollment refunded. Cannot access course content.

### View Course Button
- **Enabled**: When `paymentStatus` is `free` or `paid`
- **Disabled**: When `paymentStatus` is `pending` or `refund`
- Shows "Waiting for approval" when disabled

### Course Access Restrictions
- Students can only view courses they are enrolled in
- Enrollment must be approved (`paymentStatus: "free"` or `"paid"`)
- Cannot access courses with `status: "draft"` or `"pending"`
- Cannot access courses with `isApproved: false`

### Self-Enrollment Only
- Students can only enroll themselves
- Cannot enroll other users (admin/instructor privilege)
- `userId` in enrollment request must match authenticated user ID

---

## Summary

Student users have access to:
- ✅ All authentication endpoints
- ✅ Own profile management (read, update, delete)
- ✅ Browse available courses (public endpoint)
- ✅ Self-enrollment in courses
- ✅ View own enrollments
- ✅ Access course content (if enrolled and approved)
- ✅ View course lessons (if enrolled and approved)
- ✅ Category viewing (read-only)

**Restrictions:**
- ❌ Cannot create, update, or delete courses
- ❌ Cannot create, update, or delete lessons
- ❌ Cannot manage enrollments for other users
- ❌ Cannot update payment status
- ❌ Cannot access courses without enrollment
- ❌ Cannot access courses with pending payment
- ❌ Cannot manage categories
- ❌ Cannot manage users

Total API endpoints accessible to Student: **16**

