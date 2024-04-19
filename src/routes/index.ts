import express from 'express';

import publicRoute from '../routes/public/public.route';

import registerationRoute from '../routes/api/registeration.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/api',
        route: registerationRoute,
    },
    {
        path: '/',
        route: publicRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
