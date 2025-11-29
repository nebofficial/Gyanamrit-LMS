# Instructor API Service Documentation

## Overview

This document describes all API endpoints accessible to **Instructor** users in the Gyanamrit LMS system. Instructors can create and manage their own courses, add lessons, and manage enrollments for their courses.

## Base URL

```
https://gyanamritlms.onrender.com/v1/api
```

## Authentication

All endpoints require JWT authentication:

```
Authorization: Bearer <instructor_token>
```

---

## Authentication APIs

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "name": "Instructor Name",
  "email": "instructor@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "instructor",
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

---

### 2. Sign In
**Endpoint:** `POST /auth/signin`

**Access:** Public

**Request Body:**
```json
{
  "email": "instructor@example.com",
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
  "email": "instructor@example.com"
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

**Example:** `GET /auth/verify/instructor@example.com/40716f22c5799e46d34eb802f0eff8fd67cda56b5fce6ac4cadbb231998640dc`

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
  "email": "instructor@example.com"
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
  "email": "instructor@example.com",
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
    "name": "Instructor Name",
    "email": "instructor@example.com",
    "role": "instructor",
    "contactNumber": "+1234567890",
    "country": "USA",
    "bio": "Experienced instructor",
    "expertise": "Web Development",
    "experience": "10 years",
    "qualification": "MSc Computer Science",
    "isEmailVerified": true,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Instructor-Specific Fields:**
- `expertise` (string, optional): Area of expertise
- `experience` (string, optional): Years of experience
- `qualification` (string, optional): Educational qualifications

---

### 8. Update Own Profile
**Endpoint:** `PATCH /user/profile`

**Access:** Authenticated users (all roles)

**Request Body:**
```json
{
  "name": "Updated Instructor Name",
  "contactNumber": "+9876543210",
  "country": "Canada",
  "bio": "Updated instructor bio",
  "expertise": "Full Stack Development",
  "experience": "12 years",
  "qualification": "PhD Computer Science"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Updated Instructor Name",
    "expertise": "Full Stack Development",
    "experience": "12 years",
    "qualification": "PhD Computer Science"
  }
}
```

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

## Course Management APIs

### 10. Get Own Courses
**Endpoint:** `GET /course/for-instructor`

**Access:** Instructor only

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "My Course Title",
      "slug": "my-course-title",
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
      "totalStudents": 50,
      "rating": 4.5,
      "totalRatings": 30,
      "status": "pending",
      "isApproved": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "category": {
        "id": "uuid",
        "name": "Web Development"
      }
    }
  ]
}
```

**Note:** Returns only courses created by the authenticated instructor.

---

### 11. Create Course
**Endpoint:** `POST /course`

**Access:** Instructor, Admin

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
    "status": "pending",
    "instructorId": "uuid",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Important Notes:**
- Instructor-created courses automatically have:
  - `isApproved`: `false` (requires admin approval)
  - `status`: `pending`
  - `instructorId`: Automatically set to current instructor's ID
- Course cannot be viewed by students until `isApproved` is `true` and `status` is `published`

---

### 12. Get Course by ID (Own Courses Only)
**Endpoint:** `GET /course/:courseId`

**Access:** 
- Instructor: Only own courses
- Admin: All courses
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

**Note:** Instructors can only access their own courses. Accessing another instructor's course will return 403 Forbidden.

---

### 13. Update Course (Own Courses Only)
**Endpoint:** `PATCH /course/:courseId`

**Access:** Instructor (own courses), Admin

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
    "status": "pending",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Important Notes:**
- Instructor updates automatically set `status` to `pending`
- Course requires admin re-approval after update
- Cannot update `instructorId`, `status`, or `isApproved` (admin-only fields)

---

### 14. Delete Course (Own Courses Only)
**Endpoint:** `DELETE /course/:courseId`

**Access:** Instructor (own courses), Admin

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

### 15. Add Lesson to Own Course
**Endpoint:** `POST /course/:courseId/lesson`

**Access:** Instructor (own courses), Admin

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

### 16. Get Lessons by Course (Own Courses Only)
**Endpoint:** `GET /course/:courseId`

**Access:** 
- Instructor: Own courses only
- Admin: All courses
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

### 17. Get Single Lesson (Own Courses Only)
**Endpoint:** `GET /course/:courseId/:lessonId`

**Access:** 
- Instructor: Own courses only
- Admin: All courses
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

### 18. Update Lesson (Own Courses Only)
**Endpoint:** `PATCH /course/:courseId/lesson/:lessonId`

**Access:** Instructor (own courses), Admin

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

### 19. Delete Lesson (Own Courses Only)
**Endpoint:** `DELETE /course/:courseId/lesson/:lessonId`

**Access:** Instructor (own courses), Admin

**Response:**
```json
{
  "status": "success",
  "message": "Lesson deleted successfully"
}
```

---

## Enrollment Management APIs

### 20. Get Enrollments for Own Courses
**Endpoint:** `GET /enrollment/course`

**Access:** Instructor, Admin, Student (own enrollments)

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

**Note:** Instructors can see enrollments for all their courses. Filter by `courseId` on the frontend to get enrollments for a specific course.

---

### 21. Add Enrollment (Manual Enrollment)
**Endpoint:** `POST /enrollment`

**Access:** Instructor (own courses), Admin

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
- `courseId` (UUID, required): Course to enroll in (must be instructor's own course)

**Note:** 
- Instructors can only enroll users in their own courses
- Backend automatically sets `enrolledAt` date
- Default `paymentStatus` is `pending`

---

### 22. Update Enrollment (Own Courses Only)
**Endpoint:** `PATCH /enrollment/:enrollmentId`

**Access:** Instructor (own courses), Admin

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

**Note:** Instructors can only update enrollments for their own courses.

---

## Category APIs

### 23. Get All Categories
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

**Note:** Instructors can view all categories but cannot create, update, or delete them (admin-only).

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "error": "Title is required"
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
  "error": "You can only access your own courses"
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

---

## Important Notes for Instructors

### Course Approval Workflow
1. Instructor creates course → `status: "pending"`, `isApproved: false`
2. Admin reviews and approves → `isApproved: true`, `status: "published"`
3. Course becomes visible to students
4. If instructor updates course → `status` resets to `"pending"`, requires re-approval

### View Button Behavior
- **Approved courses** (`isApproved: true`): View button enabled
- **Pending courses** (`isApproved: false`): View button disabled, shows "Waiting for approval"

### Enrollment Management
- Instructors can manually enroll students in their courses
- Instructors can update payment status for enrollments in their courses
- Instructors cannot delete enrollments (admin-only)

### Lesson Management
- Instructors can add, update, and delete lessons in their own courses
- Supports both file uploads and URL-based content
- File uploads require `multipart/form-data` format

---

## Summary

Instructor users have access to:
- ✅ All authentication endpoints
- ✅ Own profile management
- ✅ Own course management (create, read, update, delete)
- ✅ Own course lesson management (CRUD)
- ✅ Enrollment management for own courses (add, update, view)
- ✅ Category viewing (read-only)

**Restrictions:**
- ❌ Cannot access other instructors' courses
- ❌ Cannot update course status or approval (admin-only)
- ❌ Cannot delete enrollments (admin-only)
- ❌ Cannot manage categories (admin-only)
- ❌ Cannot manage users (admin-only)

Total API endpoints accessible to Instructor: **23**

