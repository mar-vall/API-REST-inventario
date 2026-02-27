import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../common/error-codes";
import { ErrorResponse } from "./error-response";

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = errors.flatMap((error) =>
        Object.values(error.constraints || {}).map((msg) => ({
          field: error.property,
          issue: msg,
        }))
      );

      return next(
        new ErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          "Validation failed.",
          400,
          details
        )
      );
    }

    req.body = dto;
    next();
  };
};
