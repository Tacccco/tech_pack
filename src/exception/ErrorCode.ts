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

    static FilesNotUploadedException: CustomExceptionInterface = {
        code: 1002,
        message: 'Bad request! Must upload files',
    };

    static IndividualPhotoNotUploadedException: CustomExceptionInterface = {
        code: 1003,
        message: 'Bad Request! Please upload individual photo',
    };

    static IDPhotoNotUploadedException: CustomExceptionInterface = {
        code: 1004,
        message: 'Bad Request! Please upload identification card photo',
    };
    
    static RegistrationNumberNotFoundException: CustomExceptionInterface = {
        code: 2000,
        message: 'Registration number not found',
    };

    static SurnameNotFoundException: CustomExceptionInterface = {
        code: 2001,
        message: 'Surname not found',
    };

    static GivenNameNotFoundException: CustomExceptionInterface = {
        code: 2002,
        message: 'Given name not found',
    };

    static getExceptionList = () =>
        Object.keys(ErrorCode).filter((value) => value.substring(value.length - 9) == 'Exception');
}

export { ErrorCode, CustomExceptionInterface };
