import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('prod', 'dev', 'test').required(),
        PORT: Joi.number().default(3000),

        MONGODB_URL: Joi.string(),

        AWS_REGION: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_BUCKET_NAME: Joi.string(),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,

    mongodb_url: envVars.MONGODB_URL,

    aws_region: envVars.AWS_REGION,
    aws_access_key_id: envVars.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: envVars.AWS_SECRET_ACCESS_KEY,
    aws_bucket_name: envVars.AWS_BUCKET_NAME,
};
