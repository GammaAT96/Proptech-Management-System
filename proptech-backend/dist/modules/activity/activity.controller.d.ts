import type { Request, Response } from "express";
export declare const listTicketActivityHandler: (req: Request, res: Response) => Promise<void>;
export declare const getRecentActivityHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyActivityHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=activity.controller.d.ts.map