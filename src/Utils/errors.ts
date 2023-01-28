import {NextFunction, Request, Response} from "express";


export class CustomError extends Error {
    status: number
};

export const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res
        .status(err.status)
        .json({
            message: err.message,
        });
}