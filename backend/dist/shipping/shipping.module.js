"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shipping_zone_entity_js_1 = require("./entities/shipping-zone.entity.js");
const shipping_rate_entity_js_1 = require("./entities/shipping-rate.entity.js");
const tax_rule_entity_js_1 = require("./entities/tax-rule.entity.js");
const shipping_service_js_1 = require("./shipping.service.js");
const shipping_controller_js_1 = require("./shipping.controller.js");
let ShippingModule = class ShippingModule {
};
exports.ShippingModule = ShippingModule;
exports.ShippingModule = ShippingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                shipping_zone_entity_js_1.ShippingZone,
                shipping_rate_entity_js_1.ShippingRate,
                tax_rule_entity_js_1.TaxRule,
            ]),
        ],
        providers: [shipping_service_js_1.ShippingService],
        controllers: [shipping_controller_js_1.ShippingController],
        exports: [shipping_service_js_1.ShippingService],
    })
], ShippingModule);
//# sourceMappingURL=shipping.module.js.map