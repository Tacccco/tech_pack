import config from '../../config/config';

import {
    TextractClient,
    AnalyzeDocumentCommand,
    FeatureType,
    Block,
    Relationship,
} from '@aws-sdk/client-textract';

import { S3Service } from './s3.service';

export class TextractService {
    private readonly textract;

    constructor() {
        this.textract = new TextractClient({ region: S3Service.REGION });
    }

    private getText = (result: Block, blocksMap: Record<string, Block>) => {
        let text = '';

        if ('Relationships' in result && result.Relationships) {
            result.Relationships.forEach((relationship: Relationship) => {
                if (relationship.Type === 'CHILD' && relationship.Ids) {
                    relationship.Ids.forEach((childId: string) => {
                        const word = blocksMap[childId];
                        if (word.BlockType === 'WORD') {
                            text += `${word.Text} `;
                        }
                        if (word.BlockType === 'SELECTION_ELEMENT') {
                            if (word.SelectionStatus === 'SELECTED') {
                                text += `Selected `;
                            }
                        }
                    });
                }
            });
        }

        return text.trim();
    };

    private findValueBlock = (keyBlock: Block, valueMap: Record<string, Block>): Block => {
        let valueBlock: Block | undefined = undefined;

        if (keyBlock.Relationships) {
            keyBlock.Relationships.forEach((relationship) => {
                if (relationship.Type === 'VALUE' && relationship.Ids) {
                    relationship.Ids.every((valueId) => {
                        if (valueId in valueMap) {
                            valueBlock = valueMap[valueId];
                            return false;
                        }
                    });
                }
            });
        }

        if (!valueBlock) return keyBlock;

        return valueBlock;
    };

    private getKeyValueRelationship = (
        keyMap: Record<string, Block>,
        valueMap: Record<string, Block>,
        blockMap: Record<string, Block>
    ) => {
        const keyValues: Record<string, string> = {};

        const keyMapValues = Object.values(keyMap);

        keyMapValues.forEach((keyMapValue) => {
            const valueBlock = this.findValueBlock(keyMapValue, valueMap);
            const key = this.getText(keyMapValue, blockMap);
            const value = this.getText(valueBlock, blockMap);
            keyValues[key] = value;
        });

        return keyValues;
    };

    private getKeyValueMap = (blocks: Block[]) => {
        const keyMap: Record<string, Block> = {};
        const valueMap: Record<string, Block> = {};
        const blockMap: Record<string, Block> = {};

        let blockId;
        blocks.forEach((block) => {
            blockId = <string>block.Id;
            blockMap[blockId] = block;

            if (block.BlockType === 'KEY_VALUE_SET') {
                if (block.EntityTypes) {
                    if (block.EntityTypes.includes('KEY')) {
                        keyMap[blockId] = block;
                    } else {
                        valueMap[blockId] = block;
                    }
                }
            }
        });

        return { keyMap, valueMap, blockMap };
    };

    extractTextFromPhoto = async (name: string) => {
        const input = {
            Document: {
                S3Object: {
                    Bucket: config.aws_bucket_name,
                    Name: name,
                },
            },
            FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
        };
        // const input = {
        //     DocumentPages: [
        //         {
        //             S3Object: {
        //                 Bucket: config.aws_bucket_name,
        //                 Name: name,
        //             },
        //         },
        //     ],
        // };

        // const command = new AnalyzeIDCommand(input);
        const command = new AnalyzeDocumentCommand(input);

        const extractedDocument = await this.textract.send(command);

        if (extractedDocument && extractedDocument.Blocks) {
            const { keyMap, valueMap, blockMap } = this.getKeyValueMap(extractedDocument.Blocks);
            const keyValues = this.getKeyValueRelationship(keyMap, valueMap, blockMap);

            return keyValues;
        }

        return extractedDocument;
    };
}

export default new TextractService();
