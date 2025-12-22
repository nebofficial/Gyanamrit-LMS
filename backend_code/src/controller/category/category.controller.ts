import { NextFunction, Request, Response } from "express";
import { IExtendRequest } from "../../global/type";
import { HTTP, MSG, STATUS } from "../../constant/statusRes";
import categoryService from "../../service/category/category.service";

class CategoryController {
  // add Category
  static async addCategory(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, description } = req.body;

      // validation
      if (!name || !description) {
        res.status(HTTP.NOT_FOUND).json({ message: MSG.REQUIRED_FIELDS });
        return;
      }

      const data = await categoryService.addCategory(req.body);
      res.status(201).json({
        status: STATUS.SUCCESS,
        message: "Category Add Successfullhy",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // getAllCategory
  static async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.getAllCategory();
      if (data.length === 0) {
        res.status(200).json([]);
        return;
      }

      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Category ${MSG.FETCH_SUCCESS}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // update Status
  static async updateCategory(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;

      const find = await categoryService.findOneCategory(categoryId);
      if (!find) {
        res.status(200).json({ message: "No Request Category find" });
        return;
      }

      const result = await categoryService.updateCategory(req.body, categoryId);

      res.status(200).json({
        message: `Category ${MSG.UPDATE_SUCCESS}`,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // deleteCategory
  static async deleteCategory(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const find = await categoryService.findOneCategory(categoryId);
      if (!find) {
        res.status(200).json({ message: "No Request Category find" });
        return;
      }

      await categoryService.deleteCategory(categoryId);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Category ${MSG.DELETE_SUCCESS}`,
      });
    } catch (error) {
      next(error);
    }
  }

  // toggleCategory
  static async toggleCategory(
    req: IExtendRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.params;
      const find = await categoryService.findOneCategory(categoryId);
      if (!find) {
        res.status(200).json({ mesage: "No requested Category found" });
        return;
      }

      await categoryService.toggleCategory(req.body, categoryId);
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: `Category Status ${MSG.UPDATE_SUCCESS}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
