import { CompareFacesCommand, QualityFilter, RekognitionClient } from '@aws-sdk/client-rekognition';

import { S3Service } from './s3.service';

export class FaceRecognitionService {
    private readonly client;

    constructor() {
        this.client = new RekognitionClient({ region: S3Service.REGION });
    }

    recognize = async (individualPhoto: string, identificationCardPhoto: string) => {
        const input = {
            SourceImage: {
                S3Object: {
                    Bucket: S3Service.BUCKET_NAME,
                    Name: individualPhoto,
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: S3Service.BUCKET_NAME,
                    Name: identificationCardPhoto,
                },
            },
            SimilarityThreshold: 90,
            QualityFilter: QualityFilter.AUTO,
        };
        const command = new CompareFacesCommand(input);

        const result = await this.client.send(command);

        return result;
    };
}

export default new FaceRecognitionService();
