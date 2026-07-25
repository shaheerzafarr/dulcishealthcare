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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const quiz_service_js_1 = require("./quiz.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const pagination_dto_js_1 = require("../common/dto/pagination.dto.js");
let QuizController = class QuizController {
    quizService;
    jwtService;
    constructor(quizService, jwtService) {
        this.quizService = quizService;
        this.jwtService = jwtService;
    }
    getActiveQuiz() {
        return this.quizService.getActiveQuiz();
    }
    async submitQuiz(req, answers, sessionId) {
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const decoded = this.jwtService.decode(token);
                if (decoded && decoded.sub) {
                    userId = decoded.sub;
                }
            }
            catch (err) {
            }
        }
        return this.quizService.submitAnswers(userId, sessionId || null, answers);
    }
    adminGetQuizzes() {
        return this.quizService.findAllQuizzes();
    }
    adminCreateQuiz(dto) {
        return this.quizService.createQuiz(dto);
    }
    adminGetQuiz(id) {
        return this.quizService.findQuizById(id);
    }
    adminUpdateQuiz(id, dto) {
        return this.quizService.updateQuiz(id, dto);
    }
    adminDeleteQuiz(id) {
        return this.quizService.deleteQuiz(id);
    }
    adminAddQuestion(quizId, dto) {
        return this.quizService.addQuestion(quizId, dto);
    }
    adminUpdateQuestion(qId, dto) {
        return this.quizService.updateQuestion(qId, dto);
    }
    adminDeleteQuestion(qId) {
        return this.quizService.deleteQuestion(qId);
    }
    adminAddOption(qId, dto) {
        return this.quizService.addOption(qId, dto);
    }
    adminUpdateOption(oId, dto) {
        return this.quizService.updateOption(oId, dto);
    }
    adminDeleteOption(oId) {
        return this.quizService.deleteOption(oId);
    }
    adminGetResults(quizId) {
        return this.quizService.getResults(quizId);
    }
    adminCreateResult(quizId, dto) {
        return this.quizService.createResult(quizId, dto);
    }
    adminUpdateResult(rId, dto) {
        return this.quizService.updateResult(rId, dto);
    }
    adminDeleteResult(rId) {
        return this.quizService.deleteResult(rId);
    }
    adminAddRec(resultId, dto) {
        return this.quizService.addRecommendation(resultId, dto);
    }
    adminDeleteRec(recId) {
        return this.quizService.deleteRecommendation(recId);
    }
    adminGetSubmissions(paginationDto) {
        return this.quizService.getSubmissions(paginationDto);
    }
    adminGetStats() {
        return this.quizService.getSubmissionStats();
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active skin quiz with questions & options' }),
    (0, common_1.Get)('api/quiz/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getActiveQuiz", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit quiz answers & calculate targeted product suggestions' }),
    (0, common_1.Post)('api/quiz/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('answers')),
    __param(2, (0, common_1.Body)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submitQuiz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'List all quiz templates (Admin)' }),
    (0, common_1.Get)('api/admin/quiz'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminGetQuizzes", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new quiz template (Admin)' }),
    (0, common_1.Post)('api/admin/quiz'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminCreateQuiz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quiz details by ID (Admin)' }),
    (0, common_1.Get)('api/admin/quiz/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminGetQuiz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update quiz template details (Admin)' }),
    (0, common_1.Patch)('api/admin/quiz/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminUpdateQuiz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove quiz template (Admin)' }),
    (0, common_1.Delete)('api/admin/quiz/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminDeleteQuiz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create question under quiz (Admin)' }),
    (0, common_1.Post)('api/admin/quiz/:id/questions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminAddQuestion", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify question details (Admin)' }),
    (0, common_1.Patch)('api/admin/quiz/questions/:qId'),
    __param(0, (0, common_1.Param)('qId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminUpdateQuestion", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete question from quiz (Admin)' }),
    (0, common_1.Delete)('api/admin/quiz/questions/:qId'),
    __param(0, (0, common_1.Param)('qId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminDeleteQuestion", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create option under question (Admin)' }),
    (0, common_1.Post)('api/admin/quiz/questions/:qId/options'),
    __param(0, (0, common_1.Param)('qId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminAddOption", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify choice option details (Admin)' }),
    (0, common_1.Patch)('api/admin/quiz/options/:oId'),
    __param(0, (0, common_1.Param)('oId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminUpdateOption", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete option choice (Admin)' }),
    (0, common_1.Delete)('api/admin/quiz/options/:oId'),
    __param(0, (0, common_1.Param)('oId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminDeleteOption", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'List matching skin results mappings (Admin)' }),
    (0, common_1.Get)('api/admin/quiz/:id/results'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminGetResults", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create result skin mapping (Admin)' }),
    (0, common_1.Post)('api/admin/quiz/:id/results'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminCreateResult", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify skin result details (Admin)' }),
    (0, common_1.Patch)('api/admin/quiz/results/:rId'),
    __param(0, (0, common_1.Param)('rId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminUpdateResult", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove skin result (Admin)' }),
    (0, common_1.Delete)('api/admin/quiz/results/:rId'),
    __param(0, (0, common_1.Param)('rId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminDeleteResult", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Map product suggestion to skin result (Admin)' }),
    (0, common_1.Post)('api/admin/quiz/results/:rId/recommendations'),
    __param(0, (0, common_1.Param)('rId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminAddRec", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product suggestion (Admin)' }),
    (0, common_1.Delete)('api/admin/quiz/recommendations/:recId'),
    __param(0, (0, common_1.Param)('recId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminDeleteRec", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List customer submissions (Admin)' }),
    (0, common_1.Get)('api/admin/quiz/responses'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminGetSubmissions", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Skin quiz analytics stats (Admin)' }),
    (0, common_1.Get)('api/admin/quiz/responses/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "adminGetStats", null);
exports.QuizController = QuizController = __decorate([
    (0, swagger_1.ApiTags)('Skin Quiz'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [quiz_service_js_1.QuizService,
        jwt_1.JwtService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map