"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const page_entity_js_1 = require("./entities/page.entity.js");
const page_section_entity_js_1 = require("./entities/page-section.entity.js");
const hero_slide_entity_js_1 = require("./entities/hero-slide.entity.js");
const category_card_entity_js_1 = require("./entities/category-card.entity.js");
const testimonial_entity_js_1 = require("./entities/testimonial.entity.js");
const faq_entity_js_1 = require("./entities/faq.entity.js");
const blog_entity_js_1 = require("./entities/blog.entity.js");
const announcement_entity_js_1 = require("./entities/announcement.entity.js");
const navigation_entity_js_1 = require("./entities/navigation.entity.js");
const footer_entity_js_1 = require("./entities/footer.entity.js");
const setting_entity_js_1 = require("./entities/setting.entity.js");
const cms_service_js_1 = require("./cms.service.js");
const cms_controller_js_1 = require("./cms.controller.js");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                page_entity_js_1.Page,
                page_section_entity_js_1.PageSection,
                hero_slide_entity_js_1.HeroSlide,
                category_card_entity_js_1.CategoryCard,
                testimonial_entity_js_1.Testimonial,
                faq_entity_js_1.Faq,
                blog_entity_js_1.Blog,
                announcement_entity_js_1.Announcement,
                navigation_entity_js_1.Navigation,
                footer_entity_js_1.Footer,
                setting_entity_js_1.Setting,
            ]),
        ],
        providers: [cms_service_js_1.CmsService],
        controllers: [cms_controller_js_1.CmsController],
        exports: [cms_service_js_1.CmsService],
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map