interface CustomExceptionInterface {
    code: number;
    message: string;
}

class ErrorCode {
    static InvalidParamException: CustomExceptionInterface = {
        code: 1000,
        message: 'Invalid Param',
    };

    static InvalidTokenException: CustomExceptionInterface = {
        code: 1001,
        message: 'Invalid Token',
    };

    static ObjectNotFoundException: CustomExceptionInterface = {
        code: 1002,
        message: 'Object Not Found',
    };

    static NameDuplicatedException: CustomExceptionInterface = {
        code: 1003,
        message: 'Name Duplicated',
    };

    static getExceptionList = () =>
        Object.keys(ErrorCode).filter((value) => value.substring(value.length - 9) == 'Exception');
}

export { ErrorCode, CustomExceptionInterface };
