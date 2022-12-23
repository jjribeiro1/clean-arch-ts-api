import { Request, Response } from 'express';
import { IController, IHttpResponse } from '../../presentation/protocols';
import { IHttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body,
    };

    const httpResponse: IHttpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
