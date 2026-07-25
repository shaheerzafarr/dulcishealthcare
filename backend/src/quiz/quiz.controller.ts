import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { QuizService } from './quiz.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Skin Quiz')
@Controller()
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================================
  // SHOPPER ROUTING (Public & Auth optional)
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'Get active skin quiz with questions & options' })
  @Get('api/quiz/active')
  getActiveQuiz() {
    return this.quizService.getActiveQuiz();
  }

  @Public()
  @ApiOperation({ summary: 'Submit quiz answers & calculate targeted product suggestions' })
  @Post('api/quiz/submit')
  async submitQuiz(
    @Req() req: any,
    @Body('answers') answers: any[],
    @Body('sessionId') sessionId?: string,
  ) {
    // Optionally check if authorization header is present and decode user
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && decoded.sub) {
          userId = decoded.sub;
        }
      } catch (err) {
        // Safe fallback to guest sessionId if JWT token is invalid/expired
      }
    }

    return this.quizService.submitAnswers(userId, sessionId || null, answers);
  }

  // ==========================================
  // ADMINISTRATIVE CONFIGURATION
  // ==========================================

  // --- Quizzes ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all quiz templates (Admin)' })
  @Get('api/admin/quiz')
  adminGetQuizzes() {
    return this.quizService.findAllQuizzes();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create new quiz template (Admin)' })
  @Post('api/admin/quiz')
  adminCreateQuiz(@Body() dto: any) {
    return this.quizService.createQuiz(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get quiz details by ID (Admin)' })
  @Get('api/admin/quiz/:id')
  adminGetQuiz(@Param('id') id: string) {
    return this.quizService.findQuizById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update quiz template details (Admin)' })
  @Patch('api/admin/quiz/:id')
  adminUpdateQuiz(@Param('id') id: string, @Body() dto: any) {
    return this.quizService.updateQuiz(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove quiz template (Admin)' })
  @Delete('api/admin/quiz/:id')
  adminDeleteQuiz(@Param('id') id: string) {
    return this.quizService.deleteQuiz(id);
  }

  // --- Questions ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create question under quiz (Admin)' })
  @Post('api/admin/quiz/:id/questions')
  adminAddQuestion(@Param('id') quizId: string, @Body() dto: any) {
    return this.quizService.addQuestion(quizId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify question details (Admin)' })
  @Patch('api/admin/quiz/questions/:qId')
  adminUpdateQuestion(@Param('qId') qId: string, @Body() dto: any) {
    return this.quizService.updateQuestion(qId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete question from quiz (Admin)' })
  @Delete('api/admin/quiz/questions/:qId')
  adminDeleteQuestion(@Param('qId') qId: string) {
    return this.quizService.deleteQuestion(qId);
  }

  // --- Options ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create option under question (Admin)' })
  @Post('api/admin/quiz/questions/:qId/options')
  adminAddOption(@Param('qId') qId: string, @Body() dto: any) {
    return this.quizService.addOption(qId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify choice option details (Admin)' })
  @Patch('api/admin/quiz/options/:oId')
  adminUpdateOption(@Param('oId') oId: string, @Body() dto: any) {
    return this.quizService.updateOption(oId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete option choice (Admin)' })
  @Delete('api/admin/quiz/options/:oId')
  adminDeleteOption(@Param('oId') oId: string) {
    return this.quizService.deleteOption(oId);
  }

  // --- Results & Scoring mapping ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List matching skin results mappings (Admin)' })
  @Get('api/admin/quiz/:id/results')
  adminGetResults(@Param('id') quizId: string) {
    return this.quizService.getResults(quizId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create result skin mapping (Admin)' })
  @Post('api/admin/quiz/:id/results')
  adminCreateResult(@Param('id') quizId: string, @Body() dto: any) {
    return this.quizService.createResult(quizId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify skin result details (Admin)' })
  @Patch('api/admin/quiz/results/:rId')
  adminUpdateResult(@Param('rId') rId: string, @Body() dto: any) {
    return this.quizService.updateResult(rId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove skin result (Admin)' })
  @Delete('api/admin/quiz/results/:rId')
  adminDeleteResult(@Param('rId') rId: string) {
    return this.quizService.deleteResult(rId);
  }

  // --- Recommendations ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Map product suggestion to skin result (Admin)' })
  @Post('api/admin/quiz/results/:rId/recommendations')
  adminAddRec(@Param('rId') resultId: string, @Body() dto: any) {
    return this.quizService.addRecommendation(resultId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete product suggestion (Admin)' })
  @Delete('api/admin/quiz/recommendations/:recId')
  adminDeleteRec(@Param('recId') recId: string) {
    return this.quizService.deleteRecommendation(recId);
  }

  // --- Analytics & Responses ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List customer submissions (Admin)' })
  @Get('api/admin/quiz/responses')
  adminGetSubmissions(@Query() paginationDto: PaginationDto) {
    return this.quizService.getSubmissions(paginationDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Skin quiz analytics stats (Admin)' })
  @Get('api/admin/quiz/responses/stats')
  adminGetStats() {
    return this.quizService.getSubmissionStats();
  }
}
