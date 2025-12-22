import { Sequelize } from "sequelize";
import { config } from "./config";
import pg from "pg"
import { initUserModel } from "../model/User.Model";
import { initCategoryModel } from "../model/Category.Model";
import { initCourseModel } from "../model/Course.Model";
import { initLessonModl } from "../model/Lesson.Model";
import { initEnrollmentModel } from "../model/Enrollment.Modal";


const sequelize = new Sequelize(config.dtabaseUrl, {
    dialect: "postgres",
    logging: false,
    dialectModule: pg
})

initUserModel(sequelize)
initCategoryModel(sequelize)
initCourseModel(sequelize)
initLessonModl(sequelize)
initEnrollmentModel(sequelize)

sequelize.authenticate().then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>{
    console.error("Unable to connect to the database:", error);
})


sequelize.sync({alter:true}).then(()=>{
    console.log("All models were synchronized successfully.");
}).catch((error)=>{
    console.error("An error occurred while synchronizing the models:", error);
})

export default sequelize
