"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const orders_service_js_1 = require("./orders.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const checkout_dto_js_1 = require("./dto/checkout.dto.js");
const order_status_dto_js_1 = require("./dto/order-status.dto.js");
const create_return_dto_js_1 = require("./dto/create-return.dto.js");
const pagination_dto_js_1 = require("../common/dto/pagination.dto.js");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    checkout(user, dto) {
        return this.ordersService.checkout(user.id, dto);
    }
    getMyOrders(user, paginationDto) {
        return this.ordersService.findMyOrders(user.id, paginationDto);
    }
    async getMyOrder(user, id) {
        const order = await this.ordersService.findOne(id);
        if (order.userId !== user.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    requestReturn(user, orderId, dto, file) {
        return this.ordersService.requestReturn(user.id, orderId, dto, file);
    }
    adminGetOrders(paginationDto, status) {
        return this.ordersService.findAll(paginationDto, status);
    }
    adminGetOrder(id) {
        return this.ordersService.findOne(id);
    }
    adminUpdateStatus(id, dto, user) {
        return this.ordersService.updateStatus(id, dto, user.id);
    }
    adminUpdateTracking(id, trackingData) {
        return this.ordersService.updateTracking(id, trackingData);
    }
    adminUpdateNotes(id, notes) {
        return this.ordersService.updateAdminNotes(id, notes);
    }
    adminCreateInvoice(orderId) {
        return this.ordersService.createInvoice(orderId);
    }
    adminGetInvoices() {
        return this.ordersService.findAllInvoices();
    }
    async serveInvoicePdf(invoiceId, res) {
        const file = await this.ordersService.getInvoicePdf(invoiceId);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    adminGetReturns() {
        return this.ordersService.findAllReturns();
    }
    async serveReturnProof(returnId, res) {
        const file = await this.ordersService.getReturnProofImage(returnId);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    adminUpdateReturnStatus(id, status, adminNotes) {
        return this.ordersService.updateReturnStatus(id, status, adminNotes);
    }
    adminProcessRefund(id, amount, reason, returnId) {
        return this.ordersService.processRefund(id, amount, reason, returnId);
    }
    adminGetRefunds() {
        return this.ordersService.findAllRefunds();
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Checkout cart and create order' }),
    (0, common_1.Post)('api/orders/checkout'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_js_1.CheckoutDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get current user orders' }),
    (0, common_1.Get)('api/orders'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_js_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get order details by ID' }),
    (0, common_1.Get)('api/orders/:id'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request return for delivered order' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.Post)('api/orders/:id/returns'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_return_dto_js_1.CreateReturnDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "requestReturn", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all orders (Admin)' }),
    (0, common_1.Get)('api/admin/orders'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminGetOrders", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details (Admin)' }),
    (0, common_1.Get)('api/admin/orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminGetOrder", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status and history timeline (Admin)' }),
    (0, common_1.Patch)('api/admin/orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_status_dto_js_1.OrderStatusDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminUpdateStatus", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Update courier tracking (Admin)' }),
    (0, common_1.Patch)('api/admin/orders/:id/tracking'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminUpdateTracking", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Update internal admin notes (Admin)' }),
    (0, common_1.Patch)('api/admin/orders/:id/notes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminUpdateNotes", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate invoice for order (Admin)' }),
    (0, common_1.Post)('api/admin/orders/:id/invoice'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminCreateInvoice", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all invoices (Admin)' }),
    (0, common_1.Get)('api/admin/invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminGetInvoices", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve raw invoice PDF (Admin)' }),
    (0, common_1.Get)('api/admin/invoices/:id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "serveInvoicePdf", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all returns (Admin)' }),
    (0, common_1.Get)('api/admin/returns'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminGetReturns", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve return proof photo (Admin)' }),
    (0, common_1.Get)('api/admin/returns/:id/proof'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "serveReturnProof", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve/Reject customer return request (Admin)' }),
    (0, common_1.Patch)('api/admin/returns/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('adminNotes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminUpdateReturnStatus", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Process refund for order (Admin)' }),
    (0, common_1.Post)('api/admin/orders/:id/refund'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('reason')),
    __param(3, (0, common_1.Body)('returnId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminProcessRefund", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all processed refunds (Admin)' }),
    (0, common_1.Get)('api/admin/refunds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminGetRefunds", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders & Fulfillment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [orders_service_js_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map