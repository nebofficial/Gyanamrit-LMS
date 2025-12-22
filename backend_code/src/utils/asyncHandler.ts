import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: unknown) => {
      next(err); // IMPORTANT
    });
  };
};

export default asyncHandler;
