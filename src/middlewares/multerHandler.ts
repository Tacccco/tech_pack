import { Request, Response, NextFunction } from 'express';

import multer from 'multer';
import mime from 'mime-types';

// import { parseJson } from '../utils/utils';
// import exceptions from '../exception/Exceptions';

/**
 * Multipart form data handler using multer
 */
class MultipartHandler {
    /** Our application accepts only files with these specific extensions */
    static REGEX_FILE_EXTENSIONS = /(jpe?g|webp|gif|png)$/i;

    /** Maximum number of file fields. (allows 5 file fields per request) */
    static MAXIMUM_FILE_COUNT_PER_REQUEST = 10;

    /** Maximum size of each file in bytes. (15728640 bytes = 15 mb) */
    /** 15 mb * 1024 kb * 1024 bytes */
    static MAXIMUM_FILE_SIZE_OF_EACH_FILE = 15 * 1024 * 1024;

    private readonly multerClient: multer.Multer;

    constructor() {
        this.multerClient = multer({
            fileFilter(req, file, callback) {
                const extension = mime.extension(file.mimetype);

                if (!extension) return callback(null, false);

                const validFileExtension = MultipartHandler.REGEX_FILE_EXTENSIONS.test(extension);

                if (validFileExtension) return callback(null, true);
                return callback(null, false);
            },
            limits: {
                fileSize: MultipartHandler.MAXIMUM_FILE_SIZE_OF_EACH_FILE,
                files: MultipartHandler.MAXIMUM_FILE_COUNT_PER_REQUEST,
            },
        });
    }

    private multipartValidator = (req: Request, err: unknown) => {
        if (err) {
            throw new Error('Bad Request!');
        }

        return req;
    };

    /**
     * @param req - Request
     * @param res - Response
     * @param next - NextFunction
     */
    recognitionFormFileHandler = (req: Request, res: Response, next: NextFunction) => {
        this.multerClient.fields([
            {
                name: 'identification_card_photo',
                maxCount: 1
            },
            {
                name: 'individual_photo',
                maxCount: 1
            }
        ])(req, res, (err) => {
            req = this.multipartValidator(req, err);
            next();
        });
    };
}

export default new MultipartHandler();
