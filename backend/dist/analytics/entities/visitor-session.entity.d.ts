import { User } from '../../users/entities/user.entity.js';
import { UtmTracking } from './utm-tracking.entity.js';
import { PixelEvent } from './pixel-event.entity.js';
export declare class VisitorSession {
    id: string;
    userId: string;
    user: User;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    referrer: string;
    landingPage: string;
    deviceType: string;
    country: string;
    city: string;
    startedAt: Date;
    endedAt: Date;
    utmTracking: UtmTracking[];
    pixelEvents: PixelEvent[];
}
