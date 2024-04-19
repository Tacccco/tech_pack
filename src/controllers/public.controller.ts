import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import BaseException from '../exception/BaseException';
import Exceptions from '../exception/Exceptions';

const homeAction = catchAsync(async (req: Request, res: Response) => {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Hello World!</h2>'));
});

const healthCheck = catchAsync(async (req: Request, res: Response) => {
    res.send({
        code: 0,
        response: 'Working',
    });
});

const invalidParamExceptionThrower = catchAsync(async () => {
    throw new Exceptions.InvalidParamException();
});

const baseExceptionThrower = catchAsync(async () => {
    throw new BaseException();
});

const exceptionThrower = catchAsync(async () => {
    throw new Error('Exception');
});

const ignoreFavicon = catchAsync(async (req: Request, res: Response) => {
    res.status(204);
    res.send(null);
});

export { homeAction, healthCheck, invalidParamExceptionThrower, baseExceptionThrower, exceptionThrower, ignoreFavicon };
