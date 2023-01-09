import express, { Application, Request, Response } from 'express';
import { translatorRouter } from './routers/translator';

const app: Application = express();

const PORT: number = 3000;

app.use(express.json());
app.use('/translate', translatorRouter);

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});