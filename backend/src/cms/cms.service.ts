import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
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
import { generateSlug } from '../common/utils/slugify.js';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Page) private pageRepo: Repository<Page>,
    @InjectRepository(PageSection) private sectionRepo: Repository<PageSection>,
    @InjectRepository(HeroSlide) private slideRepo: Repository<HeroSlide>,
    @InjectRepository(CategoryCard) private cardRepo: Repository<CategoryCard>,
    @InjectRepository(Testimonial) private testimonialRepo: Repository<Testimonial>,
    @InjectRepository(Faq) private faqRepo: Repository<Faq>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Announcement) private announcementRepo: Repository<Announcement>,
    @InjectRepository(Navigation) private navRepo: Repository<Navigation>,
    @InjectRepository(Footer) private footerRepo: Repository<Footer>,
    @InjectRepository(Setting) private settingRepo: Repository<Setting>,
  ) {}

  // ==========================================
  // PAGES & SECTIONS
  // ==========================================

  async findAllPages(): Promise<Page[]> {
    return this.pageRepo.find({ order: { title: 'ASC' } });
  }

  async findPageBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepo.findOne({
      where: { slug, isActive: true },
      relations: { sections: true },
      order: { sections: { sortOrder: 'ASC' } },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async createPage(dto: any): Promise<Page> {
    const slug = generateSlug(dto.title);
    const existing = await this.pageRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Page slug already exists');

    const page = this.pageRepo.create({ ...dto, slug } as DeepPartial<Page>);
    return this.pageRepo.save(page);
  }

  async updatePage(id: string, dto: any): Promise<Page> {
    const page = await this.pageRepo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');

    if (dto.title && dto.title !== page.title) {
      const slug = generateSlug(dto.title);
      const existing = await this.pageRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) throw new ConflictException('Page slug already exists');
      page.slug = slug;
    }
    Object.assign(page, dto);
    return this.pageRepo.save(page);
  }

  async deletePage(id: string): Promise<void> {
    const page = await this.pageRepo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    await this.pageRepo.remove(page);
  }

  async addPageSection(pageId: string, dto: any): Promise<PageSection> {
    const section = this.sectionRepo.create({ ...dto, pageId } as DeepPartial<PageSection>);
    return this.sectionRepo.save(section);
  }

  async updatePageSection(sectionId: string, dto: any): Promise<PageSection> {
    const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
    if (!section) throw new NotFoundException('Section not found');
    Object.assign(section, dto);
    return this.sectionRepo.save(section);
  }

  async deletePageSection(sectionId: string): Promise<void> {
    const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
    if (!section) throw new NotFoundException('Section not found');
    await this.sectionRepo.remove(section);
  }

  // ==========================================
  // HERO SLIDES (BYTEA images)
  // ==========================================

  async findAllSlides(includeInactive = false): Promise<HeroSlide[]> {
    const slides = await this.slideRepo.find({
      where: includeInactive ? {} : { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    slides.forEach(s => delete (s as any).imageData);
    return slides;
  }

  async findSlideById(id: string): Promise<HeroSlide> {
    const slide = await this.slideRepo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Slide not found');
    delete (slide as any).imageData;
    return slide;
  }

  async getSlideRaw(id: string): Promise<{ data: Buffer; mime: string }> {
    const slide = await this.slideRepo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Slide not found');
    return { data: slide.imageData, mime: slide.imageMime };
  }

  async createSlide(dto: any, file: Express.Multer.File): Promise<HeroSlide> {
    const slide = this.slideRepo.create({
      ...dto,
      imageData: file.buffer,
      imageMime: file.mimetype,
    } as DeepPartial<HeroSlide>);
    const saved = await this.slideRepo.save(slide);
    delete (saved as any).imageData;
    return saved;
  }

  async updateSlide(id: string, dto: any, file?: Express.Multer.File): Promise<HeroSlide> {
    const slide = await this.slideRepo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Slide not found');
    Object.assign(slide, dto);
    if (file) {
      slide.imageData = file.buffer;
      slide.imageMime = file.mimetype;
    }
    const saved = await this.slideRepo.save(slide);
    delete (saved as any).imageData;
    return saved;
  }

  async deleteSlide(id: string): Promise<void> {
    const slide = await this.slideRepo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Slide not found');
    await this.slideRepo.remove(slide);
  }

  // ==========================================
  // CATEGORY CARDS
  // ==========================================

  async findAllCards(): Promise<CategoryCard[]> {
    return this.cardRepo.find({
      where: { isActive: true },
      relations: { category: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createCard(dto: any): Promise<CategoryCard> {
    const card = this.cardRepo.create(dto as DeepPartial<CategoryCard>);
    return this.cardRepo.save(card);
  }

  async updateCard(id: string, dto: any): Promise<CategoryCard> {
    const card = await this.cardRepo.findOne({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');
    Object.assign(card, dto);
    return this.cardRepo.save(card);
  }

  async deleteCard(id: string): Promise<void> {
    const card = await this.cardRepo.findOne({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');
    await this.cardRepo.remove(card);
  }

  // ==========================================
  // TESTIMONIALS (BYTEA avatars)
  // ==========================================

  async findAllTestimonials(): Promise<Testimonial[]> {
    const list = await this.testimonialRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    list.forEach(t => delete (t as any).avatarData);
    return list;
  }

  async findTestimonialById(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepo.findOne({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    delete (testimonial as any).avatarData;
    return testimonial;
  }

  async getTestimonialAvatarRaw(id: string): Promise<{ data: Buffer; mime: string }> {
    const testimonial = await this.testimonialRepo.findOne({ where: { id } });
    if (!testimonial || !testimonial.avatarData) throw new NotFoundException('Avatar not found');
    return { data: testimonial.avatarData, mime: testimonial.avatarMime || 'image/jpeg' };
  }

  async createTestimonial(dto: any, file?: Express.Multer.File): Promise<Testimonial> {
    const t = this.testimonialRepo.create({
      ...dto,
      avatarData: file?.buffer || undefined,
      avatarMime: file?.mimetype || undefined,
    } as DeepPartial<Testimonial>);
    const saved = await this.testimonialRepo.save(t);
    delete (saved as any).avatarData;
    return saved;
  }

  async updateTestimonial(id: string, dto: any, file?: Express.Multer.File): Promise<Testimonial> {
    const t = await this.testimonialRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    Object.assign(t, dto);
    if (file) {
      t.avatarData = file.buffer;
      t.avatarMime = file.mimetype;
    }
    const saved = await this.testimonialRepo.save(t);
    delete (saved as any).avatarData;
    return saved;
  }

  async deleteTestimonial(id: string): Promise<void> {
    const t = await this.testimonialRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    await this.testimonialRepo.remove(t);
  }

  // ==========================================
  // FAQS
  // ==========================================

  async findAllFaqs(): Promise<Faq[]> {
    return this.faqRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }

  async createFaq(dto: any): Promise<Faq> {
    const faq = this.faqRepo.create(dto as DeepPartial<Faq>);
    return this.faqRepo.save(faq);
  }

  async updateFaq(id: string, dto: any): Promise<Faq> {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');
    Object.assign(faq, dto);
    return this.faqRepo.save(faq);
  }

  async deleteFaq(id: string): Promise<void> {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');
    await this.faqRepo.remove(faq);
  }

  // ==========================================
  // BLOG POSTS (BYTEA cover photos)
  // ==========================================

  async findAllBlogs(includeInactive = false): Promise<Blog[]> {
    const list = await this.blogRepo.find({
      where: includeInactive ? {} : { isActive: true },
      relations: { author: true },
      order: { createdAt: 'DESC' },
    });
    list.forEach(b => delete (b as any).coverData);
    return list;
  }

  async findBlogBySlug(slug: string): Promise<Blog> {
    const post = await this.blogRepo.findOne({
      where: { slug, isActive: true },
      relations: { author: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    delete (post as any).coverData;
    return post;
  }

  async getBlogCoverRaw(id: string): Promise<{ data: Buffer; mime: string }> {
    const post = await this.blogRepo.findOne({ where: { id } });
    if (!post || !post.coverData) throw new NotFoundException('Cover image not found');
    return { data: post.coverData, mime: post.coverMime || 'image/jpeg' };
  }

  async createBlog(dto: any, authorId: string, file?: Express.Multer.File): Promise<Blog> {
    const slug = generateSlug(dto.title);
    const existing = await this.blogRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Blog slug already exists');

    const post = this.blogRepo.create({
      ...dto,
      slug,
      authorId,
      coverData: file?.buffer || undefined,
      coverMime: file?.mimetype || undefined,
      publishedAt: dto.isActive ? new Date() : undefined,
    } as DeepPartial<Blog>);
    const saved = await this.blogRepo.save(post);
    delete (saved as any).coverData;
    return saved;
  }

  async updateBlog(id: string, dto: any, file?: Express.Multer.File): Promise<Blog> {
    const post = await this.blogRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    if (dto.title && dto.title !== post.title) {
      const slug = generateSlug(dto.title);
      const existing = await this.blogRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) throw new ConflictException('Blog slug already exists');
      post.slug = slug;
    }
    Object.assign(post, dto);
    if (file) {
      post.coverData = file.buffer;
      post.coverMime = file.mimetype;
    }
    const saved = await this.blogRepo.save(post);
    delete (saved as any).coverData;
    return saved;
  }

  async deleteBlog(id: string): Promise<void> {
    const post = await this.blogRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    await this.blogRepo.remove(post);
  }

  // ==========================================
  // ANNOUNCEMENTS
  // ==========================================

  async findAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementRepo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  async createAnnouncement(dto: any): Promise<Announcement> {
    const ann = this.announcementRepo.create(dto as DeepPartial<Announcement>);
    return this.announcementRepo.save(ann);
  }

  async updateAnnouncement(id: string, dto: any): Promise<Announcement> {
    const ann = await this.announcementRepo.findOne({ where: { id } });
    if (!ann) throw new NotFoundException('Announcement not found');
    Object.assign(ann, dto);
    return this.announcementRepo.save(ann);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const ann = await this.announcementRepo.findOne({ where: { id } });
    if (!ann) throw new NotFoundException('Announcement not found');
    await this.announcementRepo.remove(ann);
  }

  // ==========================================
  // NAVIGATION MENUS
  // ==========================================

  async findNavigation(location: string): Promise<Navigation[]> {
    return this.navRepo.find({
      where: { location, parentId: undefined as any, isActive: true },
      relations: { children: true },
      order: { sortOrder: 'ASC', children: { sortOrder: 'ASC' } },
    });
  }

  async createNavigation(dto: any): Promise<Navigation> {
    const nav = this.navRepo.create(dto as DeepPartial<Navigation>);
    return this.navRepo.save(nav);
  }

  async updateNavigation(id: string, dto: any): Promise<Navigation> {
    const nav = await this.navRepo.findOne({ where: { id } });
    if (!nav) throw new NotFoundException('Nav item not found');
    Object.assign(nav, dto);
    return this.navRepo.save(nav);
  }

  async deleteNavigation(id: string): Promise<void> {
    const nav = await this.navRepo.findOne({ where: { id } });
    if (!nav) throw new NotFoundException('Nav item not found');
    await this.navRepo.remove(nav);
  }

  // ==========================================
  // FOOTER SECTIONS
  // ==========================================

  async getFooter(): Promise<Footer[]> {
    return this.footerRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }

  async updateFooterSection(id: string, dto: any): Promise<Footer> {
    let section = await this.footerRepo.findOne({ where: { id } });
    if (!section) {
      section = this.footerRepo.create({ id } as DeepPartial<Footer>);
    }
    Object.assign(section, dto);
    return this.footerRepo.save(section);
  }

  // ==========================================
  // SETTINGS (Key-Value general/pixels configs)
  // ==========================================

  async getSettings(groupName?: string): Promise<Setting[]> {
    const where = groupName ? { groupName } : {};
    return this.settingRepo.find({ where });
  }

  async getSettingValue(key: string): Promise<string | null> {
    const setting = await this.settingRepo.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  async updateSetting(key: string, value: string, groupName = 'general', description?: string): Promise<Setting> {
    let setting = await this.settingRepo.findOne({ where: { key } });
    if (!setting) {
      setting = this.settingRepo.create({ key, value, groupName, description });
    } else {
      setting.value = value;
      if (description) setting.description = description;
    }
    return this.settingRepo.save(setting);
  }
}
