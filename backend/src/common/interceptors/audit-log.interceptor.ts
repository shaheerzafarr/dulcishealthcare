import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service.js';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip, headers } = request;

    // We only log writing operations: POST, PUT, PATCH, DELETE for admin routes or settings modifications
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isAdminRoute = url.startsWith('/api/admin');

    if (!isWriteOperation || !isAdminRoute) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: async (responseBody) => {
          try {
            // Determine entity type and ID from body or response if possible
            let entityType = null;
            let entityId = null;
            
            // Extract from URL (e.g., /api/admin/products/:id)
            const urlParts = url.split('/');
            const productIndex = urlParts.indexOf('products');
            const userIndex = urlParts.indexOf('users');
            const couponIndex = urlParts.indexOf('coupons');

            if (productIndex !== -1 && urlParts[productIndex + 1]) {
              entityType = 'product';
              entityId = urlParts[productIndex + 1];
            } else if (userIndex !== -1 && urlParts[userIndex + 1]) {
              entityType = 'user';
              entityId = urlParts[userIndex + 1];
            } else if (couponIndex !== -1 && urlParts[couponIndex + 1]) {
              entityType = 'coupon';
              entityId = urlParts[couponIndex + 1];
            }

            await this.auditService.log({
              userId: user?.id || undefined,
              action: `${method} ${url}`,
              entityType: entityType || undefined,
              entityId: entityId || undefined,
              newValues: body,
              ipAddress: ip,
              userAgent: headers['user-agent'],
            });
          } catch (err) {
            console.error('AuditLogInterceptor logging error:', err);
          }
        },
      }),
    );
  }
}
