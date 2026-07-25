import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity.js';
import { PageSection } from './entities/page-section.entity.js';
import { HeroSlide } from './entities/hero-slide.entity.js';
import { CategoryCard } from './entities/category-card.entity.js';
import { Testimonial } from './entities/testimonial.entity.js';
import { Faq } from './entities/faq.entity.js';
import { Blog } from './entities/blog.entity.js';
import { Announcement } from './entities/announcement.entity.js';
import { Navigation } from './entities/navigation.entity.js';
import { Footer } from './entities/footer.entity.js';
import { Setting } from './entities/setting.entity.js';
import { CmsService } from './cms.service.js';
import { CmsController } from './cms.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Page,
      PageSection,
      HeroSlide,
      CategoryCard,
      Testimonial,
      Faq,
      Blog,
      Announcement,
      Navigation,
      Footer,
      Setting,
    ]),
  ],
  providers: [CmsService],
  controllers: [CmsController],
  exports: [CmsService],
})
export class CmsModule {}
