import { PHOTO_TYPES, User } from '../model/user.model';
import faceRecognitionService from './face.recognition.service';

import s3Service from './s3.service';
import textractService from './textract.service';

/**
 * Register user and its photos
 *
 * @param {Object} userBody
 *
 * @returns {Promise<User>}
 */
const register = async (
    registerationNumber: string,
    identificationCardPhoto: Express.Multer.File,
    individualPhoto: Express.Multer.File
) => {
    const path = `tech-pack/${registerationNumber}/`;

    const identificationCardPhotoKey = await s3Service.uploadFile(
        path,
        identificationCardPhoto.buffer,
        identificationCardPhoto.mimetype,
        identificationCardPhoto.originalname
    );

    const individualPhotoKey = await s3Service.uploadFile(
        path,
        individualPhoto.buffer,
        individualPhoto.mimetype,
        individualPhoto.originalname
    );

    const extractedDocument = <Record<string, string>>(
        await textractService.extractTextFromPhoto(identificationCardPhotoKey)
    );

    const metadata = {
        registerationNumber: {
            mn: extractedDocument['Registration number'].split('/')[0],
            en: extractedDocument['Registration number'].split('/')[1],
        },
        lastName: {
            mn: extractedDocument['3uar/3x/-n Hap Surname'],
            en: extractedDocument['3uar/3x/-n Hap Surname'],
        },
        firstName: {
            mn: extractedDocument['Hap Given name'],
            en: extractedDocument['Hap Given name'],
        },
    };

    const recognitionResult = await faceRecognitionService.recognize(individualPhotoKey, identificationCardPhotoKey);

    await User.create({
        registerationNumber,
        metadata,
        photos: [
            {
                key: individualPhotoKey,
                type: PHOTO_TYPES.INDIVIDUAL,
                name: individualPhoto.originalname,
                mimeType: individualPhoto.mimetype,
            },
            {
                key: identificationCardPhotoKey,
                type: PHOTO_TYPES.INDIVIDUAL,
                name: identificationCardPhoto.originalname,
                mimeType: identificationCardPhoto.mimetype,
            },
        ],
    });

    const response = {
        isMatched: false,
        detail: {
            individualPhoto: false,
            identificationCardPhoto: false,
            registerationNumber: false,
        },
    };

    if (recognitionResult.FaceMatches && recognitionResult.FaceMatches.length) {
        response.detail.individualPhoto = true;
        response.detail.identificationCardPhoto = true;
    }

    if (extractedDocument['Registration number'].split('/')[0].trim() === registerationNumber) {
        response.detail.registerationNumber = true;
    }

    if (
        response.detail.identificationCardPhoto &&
        response.detail.individualPhoto &&
        response.detail.registerationNumber
    ) {
        response.isMatched = true;
    }

    return response;
};

export { register };
