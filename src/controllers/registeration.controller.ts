import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';

import * as UserService from '../services/register.service';
import exceptions from '../exception/Exceptions';

export type RegisterForm = {
    register_number: string;
};

export type RegisterFormFiles = {
    identification_card_photo: Express.Multer.File[];
    individual_photo: Express.Multer.File[];
};

const register = catchAsync(async (req: Request, res: Response) => {
    const photo = <RegisterFormFiles>req.files;
    const { register_number: registerationNumber } = <RegisterForm>req.body;

    if (!photo) throw new exceptions.FilesNotUploadedException();
    if (!photo.individual_photo) throw new exceptions.IndividualPhotoNotUploadedException();
    if (!photo.identification_card_photo) throw new exceptions.IDPhotoNotUploadedException();

    const response = await UserService.register(registerationNumber, photo.identification_card_photo[0], photo.individual_photo[0]);

    return res.status(200).send(response);
});

export { register };
