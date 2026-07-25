import { VisitorSession } from './visitor-session.entity.js';
export declare class UtmTracking {
    id: string;
    sessionId: string;
    session: VisitorSession;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
    createdAt: Date;
}
