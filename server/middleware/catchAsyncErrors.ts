import { Request, Response, NextFunction } from 'express';

export const CatchAsyncError = (thenFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(thenFunc(req, res, next)).catch(next);
}