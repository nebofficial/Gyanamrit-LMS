import { Response, NextFunction } from "express";
import { IExtendRequest } from "../../global/type";
import courseService from "../../service/course/course.service";
import lessonService from "../../service/lesson/lesson.service";
import { ADMIN_ROLE } from "../../constant/userRole";

class LessonController {
  // ➤ ADD LESSON
  static async addLesson(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const { title, description, videoUrl, fileUrl, imageUrl } = req.body;

      // 1️⃣ Validate required fields
      if (!courseId || !title) {
        return res.status(400).json({
          message: "courseId and title are required",
        });
      }

      // 2️⃣ Check if course exists
      const course: any = await courseService.getSingleCoursebyId(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // 3️⃣ Only instructor who created the course can add lessons
      if (course.instructorId !== req.user?.id && !req.user?.role.includes(ADMIN_ROLE)) {
        return res.status(403).json({
          message: "You are not allowed to add lessons to this course",
        });
      }

      const lesson = await lessonService.addLesson(courseId, req.body);
      // 5️⃣ Return response
      return res.status(201).json({
        message: "Lesson added successfully",
        lesson,
      });
    } catch (error) {
      console.error("Add Lesson Error:", error);
      next(error);
    }
  }
}

export default LessonController;
