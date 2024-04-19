import Joi from 'joi';
import { isNumber } from './custom.validation';

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        content: Joi.string().required(),
    }),
};

const getObjects = {
    query: Joi.object().keys({
        name: Joi.string(),
        id: Joi.string().custom(isNumber),
        skip: Joi.number().custom(isNumber),
        take: Joi.number().custom(isNumber),
        orderBy: Joi.string(),
    }),
};

const getObject = {
    params: Joi.object().keys({
        id: Joi.number(),
    }),
};

const update = {
    params: Joi.object().keys({
        id: Joi.number(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            content: Joi.string(),
            updatedUserId: Joi.number().custom(isNumber),
        })
        .min(1),
};

export { create, getObjects, getObject, update };
