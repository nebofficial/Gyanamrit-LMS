# Gyanamrit LMS - Module Documentation

## Overview

Gyanamrit LMS is a Learning Management System built with Next.js frontend and Node.js/Express backend. The system supports three user roles: **Admin**, **Instructor**, and **Student**, each with distinct permissions and access levels.

## Base URL

```
Production: https://gyanamritlms.onrender.com/v1/api
```

## Authentication

All protected endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

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
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Types

### UUID
All IDs are UUID v4 format strings.

### Date Format
ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Enum Values

**User Role:**
- `student`
- `instructor`
- `admin`

**User Status:**
- `pending`
- `active`
- `suspended`

**Course Status:**
- `draft`
- `pending`
- `published`
- `archived`

**Course Level:**
- `basic`
- `intermediate`
- `advanced`

**Payment Status:**
- `pending`
- `free`
- `paid`
- `refund`

## File Uploads

File uploads use `multipart/form-data` format. Supported file types:
- **Video**: MP4, AVI, MOV (via file upload or URL)
- **Files**: PDF, DOC, DOCX (via file upload or URL)
- **Images**: JPG, PNG, JPEG, WEBP (via file upload or URL)

Maximum file size: 2MB per file (configurable on backend)

## Rate Limiting

API rate limiting may be applied. Check response headers for rate limit information.

## Error Handling

All errors follow a consistent format:
- Check `status` field for success/error
- Check `message` field for human-readable error description
- Check `error` field for detailed error information (if available)

## Next Steps

- See `apiservice-admin.md` for Admin API documentation
- See `apiservice-instructor.md` for Instructor API documentation
- See `apiservice-student.md` for Student API documentation

