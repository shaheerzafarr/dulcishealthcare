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
exports.ShippingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipping_zone_entity_js_1 = require("./entities/shipping-zone.entity.js");
const shipping_rate_entity_js_1 = require("./entities/shipping-rate.entity.js");
const tax_rule_entity_js_1 = require("./entities/tax-rule.entity.js");
let ShippingService = class ShippingService {
    zoneRepo;
    rateRepo;
    taxRepo;
    constructor(zoneRepo, rateRepo, taxRepo) {
        this.zoneRepo = zoneRepo;
        this.rateRepo = rateRepo;
        this.taxRepo = taxRepo;
    }
    async findAllZones() {
        return this.zoneRepo.find({ relations: { rates: true } });
    }
    async findZoneById(id) {
        const zone = await this.zoneRepo.findOne({ where: { id }, relations: { rates: true } });
        if (!zone)
            throw new common_1.NotFoundException('Shipping zone not found');
        return zone;
    }
    async createZone(dto) {
        const zone = this.zoneRepo.create(dto);
        return this.zoneRepo.save(zone);
    }
    async updateZone(id, dto) {
        const zone = await this.findZoneById(id);
        Object.assign(zone, dto);
        return this.zoneRepo.save(zone);
    }
    async deleteZone(id) {
        const zone = await this.findZoneById(id);
        await this.zoneRepo.remove(zone);
    }
    async findAllRates() {
        return this.rateRepo.find({ relations: { zone: true } });
    }
    async findRateById(id) {
        const rate = await this.rateRepo.findOne({ where: { id }, relations: { zone: true } });
        if (!rate)
            throw new common_1.NotFoundException('Shipping rate not found');
        return rate;
    }
    async createRate(dto) {
        await this.findZoneById(dto.zoneId);
        const rate = this.rateRepo.create(dto);
        return this.rateRepo.save(rate);
    }
    async updateRate(id, dto) {
        const rate = await this.findRateById(id);
        Object.assign(rate, dto);
        return this.rateRepo.save(rate);
    }
    async deleteRate(id) {
        const rate = await this.findRateById(id);
        await this.rateRepo.remove(rate);
    }
    async findAllTaxes() {
        return this.taxRepo.find();
    }
    async findTaxById(id) {
        const rule = await this.taxRepo.findOne({ where: { id } });
        if (!rule)
            throw new common_1.NotFoundException('Tax rule not found');
        return rule;
    }
    async createTax(dto) {
        const rule = this.taxRepo.create(dto);
        return this.taxRepo.save(rule);
    }
    async updateTax(id, dto) {
        const rule = await this.findTaxById(id);
        Object.assign(rule, dto);
        return this.taxRepo.save(rule);
    }
    async deleteTax(id) {
        const rule = await this.findTaxById(id);
        await this.taxRepo.remove(rule);
    }
    async calculateTaxRate(country, state) {
        const match = await this.taxRepo.findOne({
            where: { country, state: state || undefined, isActive: true },
        });
        if (match)
            return Number(match.rate);
        const fallback = await this.taxRepo.findOne({
            where: { country, isActive: true },
        });
        return fallback ? Number(fallback.rate) : 0;
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shipping_zone_entity_js_1.ShippingZone)),
    __param(1, (0, typeorm_1.InjectRepository)(shipping_rate_entity_js_1.ShippingRate)),
    __param(2, (0, typeorm_1.InjectRepository)(tax_rule_entity_js_1.TaxRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map