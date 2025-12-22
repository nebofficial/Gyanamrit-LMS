import { NextFunction, Request, response, Response } from "express";
import { IExtendRequest, ILoginedUserType } from "../../global/type";
import enrollmentService from "../../service/enrollment/enrollment.service";
import { MSG, STATUS } from "../../constant/statusRes";

class EnrollmentController {
  // add Enrollment
  static async addEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, courseId } = req.body;

      if (!userId || !courseId) {
        res.status(404).json({ message: MSG.REQUIRED_FIELDS });
        return;
      }

      const data = enrollmentService.addEnrollment(req.body);
      res.status(201).json({
        staus: STATUS.SUCCESS,
        message: `Enrollment ${MSG.COURSE_DELETED}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getAllEnrolledCourse
  static async getAllEnrolledCourse(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id as string;
      if (!userId) {
        res.status(401).json({ mssage: MSG.UNAUTHORIZED });
        return;
      }

      const data = await enrollmentService.getAllEnrolledCourse(userId);
      if (data.length === 0) {
        res.status(200).json({ message: "No Enroll Courses Found" });
        return;
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Enroll Course ${MSG.FETCH_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  //updateEnrollment
  static async updateEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { enrollId } = req.params;
      if (!enrollId) {
        res.status(404).json({ message: "Enroll ID not found" });
        return;
      }
      await enrollmentService.updateEnrollment(enrollId, req.body);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Enroll ${MSG.UPDATE_SUCCESS}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEnrollStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const data = await enrollmentService.getEnrollStudent(courseId);
      if (data.length === 0) {
        res.status(200).json([]);
        return;
      }
      res
        .status(200)
        .json({
          status: STATUS.SUCCESS,
          message: `Enrolled Student ${MSG.FETCH_SUCCESS}`,
          data: data,
        });
    } catch (error) {
      next(error);
    }
  }
}

export default EnrollmentController;
