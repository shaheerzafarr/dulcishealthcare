"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const quiz_entity_js_1 = require("./entities/quiz.entity.js");
const quiz_question_entity_js_1 = require("./entities/quiz-question.entity.js");
const quiz_option_entity_js_1 = require("./entities/quiz-option.entity.js");
const quiz_answer_entity_js_1 = require("./entities/quiz-answer.entity.js");
const quiz_result_entity_js_1 = require("./entities/quiz-result.entity.js");
const quiz_recommendation_entity_js_1 = require("./entities/quiz-recommendation.entity.js");
const quiz_service_js_1 = require("./quiz.service.js");
const quiz_controller_js_1 = require("./quiz.controller.js");
let QuizModule = class QuizModule {
};
exports.QuizModule = QuizModule;
exports.QuizModule = QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                quiz_entity_js_1.Quiz,
                quiz_question_entity_js_1.QuizQuestion,
                quiz_option_entity_js_1.QuizOption,
                quiz_answer_entity_js_1.QuizAnswer,
                quiz_result_entity_js_1.QuizResult,
                quiz_recommendation_entity_js_1.QuizRecommendation,
            ]),
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
        providers: [quiz_service_js_1.QuizService],
        controllers: [quiz_controller_js_1.QuizController],
        exports: [quiz_service_js_1.QuizService],
    })
], QuizModule);
//# sourceMappingURL=quiz.module.js.map