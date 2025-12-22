import { Op } from "sequelize";
import { PAYMENT_FREE_STATUS, PAYMENT_PAID_STATUS } from "../../constant/paymntStatus";
import { IEnrollType } from "../../global/type";
import Course from "../../model/Course.Model";
import Enrollment from "../../model/Enrollment.Modal";
import User from "../../model/User.Model";
import Category from "../../model/Category.Model";

const addEnrollment = async (data: IEnrollType) => {
  return await Enrollment.create({
    userId: data.userId,
    courseId: data.courseId,
    paymentStatus: data.paymentStatus,
    enrolledAt: Date.now(),
  });
};

const getAllEnrolledCourse = async (userId: string) => {
  return await Enrollment.findAll({
    where: { userId },
    include: [
      {
        model: Course,
        as: "course",
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "instructor",
            attributes: ["id", "name", "email"],
          },
        ],
      },
    ],
    order: [["enrolledAt", "DESC"]],
  });
};

const getEnrollStudent = async(courseId:string)=>{
  return await Enrollment.findAll({where:{courseId}, include:[
    {
      model: User,
      as:"user",
      attributes:{exclude:['password']}
    }
  ]})
}

const getSingleEnrollCourse = async (userId: string, courseId: string) => {
  return await Enrollment.findOne({
    where: {
      userId,
      courseId,
      paymentStatus: {
        [Op.in]: [PAYMENT_FREE_STATUS, PAYMENT_PAID_STATUS],
      },
    },
  });
};

const updateEnrollment = async(enrollId:string, data:IEnrollType)=>{
  return await Enrollment.update({
    userId:data.userId,
    courseId:data.courseId,
    paymentStatus:data.paymentStatus,
    enrolledAt:data.enrolledAt,
    completedAt:data.completedAt
  },{where:{id:enrollId}})
}

export default { addEnrollment, getAllEnrolledCourse, getSingleEnrollCourse, updateEnrollment, getEnrollStudent };
