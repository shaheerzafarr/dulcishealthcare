"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_js_1 = require("./entities/order.entity.js");
const order_item_entity_js_1 = require("./entities/order-item.entity.js");
const order_status_history_entity_js_1 = require("./entities/order-status-history.entity.js");
const payment_entity_js_1 = require("./entities/payment.entity.js");
const transaction_entity_js_1 = require("./entities/transaction.entity.js");
const invoice_entity_js_1 = require("./entities/invoice.entity.js");
const return_request_entity_js_1 = require("./entities/return-request.entity.js");
const refund_entity_js_1 = require("./entities/refund.entity.js");
const orders_service_js_1 = require("./orders.service.js");
const orders_controller_js_1 = require("./orders.controller.js");
const products_module_js_1 = require("../products/products.module.js");
const shipping_module_js_1 = require("../shipping/shipping.module.js");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_js_1.Order,
                order_item_entity_js_1.OrderItem,
                order_status_history_entity_js_1.OrderStatusHistory,
                payment_entity_js_1.Payment,
                transaction_entity_js_1.Transaction,
                invoice_entity_js_1.Invoice,
                return_request_entity_js_1.ReturnRequest,
                refund_entity_js_1.Refund,
            ]),
            (0, common_1.forwardRef)(() => products_module_js_1.ProductsModule),
            shipping_module_js_1.ShippingModule,
        ],
        providers: [orders_service_js_1.OrdersService],
        controllers: [orders_controller_js_1.OrdersController],
        exports: [orders_service_js_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map