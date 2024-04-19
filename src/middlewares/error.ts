import { Response, Request, NextFunction } from 'express';
import config from '../../config/config';
import logger from '../../config/logger';
import BaseException from '../exception/BaseException';
import { ErrorCode, CustomExceptionInterface } from '../exception/ErrorCode';
import { BaseExceptionInterface } from '../exception/BaseException.interface';
import { parseJson } from '../utils/utils';

const errorHandler = (err: BaseException, req: Request, res: Response, next: NextFunction) => {
    let { errorCode: code, message }: BaseExceptionInterface = err;
    const { exception: exceptionName } = err;

    type ObjectKey = keyof typeof ErrorCode;
    const exception = ErrorCode[exceptionName as ObjectKey] as CustomExceptionInterface;

    message = message || (exception ? exception.message : BaseException.TEXT_DEFAULT_ERROR);
    code = code || (exception ? exception.code : BaseException.CODE_DEFAULT_ERROR);

    message = parseJson(message);

    res.locals.errorMessage = err.message;

    const response = {
        code,
        response: message,
        ...(config.env === 'dev' && { stack: err.stack }),
    };

    if (config.env === 'dev') {
        logger.error(err);
    }

    if (err instanceof BaseException) {
        res.status(200).send(response);
        return next();
    }

    res.status(500).send(response);
    return next();
};

export { errorHandler };
