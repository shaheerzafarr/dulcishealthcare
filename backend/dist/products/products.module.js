"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_js_1 = require("./entities/product.entity.js");
const category_entity_js_1 = require("./entities/category.entity.js");
const product_image_entity_js_1 = require("./entities/product-image.entity.js");
const product_gallery_entity_js_1 = require("./entities/product-gallery.entity.js");
const product_variant_entity_js_1 = require("./entities/product-variant.entity.js");
const product_inventory_entity_js_1 = require("./entities/product-inventory.entity.js");
const product_tag_entity_js_1 = require("./entities/product-tag.entity.js");
const product_ingredient_entity_js_1 = require("./entities/product-ingredient.entity.js");
const product_benefit_entity_js_1 = require("./entities/product-benefit.entity.js");
const related_product_entity_js_1 = require("./entities/related-product.entity.js");
const review_entity_js_1 = require("./entities/review.entity.js");
const wishlist_entity_js_1 = require("./entities/wishlist.entity.js");
const cart_entity_js_1 = require("./entities/cart.entity.js");
const cart_item_entity_js_1 = require("./entities/cart-item.entity.js");
const products_service_js_1 = require("./products.service.js");
const products_controller_js_1 = require("./products.controller.js");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_js_1.Product,
                category_entity_js_1.Category,
                product_image_entity_js_1.ProductImage,
                product_gallery_entity_js_1.ProductGallery,
                product_variant_entity_js_1.ProductVariant,
                product_inventory_entity_js_1.ProductInventory,
                product_tag_entity_js_1.ProductTag,
                product_ingredient_entity_js_1.ProductIngredient,
                product_benefit_entity_js_1.ProductBenefit,
                related_product_entity_js_1.RelatedProduct,
                review_entity_js_1.Review,
                wishlist_entity_js_1.Wishlist,
                cart_entity_js_1.Cart,
                cart_item_entity_js_1.CartItem,
            ]),
        ],
        providers: [products_service_js_1.ProductsService],
        controllers: [products_controller_js_1.ProductsController],
        exports: [products_service_js_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map