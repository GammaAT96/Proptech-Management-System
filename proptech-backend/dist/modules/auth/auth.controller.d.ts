import type { Request, Response, NextFunction } from "express";
export declare function registerHandler(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function loginHandler(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function meHandler(req: Request, res: Response): Response<any, Record<string, any>>;
//# sourceMappingURL=auth.controller.d.ts.map