"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const visitor_session_entity_js_1 = require("./entities/visitor-session.entity.js");
const utm_tracking_entity_js_1 = require("./entities/utm-tracking.entity.js");
const pixel_event_entity_js_1 = require("./entities/pixel-event.entity.js");
const analytics_service_js_1 = require("./analytics.service.js");
const analytics_controller_js_1 = require("./analytics.controller.js");
const cms_module_js_1 = require("../cms/cms.module.js");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                visitor_session_entity_js_1.VisitorSession,
                utm_tracking_entity_js_1.UtmTracking,
                pixel_event_entity_js_1.PixelEvent,
            ]),
            cms_module_js_1.CmsModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.expiresIn'),
                    },
                }),
            }),
        ],
        providers: [analytics_service_js_1.AnalyticsService],
        controllers: [analytics_controller_js_1.AnalyticsController],
        exports: [analytics_service_js_1.AnalyticsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map