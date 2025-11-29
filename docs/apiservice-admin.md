# Admin API Service Documentation

## Overview

This document describes all API endpoints accessible to **Admin** users in the Gyanamrit LMS system. Admin users have full system access and can manage users, courses, enrollments, and categories.

## Base URL

```
https://gyanamritlms.onrender.com/v1/api
```

## Authentication

All endpoints require JWT authentication:

```
Authorization: Bearer <admin_token>
```

---

## Authentication APIs

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "admin",
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
- `name` (string, required): User's full name
- `email` (string, required): Valid email address (unique)
- `password` (string, required): Minimum 8 characters, must include uppercase, lowercase, number, and special character
- `confirmPassword` (string, required): Must match password
- `role` (enum, optional): `student` | `instructor` | `admin` (default: `student`)
- `contactNumber` (string, optional): Contact phone number

---

### 2. Sign In
**Endpoint:** `POST /auth/signin`

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@example.com",
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

**Fields:**
- `email` (string, required): User's email
- `password` (string, required): User's password

---

### 3. Request Verification Token
**Endpoint:** `POST /auth/request-token`

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@example.com"
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

**Example:** `GET /auth/verify/admin@example.com/40716f22c5799e46d34eb802f0eff8fd67cda56b5fce6ac4cadbb231998640dc`

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
  "email": "admin@example.com"
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
  "email": "admin@example.com",
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

## User Management APIs

### 7. Get All Users
**Endpoint:** `GET /user`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "contactNumber": "+1234567890",
      "country": "USA",
      "bio": "Student bio",
      "expertise": null,
      "experience": null,
      "qualification": null,
      "isEmailVerified": true,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Fields:**
- `id` (UUID): User unique identifier
- `name` (string): User's full name
- `email` (string): User's email address
- `role` (enum): `student` | `instructor` | `admin`
- `contactNumber` (string, optional): Contact phone number
- `country` (string, optional): User's country
- `bio` (string, optional): User biography
- `expertise` (string, optional): Instructor expertise
- `experience` (string, optional): Instructor experience
- `qualification` (string, optional): Instructor qualifications
- `isEmailVerified` (boolean): Email verification status
- `status` (enum): `pending` | `active` | `suspended`
- `createdAt` (datetime): Account creation date

---

### 8. Get User by ID
**Endpoint:** `GET /user/:userId`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
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

---

### 9. Add User
**Endpoint:** `POST /user`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "contactNumber": "+1234567890",
  "role": "student"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User created successfully. Welcome email sent.",
  "data": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student",
    "status": "active",
    "isEmailVerified": false
  }
}
```

**Fields:**
- `name` (string, required): User's full name
- `email` (string, required): Valid email address (unique)
- `contactNumber` (string, optional): Contact phone number
- `role` (enum, required): `student` | `instructor` | `admin`

**Note:** Backend automatically sends welcome email and sets default status to `active`.

---

### 10. Update User Status
**Endpoint:** `PUT /user/:userId`

**Access:** Admin only

**Request Body:**
```json
{
  "status": "suspended",
  "role": "instructor"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "instructor",
    "status": "suspended"
  }
}
```

**Fields:**
- `status` (enum, optional): `pending` | `active` | `suspended`
- `role` (enum, optional): `student` | `instructor` | `admin`

---

### 11. Delete User
**Endpoint:** `DELETE /user/:userId`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

**Note:** Soft delete (paranoid delete) - user record is marked as deleted but not permanently removed.

---

### 12. Get Own Profile
**Endpoint:** `GET /user/profile`

**Access:** Authenticated users (all roles)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "contactNumber": "+1234567890",
    "country": "USA",
    "bio": "Admin bio",
    "isEmailVerified": true,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 13. Update Own Profile
**Endpoint:** `PATCH /user/profile`

**Access:** Authenticated users (all roles)

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "contactNumber": "+9876543210",
  "country": "Canada",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Updated Admin Name",
    "email": "admin@example.com",
    "contactNumber": "+9876543210",
    "country": "Canada",
    "bio": "Updated bio"
  }
}
```

**Fields:**
- `name` (string, optional): Updated name
- `contactNumber` (string, optional): Updated contact number
- `country` (string, optional): Updated country
- `bio` (string, optional): Updated bio
- `expertise` (string, optional): Instructor expertise
- `experience` (string, optional): Instructor experience
- `qualification` (string, optional): Instructor qualifications

---

### 14. Delete Own Profile
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

## Course Management APIs

### 15. Get All Courses (Admin)
**Endpoint:** `GET /course/for-admin`

**Access:** Admin only

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

**Fields:**
- `id` (UUID): Course unique identifier
- `title` (string): Course title
- `slug` (string): URL-friendly course identifier
- `description` (string, optional): Course description
- `categoryId` (UUID, optional): Category reference
- `instructorId` (UUID, required): Instructor reference
- `thumbnail` (string, optional): Course thumbnail image URL
- `level` (enum): `basic` | `intermediate` | `advanced`
- `language` (string): Course language (default: "English")
- `duration` (string, optional): Course duration (e.g., "6 weeks", "3h 40m")
- `price` (decimal): Course price (default: 0.0)
- `discountPrice` (decimal, optional): Discounted price
- `learningOutcomes` (array, optional): List of learning outcomes
- `requirements` (array, optional): Prerequisites
- `totalStudents` (integer): Number of enrolled students
- `rating` (float): Average rating (0-5)
- `totalRatings` (integer): Number of ratings
- `status` (enum): `draft` | `pending` | `published` | `archived`
- `isApproved` (boolean): Admin approval status
- `createdAt` (datetime): Creation timestamp
- `updatedAt` (datetime): Last update timestamp
- `category` (object, optional): Category details
- `instructor` (object, optional): Instructor details

---

### 16. Create Course
**Endpoint:** `POST /course`

**Access:** Admin, Instructor

**Request Body:**
```json
{
  "title": "New Course Title",
  "description": "Course description",
  "categoryId": "uuid",
  "thumbnail": "https://example.com/thumb.jpg",
  "level": "intermediate",
  "language": "English",
  "duration": "6 weeks",
  "price": "4999.00",
  "discountPrice": "2999.00",
  "learningOutcomes": ["Outcome 1", "Outcome 2"],
  "requirements": ["Requirement 1", "Requirement 2"]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Course created successfully.",
  "data": {
    "id": "uuid",
    "title": "New Course Title",
    "slug": "new-course-title",
    "isApproved": false,
    "status": "draft",
    "instructorId": "uuid",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Note:** 
- Admin-created courses: `isApproved` defaults to `false`, `status` defaults to `draft`
- Instructor-created courses: `isApproved` defaults to `false`, `status` defaults to `pending`

---

### 17. Get Course by ID
**Endpoint:** `GET /course/:courseId`

**Access:** 
- Admin: All courses
- Instructor: Own courses
- Student: Only if enrolled and payment approved

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Course Title",
    "slug": "course-title",
    "description": "Course description",
    "lessons": [
      {
        "id": "uuid",
        "title": "Lesson 1",
        "description": "Lesson description",
        "videoUrl": "https://example.com/video.mp4",
        "fileUrl": "https://example.com/file.pdf",
        "imageUrl": "https://example.com/image.jpg"
      }
    ]
  }
}
```

---

### 18. Update Course
**Endpoint:** `PATCH /course/:courseId`

**Access:** Admin, Instructor (own courses)

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "price": "5999.00",
  "level": "advanced"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Course updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Course Title",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Note:** 
- Admin can update any course without changing status
- Instructor updates automatically set status to `pending`

---

### 19. Update Course Status
**Endpoint:** `PUT /course/:courseId`

**Access:** Admin only

**Request Body:**
```json
{
  "status": "published",
  "isApproved": true,
  "instructorId": "uuid"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Course status updated successfully",
  "data": {
    "id": "uuid",
    "status": "published",
    "isApproved": true
  }
}
```

**Fields:**
- `status` (enum, optional): `draft` | `pending` | `published` | `archived`
- `isApproved` (boolean, optional): Approval status
- `instructorId` (UUID, optional): Change course instructor

---

### 20. Delete Course
**Endpoint:** `DELETE /course/:courseId`

**Access:** Admin, Instructor (own courses)

**Response:**
```json
{
  "status": "success",
  "message": "Course deleted successfully"
}
```

**Note:** Soft delete (paranoid delete)

---

## Lesson Management APIs

### 21. Add Lesson
**Endpoint:** `POST /course/:courseId/lesson`

**Access:** Admin, Instructor (own courses)

**Request Body (JSON - URLs only):**
```json
{
  "title": "Lesson Title",
  "description": "Lesson description",
  "videoUrl": "https://example.com/video.mp4",
  "fileUrl": "https://example.com/file.pdf",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Request Body (FormData - File uploads):**
```
Content-Type: multipart/form-data

title: "Lesson Title"
description: "Lesson description"
videoUrl: "https://example.com/video.mp4" (optional if video file provided)
fileUrl: "https://example.com/file.pdf" (optional if file provided)
imageUrl: "https://example.com/image.jpg" (optional if image file provided)
video: <File> (field name: "video")
file: <File> (field name: "file")
image: <File> (field name: "image")
```

**Response:**
```json
{
  "status": "success",
  "message": "Lesson added successfully",
  "data": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Lesson Title",
    "description": "Lesson description",
    "videoUrl": "https://example.com/video.mp4",
    "fileUrl": "https://example.com/file.pdf",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Fields:**
- `title` (string, required): Lesson title
- `description` (string, optional): Lesson description
- `videoUrl` (string, optional): Video URL or file upload
- `fileUrl` (string, optional): File URL or file upload
- `imageUrl` (string, optional): Image URL or file upload

**File Upload Notes:**
- Maximum file size: 2MB
- Supported video: MP4, AVI, MOV
- Supported files: PDF, DOC, DOCX
- Supported images: JPG, PNG, JPEG, WEBP
- Use `FormData` for file uploads
- Use JSON for URL-only submissions

---

### 22. Get Lessons by Course
**Endpoint:** `GET /course/:courseId`

**Access:** 
- Admin: All courses
- Instructor: Own courses
- Student: Only if enrolled and payment approved

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

---

### 23. Get Single Lesson
**Endpoint:** `GET /course/:courseId/:lessonId`

**Access:** 
- Admin: All courses
- Instructor: Own courses
- Student: Only if enrolled and payment approved

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

---

### 24. Update Lesson
**Endpoint:** `PATCH /course/:courseId/lesson/:lessonId`

**Access:** Admin, Instructor (own courses)

**Request Body:**
```json
{
  "title": "Updated Lesson Title",
  "description": "Updated description",
  "videoUrl": "https://example.com/new-video.mp4"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Lesson updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Lesson Title",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 25. Delete Lesson
**Endpoint:** `DELETE /course/:courseId/lesson/:lessonId`

**Access:** Admin, Instructor (own courses)

**Response:**
```json
{
  "status": "success",
  "message": "Lesson deleted successfully"
}
```

---

## Enrollment Management APIs

### 26. Get All Enrollments
**Endpoint:** `GET /enrollment/course`

**Access:** Admin, Instructor, Student (own enrollments)

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
        "slug": "course-title"
      },
      "user": {
        "id": "uuid",
        "name": "Student Name",
        "email": "student@example.com"
      }
    }
  ]
}
```

**Fields:**
- `id` (UUID): Enrollment unique identifier
- `userId` (UUID): Student user ID
- `courseId` (UUID): Course ID
- `progress` (float): Course completion percentage (0-100)
- `paymentStatus` (enum): `pending` | `free` | `paid` | `refund`
- `enrolledAt` (datetime): Enrollment date
- `completedAt` (datetime, optional): Course completion date
- `course` (object, optional): Course details
- `user` (object, optional): User details

---

### 27. Add Enrollment
**Endpoint:** `POST /enrollment`

**Access:** Admin, Instructor, Student

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
- `userId` (UUID, required): User to enroll
- `courseId` (UUID, required): Course to enroll in

**Note:** 
- Admin/Instructor can enroll any user
- Students can only enroll themselves
- Backend automatically sets `enrolledAt` date

---

### 28. Update Enrollment
**Endpoint:** `PATCH /enrollment/:enrollmentId`

**Access:** Admin, Instructor

**Request Body:**
```json
{
  "progress": 75.5,
  "paymentStatus": "paid"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Enrollment updated successfully",
  "data": {
    "id": "uuid",
    "progress": 75.5,
    "paymentStatus": "paid",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Fields:**
- `progress` (float, optional): Course completion percentage (0-100)
- `paymentStatus` (enum, optional): `pending` | `free` | `paid` | `refund`

---

### 29. Delete Enrollment
**Endpoint:** `DELETE /enrollment/:enrollmentId`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "message": "Enrollment deleted successfully"
}
```

---

## Category Management APIs

### 30. Get All Categories
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

---

### 31. Get Category by ID
**Endpoint:** `GET /category/:categoryId`

**Access:** Public

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Web Development",
    "slug": "web-development",
    "description": "Web development courses",
    "isActive": true
  }
}
```

---

### 32. Add Category
**Endpoint:** `POST /category`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "Data Science",
  "description": "Data science courses",
  "slug": "data-science",
  "isActive": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Data Science",
    "slug": "data-science",
    "description": "Data science courses",
    "isActive": true
  }
}
```

**Fields:**
- `name` (string, required): Category name
- `description` (string, optional): Category description
- `slug` (string, optional): URL-friendly identifier (auto-generated if not provided)
- `isActive` (boolean, optional): Active status (default: true)

---

### 33. Update Category
**Endpoint:** `PATCH /category/:categoryId`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "isActive": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Category updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Category Name",
    "description": "Updated description",
    "isActive": false
  }
}
```

---

### 34. Delete Category
**Endpoint:** `DELETE /category/:categoryId`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

---

### 35. Toggle Category Status
**Endpoint:** `PATCH /category/:categoryId/toggle`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "message": "Category status toggled successfully",
  "data": {
    "id": "uuid",
    "isActive": false
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "error": "Email is required"
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
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found",
  "error": "Course with ID 'uuid' not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Summary

Admin users have access to:
- ✅ All authentication endpoints
- ✅ Complete user management (CRUD)
- ✅ All course management operations
- ✅ All lesson management operations
- ✅ Complete enrollment management
- ✅ Complete category management
- ✅ Payment status updates
- ✅ Course status and approval management

Total API endpoints accessible to Admin: **35**

