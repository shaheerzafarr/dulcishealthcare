import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity.js';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    log(data: {
        userId?: string;
        action: string;
        entityType?: string;
        entityId?: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditLog>;
}
