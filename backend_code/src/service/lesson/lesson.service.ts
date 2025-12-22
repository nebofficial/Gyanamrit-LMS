import { ILessonType } from "../../global/type";
import Lesson from "../../model/Lesson.Model";

const addLesson = async (courseId: string, body: ILessonType) => {
  return await Lesson.create({
    courseId: courseId,
    title: body.title,
    description: body.description,
    videoUrl: body.videoUrl,
    fileUrl: body.fileUrl,
    imageUrl: body.imageUrl,
  });
};

// getSingleLessonById
const getSingleLessonById = async(lessonId:string)=>{
    return await Lesson.findOne({where:{id:lessonId}})
}

export default { addLesson, getSingleLessonById };
