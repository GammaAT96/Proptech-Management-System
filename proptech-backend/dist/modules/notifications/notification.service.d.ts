type CreateNotificationInput = {
    userId: string;
    message: string;
};
export declare const createNotification: (input: CreateNotificationInput) => Promise<{
    message: string;
    id: string;
    read: boolean;
    userId: string;
    createdAt: Date;
}>;
export declare const getNotifications: (userId?: string) => Promise<{
    message: string;
    id: string;
    read: boolean;
    userId: string;
    createdAt: Date;
}[]>;
export declare const markNotificationRead: (id: string) => Promise<{
    message: string;
    id: string;
    read: boolean;
    userId: string;
    createdAt: Date;
} | null>;
export {};
//# sourceMappingURL=notification.service.d.ts.map