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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
const slugify_js_1 = require("../common/utils/slugify.js");
let CmsService = class CmsService {
    pageRepo;
    sectionRepo;
    slideRepo;
    cardRepo;
    testimonialRepo;
    faqRepo;
    blogRepo;
    announcementRepo;
    navRepo;
    footerRepo;
    settingRepo;
    constructor(pageRepo, sectionRepo, slideRepo, cardRepo, testimonialRepo, faqRepo, blogRepo, announcementRepo, navRepo, footerRepo, settingRepo) {
        this.pageRepo = pageRepo;
        this.sectionRepo = sectionRepo;
        this.slideRepo = slideRepo;
        this.cardRepo = cardRepo;
        this.testimonialRepo = testimonialRepo;
        this.faqRepo = faqRepo;
        this.blogRepo = blogRepo;
        this.announcementRepo = announcementRepo;
        this.navRepo = navRepo;
        this.footerRepo = footerRepo;
        this.settingRepo = settingRepo;
    }
    async findAllPages() {
        return this.pageRepo.find({ order: { title: 'ASC' } });
    }
    async findPageBySlug(slug) {
        const page = await this.pageRepo.findOne({
            where: { slug, isActive: true },
            relations: { sections: true },
            order: { sections: { sortOrder: 'ASC' } },
        });
        if (!page)
            throw new common_1.NotFoundException('Page not found');
        return page;
    }
    async createPage(dto) {
        const slug = (0, slugify_js_1.generateSlug)(dto.title);
        const existing = await this.pageRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Page slug already exists');
        const page = this.pageRepo.create({ ...dto, slug });
        return this.pageRepo.save(page);
    }
    async updatePage(id, dto) {
        const page = await this.pageRepo.findOne({ where: { id } });
        if (!page)
            throw new common_1.NotFoundException('Page not found');
        if (dto.title && dto.title !== page.title) {
            const slug = (0, slugify_js_1.generateSlug)(dto.title);
            const existing = await this.pageRepo.findOne({ where: { slug } });
            if (existing && existing.id !== id)
                throw new common_1.ConflictException('Page slug already exists');
            page.slug = slug;
        }
        Object.assign(page, dto);
        return this.pageRepo.save(page);
    }
    async deletePage(id) {
        const page = await this.pageRepo.findOne({ where: { id } });
        if (!page)
            throw new common_1.NotFoundException('Page not found');
        await this.pageRepo.remove(page);
    }
    async addPageSection(pageId, dto) {
        const section = this.sectionRepo.create({ ...dto, pageId });
        return this.sectionRepo.save(section);
    }
    async updatePageSection(sectionId, dto) {
        const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        Object.assign(section, dto);
        return this.sectionRepo.save(section);
    }
    async deletePageSection(sectionId) {
        const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        await this.sectionRepo.remove(section);
    }
    async findAllSlides(includeInactive = false) {
        const slides = await this.slideRepo.find({
            where: includeInactive ? {} : { isActive: true },
            order: { sortOrder: 'ASC' },
        });
        slides.forEach(s => delete s.imageData);
        return slides;
    }
    async findSlideById(id) {
        const slide = await this.slideRepo.findOne({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Slide not found');
        delete slide.imageData;
        return slide;
    }
    async getSlideRaw(id) {
        const slide = await this.slideRepo.findOne({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Slide not found');
        return { data: slide.imageData, mime: slide.imageMime };
    }
    async createSlide(dto, file) {
        const slide = this.slideRepo.create({
            ...dto,
            imageData: file.buffer,
            imageMime: file.mimetype,
        });
        const saved = await this.slideRepo.save(slide);
        delete saved.imageData;
        return saved;
    }
    async updateSlide(id, dto, file) {
        const slide = await this.slideRepo.findOne({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Slide not found');
        Object.assign(slide, dto);
        if (file) {
            slide.imageData = file.buffer;
            slide.imageMime = file.mimetype;
        }
        const saved = await this.slideRepo.save(slide);
        delete saved.imageData;
        return saved;
    }
    async deleteSlide(id) {
        const slide = await this.slideRepo.findOne({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Slide not found');
        await this.slideRepo.remove(slide);
    }
    async findAllCards() {
        return this.cardRepo.find({
            where: { isActive: true },
            relations: { category: true },
            order: { sortOrder: 'ASC' },
        });
    }
    async createCard(dto) {
        const card = this.cardRepo.create(dto);
        return this.cardRepo.save(card);
    }
    async updateCard(id, dto) {
        const card = await this.cardRepo.findOne({ where: { id } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        Object.assign(card, dto);
        return this.cardRepo.save(card);
    }
    async deleteCard(id) {
        const card = await this.cardRepo.findOne({ where: { id } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        await this.cardRepo.remove(card);
    }
    async findAllTestimonials() {
        const list = await this.testimonialRepo.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' },
        });
        list.forEach(t => delete t.avatarData);
        return list;
    }
    async findTestimonialById(id) {
        const testimonial = await this.testimonialRepo.findOne({ where: { id } });
        if (!testimonial)
            throw new common_1.NotFoundException('Testimonial not found');
        delete testimonial.avatarData;
        return testimonial;
    }
    async getTestimonialAvatarRaw(id) {
        const testimonial = await this.testimonialRepo.findOne({ where: { id } });
        if (!testimonial || !testimonial.avatarData)
            throw new common_1.NotFoundException('Avatar not found');
        return { data: testimonial.avatarData, mime: testimonial.avatarMime || 'image/jpeg' };
    }
    async createTestimonial(dto, file) {
        const t = this.testimonialRepo.create({
            ...dto,
            avatarData: file?.buffer || undefined,
            avatarMime: file?.mimetype || undefined,
        });
        const saved = await this.testimonialRepo.save(t);
        delete saved.avatarData;
        return saved;
    }
    async updateTestimonial(id, dto, file) {
        const t = await this.testimonialRepo.findOne({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Testimonial not found');
        Object.assign(t, dto);
        if (file) {
            t.avatarData = file.buffer;
            t.avatarMime = file.mimetype;
        }
        const saved = await this.testimonialRepo.save(t);
        delete saved.avatarData;
        return saved;
    }
    async deleteTestimonial(id) {
        const t = await this.testimonialRepo.findOne({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Testimonial not found');
        await this.testimonialRepo.remove(t);
    }
    async findAllFaqs() {
        return this.faqRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    }
    async createFaq(dto) {
        const faq = this.faqRepo.create(dto);
        return this.faqRepo.save(faq);
    }
    async updateFaq(id, dto) {
        const faq = await this.faqRepo.findOne({ where: { id } });
        if (!faq)
            throw new common_1.NotFoundException('FAQ not found');
        Object.assign(faq, dto);
        return this.faqRepo.save(faq);
    }
    async deleteFaq(id) {
        const faq = await this.faqRepo.findOne({ where: { id } });
        if (!faq)
            throw new common_1.NotFoundException('FAQ not found');
        await this.faqRepo.remove(faq);
    }
    async findAllBlogs(includeInactive = false) {
        const list = await this.blogRepo.find({
            where: includeInactive ? {} : { isActive: true },
            relations: { author: true },
            order: { createdAt: 'DESC' },
        });
        list.forEach(b => delete b.coverData);
        return list;
    }
    async findBlogBySlug(slug) {
        const post = await this.blogRepo.findOne({
            where: { slug, isActive: true },
            relations: { author: true },
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        delete post.coverData;
        return post;
    }
    async getBlogCoverRaw(id) {
        const post = await this.blogRepo.findOne({ where: { id } });
        if (!post || !post.coverData)
            throw new common_1.NotFoundException('Cover image not found');
        return { data: post.coverData, mime: post.coverMime || 'image/jpeg' };
    }
    async createBlog(dto, authorId, file) {
        const slug = (0, slugify_js_1.generateSlug)(dto.title);
        const existing = await this.blogRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Blog slug already exists');
        const post = this.blogRepo.create({
            ...dto,
            slug,
            authorId,
            coverData: file?.buffer || undefined,
            coverMime: file?.mimetype || undefined,
            publishedAt: dto.isActive ? new Date() : undefined,
        });
        const saved = await this.blogRepo.save(post);
        delete saved.coverData;
        return saved;
    }
    async updateBlog(id, dto, file) {
        const post = await this.blogRepo.findOne({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        if (dto.title && dto.title !== post.title) {
            const slug = (0, slugify_js_1.generateSlug)(dto.title);
            const existing = await this.blogRepo.findOne({ where: { slug } });
            if (existing && existing.id !== id)
                throw new common_1.ConflictException('Blog slug already exists');
            post.slug = slug;
        }
        Object.assign(post, dto);
        if (file) {
            post.coverData = file.buffer;
            post.coverMime = file.mimetype;
        }
        const saved = await this.blogRepo.save(post);
        delete saved.coverData;
        return saved;
    }
    async deleteBlog(id) {
        const post = await this.blogRepo.findOne({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        await this.blogRepo.remove(post);
    }
    async findAllAnnouncements() {
        return this.announcementRepo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }
    async createAnnouncement(dto) {
        const ann = this.announcementRepo.create(dto);
        return this.announcementRepo.save(ann);
    }
    async updateAnnouncement(id, dto) {
        const ann = await this.announcementRepo.findOne({ where: { id } });
        if (!ann)
            throw new common_1.NotFoundException('Announcement not found');
        Object.assign(ann, dto);
        return this.announcementRepo.save(ann);
    }
    async deleteAnnouncement(id) {
        const ann = await this.announcementRepo.findOne({ where: { id } });
        if (!ann)
            throw new common_1.NotFoundException('Announcement not found');
        await this.announcementRepo.remove(ann);
    }
    async findNavigation(location) {
        return this.navRepo.find({
            where: { location, parentId: undefined, isActive: true },
            relations: { children: true },
            order: { sortOrder: 'ASC', children: { sortOrder: 'ASC' } },
        });
    }
    async createNavigation(dto) {
        const nav = this.navRepo.create(dto);
        return this.navRepo.save(nav);
    }
    async updateNavigation(id, dto) {
        const nav = await this.navRepo.findOne({ where: { id } });
        if (!nav)
            throw new common_1.NotFoundException('Nav item not found');
        Object.assign(nav, dto);
        return this.navRepo.save(nav);
    }
    async deleteNavigation(id) {
        const nav = await this.navRepo.findOne({ where: { id } });
        if (!nav)
            throw new common_1.NotFoundException('Nav item not found');
        await this.navRepo.remove(nav);
    }
    async getFooter() {
        return this.footerRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    }
    async updateFooterSection(id, dto) {
        let section = await this.footerRepo.findOne({ where: { id } });
        if (!section) {
            section = this.footerRepo.create({ id });
        }
        Object.assign(section, dto);
        return this.footerRepo.save(section);
    }
    async getSettings(groupName) {
        const where = groupName ? { groupName } : {};
        return this.settingRepo.find({ where });
    }
    async getSettingValue(key) {
        const setting = await this.settingRepo.findOne({ where: { key } });
        return setting ? setting.value : null;
    }
    async updateSetting(key, value, groupName = 'general', description) {
        let setting = await this.settingRepo.findOne({ where: { key } });
        if (!setting) {
            setting = this.settingRepo.create({ key, value, groupName, description });
        }
        else {
            setting.value = value;
            if (description)
                setting.description = description;
        }
        return this.settingRepo.save(setting);
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_entity_js_1.Page)),
    __param(1, (0, typeorm_1.InjectRepository)(page_section_entity_js_1.PageSection)),
    __param(2, (0, typeorm_1.InjectRepository)(hero_slide_entity_js_1.HeroSlide)),
    __param(3, (0, typeorm_1.InjectRepository)(category_card_entity_js_1.CategoryCard)),
    __param(4, (0, typeorm_1.InjectRepository)(testimonial_entity_js_1.Testimonial)),
    __param(5, (0, typeorm_1.InjectRepository)(faq_entity_js_1.Faq)),
    __param(6, (0, typeorm_1.InjectRepository)(blog_entity_js_1.Blog)),
    __param(7, (0, typeorm_1.InjectRepository)(announcement_entity_js_1.Announcement)),
    __param(8, (0, typeorm_1.InjectRepository)(navigation_entity_js_1.Navigation)),
    __param(9, (0, typeorm_1.InjectRepository)(footer_entity_js_1.Footer)),
    __param(10, (0, typeorm_1.InjectRepository)(setting_entity_js_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CmsService);
//# sourceMappingURL=cms.service.js.map