import type { Request, Response } from "express";
export declare const createTicketHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listTicketsHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listMyTicketsHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTicketHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const assignTechnicianHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTicketStatusHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadTicketImageHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ticket.controller.d.ts.map