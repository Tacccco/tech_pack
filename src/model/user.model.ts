import mongoose from 'mongoose';

export const REGEX_REGISTRATION_NUMBER = /[A-Z|a-z|А-ЯӨҮ|а-яөү]{2}(\d){8}/;

export const PHOTO_TYPES = {
    INDENTIFICATION: 'indentification',
    INDIVIDUAL: 'individual',
} as const;

const userSchema = new mongoose.Schema(
    {
        registerationNumber: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            validate(value: string) {
                if (!value.match(REGEX_REGISTRATION_NUMBER)) {
                    throw new Error('Registeration number must be valid');
                }
            },
        },
        photos: [
            {
                key: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                mimeType: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    enum: [PHOTO_TYPES.INDENTIFICATION, PHOTO_TYPES.INDIVIDUAL],
                    required: true,
                },
            },
        ],
        metadata: {
            registerationNumber: {
                mn: {
                    type: String,
                    required: false,
                    trim: true,
                },
                en: {
                    type: String,
                    required: false,
                    trim: true,
                },
            },
            lastName: {
                mn: {
                    type: String,
                    required: false,
                    trim: true,
                },
                en: {
                    type: String,
                    required: false,
                    trim: true,
                },
            },
            firstName: {
                mn: {
                    type: String,
                    required: false,
                    trim: true,
                },
                en: {
                    type: String,
                    required: false,
                    trim: true,
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export { User };
