import Logger from '../../config/logger';
import config from '../../config/config';

import exceptions from '../exception/Exceptions';

import mime from 'mime-types';
import { randomUUID } from 'crypto';

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class S3Service {
    static REGION = config.aws_region;
    static BUCKET_NAME = config.aws_bucket_name;

    // 1 hour * 60 minute * 60 second
    static PUBLIC_URL_DURATION = 1 * 60 * 60;

    private readonly s3;

    constructor() {
        this.s3 = new S3Client({ region: S3Service.REGION });
    }

    /**
     * Файлын төрөл шалгах
     *
     * @param mimeType Файлын төрөл
     * @param extensionRegex Зөвшөөрөгдөх файлын төрлийн regex
     *
     * @throws InvalidFileException
     */
    static checkFileExtension = (mimeType: string, extensionRegex: RegExp) => {
        const extension = mime.extension(mimeType);

        if (!extension) throw new exceptions.InvalidFileException();
        if (!extensionRegex.test(extension)) throw new exceptions.InvalidFileException();
    };

    /**
     * AWS Файл хадгалах
     *
     * @param path - Файл хадгалах зам
     * @param body - Файлын буффер
     * @param contentType - Файлын төрөл
     * @param originalName - Файл хадгалах нэр
     * @param mask - Масклах эсэх
     *
     * @returns aws key
     *
     * @throws FileUploadFailedException
     */
    uploadFile = async (path: string, body: Buffer, contentType: string, originalName: string, mask = true) => {
        const fileName = mask ? `${randomUUID()}.${originalName.split('.').pop()}` : originalName;
        const key = path + fileName;

        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: S3Service.BUCKET_NAME,
                    Key: key,
                    ContentType: contentType,
                    Body: body,
                })
            );
        } catch (err) {
            Logger.error(`S3 uploading file error: ${err}`);

            throw new exceptions.FileUploadFailedException();
        }

        return key;
    };

    /**
     * Файл харах холбоос авах
     *
     * @param key - Файлын AWS key
     *
     * @returns Файлын холбоос
     */
    // getFilePublicUrl = async (key: string) => {
    //     return await getSignedUrl(
    //         this.s3,
    //         new GetObjectCommand({
    //             Bucket: AWSService.BUCKET_NAME,
    //             Key: key,
    //         }),
    //         {
    //             expiresIn: AWSService.PUBLIC_URL_DURATION,
    //         }
    //     );
    // };

    /**
     * Файл авах
     *
     * @param key - Файлын AWS key
     *
     * @returns Файл
     *
     * @throws FileDownloadFailedException
     */
    getFile = async (key: string) => {
        try {
            const object = await this.s3.send(
                new GetObjectCommand({
                    Bucket: S3Service.BUCKET_NAME,
                    Key: key,
                })
            );

            return {
                payload: object.Body,
                mimeType: object.ContentType,
            };
        } catch (err) {
            Logger.error(`S3 downloading file error: ${err}`);

            throw new exceptions.FileDownloadFailedException();
        }
    };
}

export default new S3Service();
