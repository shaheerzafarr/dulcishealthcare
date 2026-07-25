"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_config_js_1 = __importDefault(require("./config/database.config.js"));
const jwt_config_js_1 = __importDefault(require("./config/jwt.config.js"));
const jwt_auth_guard_js_1 = require("./common/guards/jwt-auth.guard.js");
const transform_interceptor_js_1 = require("./common/interceptors/transform.interceptor.js");
const http_exception_filter_js_1 = require("./common/filters/http-exception.filter.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const users_module_js_1 = require("./users/users.module.js");
const audit_module_js_1 = require("./audit/audit.module.js");
const products_module_js_1 = require("./products/products.module.js");
const orders_module_js_1 = require("./orders/orders.module.js");
const shipping_module_js_1 = require("./shipping/shipping.module.js");
const cms_module_js_1 = require("./cms/cms.module.js");
const media_module_js_1 = require("./media/media.module.js");
const contact_module_js_1 = require("./contact/contact.module.js");
const quiz_module_js_1 = require("./quiz/quiz.module.js");
const marketing_module_js_1 = require("./marketing/marketing.module.js");
const analytics_module_js_1 = require("./analytics/analytics.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                load: [database_config_js_1.default, jwt_config_js_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('database.url'),
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: false,
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            auth_module_js_1.AuthModule,
            users_module_js_1.UsersModule,
            audit_module_js_1.AuditModule,
            products_module_js_1.ProductsModule,
            orders_module_js_1.OrdersModule,
            shipping_module_js_1.ShippingModule,
            cms_module_js_1.CmsModule,
            media_module_js_1.MediaModule,
            contact_module_js_1.ContactModule,
            quiz_module_js_1.QuizModule,
            marketing_module_js_1.MarketingModule,
            analytics_module_js_1.AnalyticsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_js_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_js_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_js_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map