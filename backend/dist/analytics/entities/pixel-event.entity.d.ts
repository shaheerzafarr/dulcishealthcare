import { VisitorSession } from './visitor-session.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class PixelEvent {
    id: string;
    sessionId: string;
    session: VisitorSession;
    userId: string;
    user: User;
    eventName: string;
    platform: string;
    eventData: any;
    sentToGateway: boolean;
    gatewayResponse: any;
    createdAt: Date;
}
