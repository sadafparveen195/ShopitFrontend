import * as yup from 'yup';

export const schemas = [
    yup.object().shape({
        avatar: yup.mixed().required('Avatar is required')
            .test('fileType', 'Unsupported File Format', (value) => value && ['image/jpeg', 'image/png'].includes(value.type))
            .test('fileSize', 'File too large', (value) => value && value.size <= 2 * 1024 * 1024), // 2MB limit
    }),
    yup.object().shape({
        name: yup.string().required('Name is required'),
        about: yup.string().required('Please tell us something about you'),
    }),
    yup.object().shape({
        contactMethod: yup.string().required(),
        email: yup.string().when("contactMethod", {
            is: "email",
            then: (schema) => schema.required("Email is required").email("Enter a valid email"),
            otherwise: (schema) => schema.notRequired(),
        }),
        phone: yup.string().when("contactMethod", {
            is: "phone",
            then: (schema) => schema.required("Phone number is reqired").matches(/^[0-9]+$/, 'Enter a valid phone number'),
            otherwise: (schema) => schema.notRequired(),
        })

    }),
    yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
    }),
];