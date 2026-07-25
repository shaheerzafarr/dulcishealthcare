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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSection = void 0;
const typeorm_1 = require("typeorm");
const page_entity_js_1 = require("./page.entity.js");
let PageSection = class PageSection {
    id;
    pageId;
    page;
    type;
    content;
    sortOrder;
};
exports.PageSection = PageSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PageSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'page_id' }),
    __metadata("design:type", String)
], PageSection.prototype, "pageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => page_entity_js_1.Page, (page) => page.sections, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'page_id' }),
    __metadata("design:type", page_entity_js_1.Page)
], PageSection.prototype, "page", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], PageSection.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], PageSection.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], PageSection.prototype, "sortOrder", void 0);
exports.PageSection = PageSection = __decorate([
    (0, typeorm_1.Entity)('page_sections')
], PageSection);
//# sourceMappingURL=page-section.entity.js.map