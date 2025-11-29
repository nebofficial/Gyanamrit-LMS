# Gyanamrit LMS – Full API & Module Documentation

> This README aggregates all Markdown docs from the `docs/` folder:
> - `docs/module.md`
> - `docs/apiservice-admin.md`
> - `docs/apiservice-instructor.md`
> - `docs/apiservice-student.md`

---

## 1. Module Overview (`docs/module.md`)

```markdown
# Gyanamrit LMS - Module Documentation

## Overview

Gyanamrit LMS is a Learning Management System built with Next.js frontend and Node.js/Express backend. The system supports three user roles: **Admin**, **Instructor**, and **Student**, each with distinct permissions and access levels.

## Base URL

Production: https://gyanamritlms.onrender.com/v1/api

## Authentication

All protected endpoints require JWT authentication via Bearer token in the Authorization header:

Authorization: Bearer <token>

## User Roles

### 1. Admin
- Full system access
- User management (CRUD operations)
- Course management (all courses)
- Enrollment management
- Payment status management
- Category management

### 2. Instructor
- Create and manage own courses
- Add lessons to own courses
- View own course enrollments
- Manage enrollments for own courses
- Update own profile

### 3. Student
- View available courses
- Enroll in courses
- View enrolled courses
- Access course lessons (if enrolled and payment approved)
- Update own profile

## Module Structure

### 1. Authentication Module (`/auth`)
- User registration
- User login
- Account verification
- Password reset

### 2. User Module (`/user`)
- Profile management
- User CRUD operations (Admin only)
- User status management

### 3. Course Module (`/course`)
- Course creation
- Course management
- Course status updates
- Course retrieval (role-based)

### 4. Lesson Module (`/course/:courseId/lesson`)
- Lesson creation
- Lesson management
- File uploads (video, file, image)

### 5. Enrollment Module (`/enrollment`)
- Course enrollment
- Enrollment management
- Payment status updates
- Progress tracking

### 6. Category Module (`/category`)
- Category management
- Category listing

## Common Response Format

### Success Response
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}

### Error Response
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}

## HTTP Status Codes

- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error

## Data Types

### UUID
All IDs are UUID v4 format strings.

### Date Format
ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ

### Enum Values

**User Role:**
- student
- instructor
- admin

**User Status:**
- pending
- active
- suspended

**Course Status:**
- draft
- pending
- published
- archived

**Course Level:**
- basic
- intermediate
- advanced

**Payment Status:**
- pending
- free
- paid
- refund

## File Uploads

File uploads use multipart/form-data format. Supported file types:
- Video: MP4, AVI, MOV (via file upload or URL)
- Files: PDF, DOC, DOCX (via file upload or URL)
- Images: JPG, PNG, JPEG, WEBP (via file upload or URL)

Maximum file size: 2MB per file (configurable on backend)

## Rate Limiting

API rate limiting may be applied. Check response headers for rate limit information.

## Error Handling

All errors follow a consistent format:
- Check status field for success/error
- Check message field for human-readable error description
- Check error field for detailed error information (if available)
```

---

## 2. Admin API Service (`docs/apiservice-admin.md`)

```markdown
# Admin API Service Documentation

...full content from docs/apiservice-admin.md...
```

---


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



## 3. Instructor API Service (`docs/apiservice-instructor.md`)

```markdown
# Instructor API Service Documentation

...full content from docs/apiservice-instructor.md...
```

---

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

---
## 4. Student API Service (`docs/apiservice-student.md`)

```markdown
# Student API Service Documentation

...full content from docs/apiservice-student.md...
```

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
```
---
