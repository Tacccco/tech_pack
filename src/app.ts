import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import config from '../config/config';
import morgan from '../config/morgan';
import routes from './routes/index';
import { errorHandler } from './middlewares/error';
import BaseException from './exception/BaseException';

const app: Express = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());
app.use(helmet.xssFilter());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// api routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new BaseException('Not found', 404));
});

// handle error
app.use(errorHandler);

export default app;
