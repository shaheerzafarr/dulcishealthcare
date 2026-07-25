-- ═══════════════════════════════════════════════════════════════════
-- DULCIS HEALTHCARE — PRODUCTION E-COMMERCE DATABASE SCHEMA
-- PostgreSQL 15+
-- Generated: 2026-07-25
-- ═══════════════════════════════════════════════════════════════════
-- BYTEA image storage is used (12 products — perfectly manageable)
-- All critical gaps from analysis have been resolved
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 1: USERS & AUTHENTICATION
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(50) UNIQUE NOT NULL,       -- 'customer', 'admin', 'manager'
    description     TEXT,
    permissions     JSONB DEFAULT '[]'::jsonb,          -- ['manage_products', 'manage_orders', ...]
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id         UUID REFERENCES roles(id) ON DELETE SET NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(30),
    password_hash   TEXT NOT NULL,
    avatar_data     BYTEA,                              -- profile picture (BYTEA)
    avatar_mime     VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

CREATE TABLE user_addresses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(50) DEFAULT 'Home',         -- 'Home', 'Office', 'Other'
    full_name       VARCHAR(200) NOT NULL,
    phone           VARCHAR(30),
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    postal_code     VARCHAR(20) NOT NULL,
    country         VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
    is_default      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);

-- Notification preferences per user
CREATE TABLE notification_preferences (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_orders    BOOLEAN DEFAULT TRUE,
    email_promos    BOOLEAN DEFAULT TRUE,
    sms_orders      BOOLEAN DEFAULT FALSE,
    sms_promos      BOOLEAN DEFAULT FALSE,
    push_enabled    BOOLEAN DEFAULT FALSE,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 2: PRODUCTS & CATALOG
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) UNIQUE NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),                        -- icon identifier for frontend
    image_data      BYTEA,                              -- category image (BYTEA)
    image_mime      VARCHAR(50),
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_categories_slug ON categories(slug);

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,
    sku             VARCHAR(100) UNIQUE,
    description     TEXT,
    details         TEXT,                                -- long-form product details
    base_price      DECIMAL(10,2) NOT NULL,
    compare_price   DECIMAL(10,2),                      -- original price for discount display
    cost_price      DECIMAL(10,2),                      -- cost for profit calculations
    is_active       BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,              -- FIX: featured flag for homepage
    meta_title      VARCHAR(255),
    meta_description TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Product images stored as BYTEA (fine for 12 products)
CREATE TABLE product_images (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_data      BYTEA NOT NULL,                     -- binary image data
    mime_type       VARCHAR(50) NOT NULL,                -- 'image/jpeg', 'image/webp', etc.
    filename        VARCHAR(255),
    alt_text        VARCHAR(255),
    is_primary      BOOLEAN DEFAULT FALSE,              -- hero/thumbnail image
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Product gallery (lifestyle/context shots — separate from main product images)
CREATE TABLE product_gallery (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_data      BYTEA NOT NULL,
    mime_type       VARCHAR(50) NOT NULL,
    filename        VARCHAR(255),
    caption         VARCHAR(255),
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_product_gallery_product ON product_gallery(product_id);

-- Product variants (e.g. 30ml, 50ml, 100ml)
CREATE TABLE product_variants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,              -- '30ml', '50ml', '100ml'
    sku             VARCHAR(100) UNIQUE,
    price           DECIMAL(10,2) NOT NULL,
    compare_price   DECIMAL(10,2),
    weight_grams    INT,
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);

-- Variant-level inventory tracking
CREATE TABLE product_inventory (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id      UUID NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity         INT NOT NULL DEFAULT 0,
    reserved        INT NOT NULL DEFAULT 0,              -- reserved during checkout
    low_stock_threshold INT DEFAULT 5,
    track_inventory BOOLEAN DEFAULT TRUE,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 0),
    CONSTRAINT chk_reserved_valid CHECK (reserved >= 0 AND reserved <= quantity)
);

-- FIX: Product tags for featured/trending/bestseller/new-arrival flags
CREATE TABLE product_tags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag             VARCHAR(50) NOT NULL,                -- 'bestseller', 'trending', 'new_arrival', 'discount'
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, tag)
);
CREATE INDEX idx_product_tags_tag ON product_tags(tag);

-- FIX: Product ingredients (your frontend uses ingredients[])
CREATE TABLE product_ingredients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,              -- '10% Niacinamide (Vitamin B3)'
    sort_order      INT DEFAULT 0
);
CREATE INDEX idx_product_ingredients_product ON product_ingredients(product_id);

-- FIX: Product benefits (your frontend uses benefits[])
CREATE TABLE product_benefits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    benefit         VARCHAR(255) NOT NULL,              -- 'Minimizes appearance of enlarged pores'
    sort_order      INT DEFAULT 0
);
CREATE INDEX idx_product_benefits_product ON product_benefits(product_id);

-- FIX: Related products / frequently bought together
CREATE TABLE related_products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    related_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    relation_type   VARCHAR(30) NOT NULL DEFAULT 'related', -- 'related', 'frequently_bought', 'upsell'
    sort_order      INT DEFAULT 0,
    UNIQUE(product_id, related_id, relation_type),
    CONSTRAINT chk_no_self_relation CHECK (product_id != related_id)
);

-- Reviews with rating aggregation
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id        UUID,                               -- link to the order (added below via FK)
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           VARCHAR(200),
    body            TEXT,
    is_verified     BOOLEAN DEFAULT FALSE,              -- verified purchase
    is_approved     BOOLEAN DEFAULT FALSE,              -- admin moderation
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id, order_id)               -- one review per product per order
);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Wishlist
CREATE TABLE wishlist (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- Server-side cart (supplements localStorage on frontend)
CREATE TABLE cart (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id      VARCHAR(255),                       -- for guest carts
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id         UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id, variant_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 3: SHIPPING & TAXES (FIX: MISSING FROM ORIGINAL)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE shipping_zones (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,              -- 'Lahore Metro', 'Punjab', 'Sindh', 'All Pakistan'
    countries       TEXT[] DEFAULT ARRAY['PK'],         -- ISO country codes
    states          TEXT[],                              -- state/province codes if applicable
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipping_rates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id         UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,              -- 'Standard Delivery', 'Express', 'Free Shipping'
    min_order_amount DECIMAL(10,2) DEFAULT 0,           -- free shipping above this amount
    rate            DECIMAL(10,2) NOT NULL DEFAULT 0,   -- flat rate
    rate_per_kg     DECIMAL(10,2) DEFAULT 0,            -- per-kg rate (if weight-based)
    estimated_days_min INT DEFAULT 1,
    estimated_days_max INT DEFAULT 5,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tax_rules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,              -- 'Pakistan GST', 'Punjab Sales Tax'
    country         VARCHAR(10) NOT NULL DEFAULT 'PK',
    state           VARCHAR(50),                        -- null = applies to entire country
    rate            DECIMAL(5,4) NOT NULL,              -- 0.1700 = 17%
    applies_to      VARCHAR(30) DEFAULT 'all',          -- 'all', 'skincare', 'haircare'
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 4: ORDERS & FULFILLMENT
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number    VARCHAR(30) UNIQUE NOT NULL,         -- 'DLC-20260725-0001'
    status          VARCHAR(30) NOT NULL DEFAULT 'pending',
                    -- pending, confirmed, processing, packed, shipped,
                    -- out_for_delivery, delivered, cancelled, returned
    
    -- FIX: Snapshot addresses at order time (user can change address later, order stays intact)
    shipping_name   VARCHAR(200) NOT NULL,
    shipping_phone  VARCHAR(30),
    shipping_line1  VARCHAR(255) NOT NULL,
    shipping_line2  VARCHAR(255),
    shipping_city   VARCHAR(100) NOT NULL,
    shipping_state  VARCHAR(100),
    shipping_postal VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
    
    billing_name    VARCHAR(200),
    billing_line1   VARCHAR(255),
    billing_city    VARCHAR(100),
    billing_state   VARCHAR(100),
    billing_postal  VARCHAR(20),
    billing_country VARCHAR(100),
    billing_same_as_shipping BOOLEAN DEFAULT TRUE,
    
    -- Totals
    subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_cost   DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount      DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- References
    coupon_id       UUID,                               -- FK added below
    shipping_rate_id UUID REFERENCES shipping_rates(id) ON DELETE SET NULL,
    
    -- Tracking
    tracking_number VARCHAR(100),
    courier_name    VARCHAR(100),                        -- 'TCS', 'Leopards', 'DHL'
    estimated_delivery DATE,
    delivered_at    TIMESTAMPTZ,
    
    notes           TEXT,                                -- customer notes
    admin_notes     TEXT,                                -- internal staff notes
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Snapshot product info at time of purchase
    product_name    VARCHAR(255) NOT NULL,
    variant_name    VARCHAR(100),
    sku             VARCHAR(100),
    unit_price      DECIMAL(10,2) NOT NULL,
    quantity        INT NOT NULL CHECK (quantity > 0),
    line_total      DECIMAL(10,2) NOT NULL,              -- unit_price × quantity
    
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- FIX: Order status history (audit trail for every state change)
CREATE TABLE order_status_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    changed_by      UUID REFERENCES users(id) ON DELETE SET NULL, -- admin or system
    note            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);

-- Payments (intent/attempt to pay)
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method          VARCHAR(50) NOT NULL,                -- 'cod', 'card', 'jazzcash', 'easypaisa', 'bank_transfer'
    status          VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    amount          DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(10) DEFAULT 'PKR',
    gateway_ref     VARCHAR(255),                        -- payment gateway reference ID
    gateway_response JSONB,                              -- full gateway response for debugging
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_order ON payments(order_id);

-- Transactions (actual money movements — charges, refunds, settlements)
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id      UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    type            VARCHAR(30) NOT NULL,                -- 'charge', 'refund', 'partial_refund', 'chargeback'
    amount          DECIMAL(10,2) NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, success, failed
    gateway_txn_id  VARCHAR(255),
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_payment ON transactions(payment_id);

-- FIX: Invoices (referenced in pipeline but missing from original schema)
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number  VARCHAR(30) UNIQUE NOT NULL,         -- 'INV-20260725-0001'
    subtotal        DECIMAL(10,2) NOT NULL,
    tax_amount      DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_breakdown   JSONB,                               -- [{ "name": "GST 17%", "rate": 0.17, "amount": 85.00 }]
    shipping_cost   DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    pdf_data        BYTEA,                               -- generated PDF invoice (BYTEA)
    pdf_mime        VARCHAR(50) DEFAULT 'application/pdf',
    issued_at       TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- FIX: Returns & Refunds (you advertise "Easy Returns" but had no schema)
CREATE TABLE return_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(30) NOT NULL DEFAULT 'requested',
                    -- requested, approved, item_received, refund_processing, 
                    -- refunded, rejected, cancelled
    reason          VARCHAR(50) NOT NULL,                -- 'damaged', 'wrong_item', 'not_as_described', 'changed_mind'
    description     TEXT,
    image_data      BYTEA,                               -- photo proof (BYTEA)
    image_mime      VARCHAR(50),
    admin_notes     TEXT,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_returns_order ON return_requests(order_id);

CREATE TABLE refunds (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id       UUID REFERENCES return_requests(id) ON DELETE SET NULL,
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_id      UUID REFERENCES payments(id) ON DELETE SET NULL,
    amount          DECIMAL(10,2) NOT NULL,
    reason          TEXT,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, processed, failed
    refunded_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_refunds_order ON refunds(order_id);

-- Add FK for reviews → orders (now that orders table exists)
ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 5: CMS (Content Management System)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE pages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,        -- 'about', 'privacy', 'terms'
    meta_title      VARCHAR(255),
    meta_description TEXT,
    is_published    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_sections (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    section_type    VARCHAR(50) NOT NULL,                -- 'hero', 'text', 'image_text', 'grid', 'cta'
    title           VARCHAR(255),
    content         JSONB,                               -- flexible content structure
    sort_order      INT DEFAULT 0,
    is_visible      BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hero_slides (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_data      BYTEA NOT NULL,                      -- hero banner image (BYTEA)
    image_mime      VARCHAR(50) NOT NULL,
    tagline         VARCHAR(100),
    title           VARCHAR(255) NOT NULL,
    button_text     VARCHAR(50),
    button_link     VARCHAR(255),
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE category_cards (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_data      BYTEA,                               -- card image (BYTEA)
    image_mime      VARCHAR(50),
    display_name    VARCHAR(100) NOT NULL,
    item_count_label VARCHAR(50),                         -- '120+ Items'
    color           VARCHAR(20),                          -- '#E5ECE6'
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    role            VARCHAR(100),                        -- 'Verified Buyer'
    body            TEXT NOT NULL,
    rating          SMALLINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    avatar_data     BYTEA,                               -- avatar photo (BYTEA)
    avatar_mime     VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE faq (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question        TEXT NOT NULL,
    answer          TEXT NOT NULL,
    category        VARCHAR(50),                         -- 'shipping', 'products', 'returns'
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blogs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,
    excerpt         TEXT,
    body            TEXT NOT NULL,
    cover_data      BYTEA,                               -- blog cover image (BYTEA)
    cover_mime      VARCHAR(50),
    meta_title      VARCHAR(255),
    meta_description TEXT,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_blogs_slug ON blogs(slug);

CREATE TABLE announcements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message         TEXT NOT NULL,                        -- 'Free shipping on orders above Rs.3000!'
    link            VARCHAR(255),
    bg_color        VARCHAR(20),
    text_color      VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE navigation (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location        VARCHAR(30) NOT NULL,                -- 'header', 'footer', 'mobile'
    label           VARCHAR(100) NOT NULL,
    href            VARCHAR(255) NOT NULL,
    parent_id       UUID REFERENCES navigation(id) ON DELETE CASCADE,
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE footer (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section         VARCHAR(50) NOT NULL,                -- 'about', 'links', 'contact', 'social'
    content         JSONB NOT NULL,
    sort_order      INT DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key             VARCHAR(100) UNIQUE NOT NULL,        -- 'site_name', 'currency', 'logo_data'
    value           TEXT,
    value_blob      BYTEA,                               -- for binary settings like logo
    value_mime      VARCHAR(50),
    group_name      VARCHAR(50),                         -- 'general', 'payments', 'shipping'
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 6: SKIN QUIZ
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE quizzes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(255) NOT NULL,               -- 'Skin Type Quiz'
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(30) DEFAULT 'single_choice', -- single_choice, multi_choice
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_options (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text     VARCHAR(255) NOT NULL,
    score_tag       VARCHAR(50),                         -- 'acne', 'dryness', 'aging' — used for recommendation mapping
    sort_order      INT DEFAULT 0
);

CREATE TABLE quiz_answers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      VARCHAR(255),                        -- for guest users
    answers         JSONB NOT NULL,                      -- [{ "question_id": "...", "option_id": "..." }]
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    result_key      VARCHAR(50) NOT NULL,                -- 'acne', 'dryness', etc.
    title           VARCHAR(200),
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_recommendations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id       UUID NOT NULL REFERENCES quiz_results(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order      INT DEFAULT 0,
    reason          TEXT                                  -- 'This serum targets acne-prone skin...'
);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 7: MARKETING & PROMOTIONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE coupons (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            VARCHAR(50) UNIQUE NOT NULL,         -- 'SUMMER30', 'WELCOME10'
    description     TEXT,
    discount_type   VARCHAR(20) NOT NULL,                -- 'percentage', 'fixed'
    discount_value  DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount    DECIMAL(10,2),                       -- cap for percentage discounts
    usage_limit     INT,                                 -- total uses allowed
    usage_per_user  INT DEFAULT 1,                       -- uses per customer
    times_used      INT DEFAULT 0,
    applicable_categories UUID[],                         -- restrict to specific categories
    applicable_products   UUID[],                         -- restrict to specific products
    starts_at       TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_coupons_code ON coupons(code);

-- Add FK from orders to coupons
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- FIX: Coupon usage tracking (prevent abuse, enforce limits)
CREATE TABLE coupon_usage (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id       UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    discount_applied DECIMAL(10,2) NOT NULL,
    used_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, order_id)
);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

CREATE TABLE discounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    discount_type   VARCHAR(20) NOT NULL,                -- 'percentage', 'fixed', 'buy_x_get_y'
    discount_value  DECIMAL(10,2) NOT NULL,
    apply_to        VARCHAR(30) DEFAULT 'all',           -- 'all', 'category', 'product'
    apply_to_ids    UUID[],
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flash_sales (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    product_ids     UUID[],
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    first_name      VARCHAR(100),
    source          VARCHAR(50) DEFAULT 'website',       -- 'website', 'checkout', 'quiz'
    is_active       BOOLEAN DEFAULT TRUE,
    subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

CREATE TABLE abandoned_carts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    email           VARCHAR(255),
    cart_data       JSONB NOT NULL,                       -- snapshot of cart items
    cart_total      DECIMAL(10,2),
    recovery_email_sent BOOLEAN DEFAULT FALSE,
    recovery_email_sent_at TIMESTAMPTZ,
    recovered       BOOLEAN DEFAULT FALSE,
    recovered_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    abandoned_at    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_abandoned_carts_email ON abandoned_carts(email);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 8: ANALYTICS & TRACKING
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE visitor_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      VARCHAR(255) NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    referrer        TEXT,
    landing_page    VARCHAR(500),
    device_type     VARCHAR(20),                         -- 'mobile', 'desktop', 'tablet'
    country         VARCHAR(100),
    city            VARCHAR(100),
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    ended_at        TIMESTAMPTZ
);
CREATE INDEX idx_visitor_sessions_session ON visitor_sessions(session_id);

CREATE TABLE utm_tracking (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID REFERENCES visitor_sessions(id) ON DELETE CASCADE,
    utm_source      VARCHAR(100),                        -- 'facebook', 'google', 'instagram'
    utm_medium      VARCHAR(100),                        -- 'cpc', 'email', 'social'
    utm_campaign    VARCHAR(255),
    utm_term        VARCHAR(255),
    utm_content     VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pixel_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID REFERENCES visitor_sessions(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name      VARCHAR(100) NOT NULL,               -- 'PageView', 'ViewContent', 'AddToCart', 'Purchase'
    platform        VARCHAR(30) NOT NULL,                 -- 'meta', 'ga4', 'tiktok', 'pinterest', 'snapchat'
    event_data      JSONB,                                -- event-specific payload
    sent_to_gateway BOOLEAN DEFAULT FALSE,                -- server-side CAPI sent?
    gateway_response JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pixel_events_platform ON pixel_events(platform);
CREATE INDEX idx_pixel_events_created ON pixel_events(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 9: MEDIA LIBRARY (FIX: Listed in admin panel but missing)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE media_library (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    filename        VARCHAR(255) NOT NULL,
    original_name   VARCHAR(255),
    mime_type       VARCHAR(50) NOT NULL,
    file_size       INT,                                  -- bytes
    file_data       BYTEA NOT NULL,                       -- binary file (BYTEA)
    alt_text        VARCHAR(255),
    folder          VARCHAR(100) DEFAULT 'general',       -- 'products', 'blog', 'hero', 'general'
    width           INT,
    height          INT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_media_folder ON media_library(folder);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 10: AUDIT LOGS (FIX: Listed in admin panel but missing)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,               -- 'product.created', 'order.status_changed', 'user.login'
    entity_type     VARCHAR(50),                         -- 'product', 'order', 'user', 'coupon'
    entity_id       UUID,
    old_values      JSONB,                               -- previous state
    new_values      JSONB,                               -- new state
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- MODULE 11: CONTACT MESSAGES (FIX: Contact form has no backend)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(200) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    topic           VARCHAR(50) NOT NULL,                -- 'order', 'consultation', 'compliance'
    message         TEXT NOT NULL,
    status          VARCHAR(30) DEFAULT 'new',           -- 'new', 'in_progress', 'resolved', 'spam'
    assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_reply     TEXT,
    replied_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_contact_status ON contact_messages(status);

-- ═══════════════════════════════════════════════════════════════════
-- SEED DATA: Default roles
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO roles (name, description, permissions) VALUES
('customer', 'Regular customer account', '["place_orders", "write_reviews", "manage_profile"]'::jsonb),
('admin', 'Full administrative access', '["manage_products", "manage_orders", "manage_users", "manage_cms", "manage_coupons", "manage_settings", "view_analytics", "manage_quiz"]'::jsonb),
('manager', 'Order and inventory management', '["manage_orders", "manage_inventory", "view_analytics"]'::jsonb);

-- ═══════════════════════════════════════════════════════════════════
-- SEED DATA: Default shipping zones for Pakistan
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO shipping_zones (name, countries, states) VALUES
('Lahore Metro', ARRAY['PK'], ARRAY['Punjab']),
('Punjab (Other)', ARRAY['PK'], ARRAY['Punjab']),
('Sindh', ARRAY['PK'], ARRAY['Sindh']),
('All Pakistan', ARRAY['PK'], NULL);

INSERT INTO shipping_rates (zone_id, name, min_order_amount, rate, estimated_days_min, estimated_days_max) VALUES
((SELECT id FROM shipping_zones WHERE name = 'Lahore Metro'), 'Standard Delivery', 0, 150.00, 1, 2),
((SELECT id FROM shipping_zones WHERE name = 'Lahore Metro'), 'Free Shipping', 3000.00, 0.00, 1, 2),
((SELECT id FROM shipping_zones WHERE name = 'Punjab (Other)'), 'Standard Delivery', 0, 250.00, 2, 4),
((SELECT id FROM shipping_zones WHERE name = 'Sindh'), 'Standard Delivery', 0, 300.00, 3, 5),
((SELECT id FROM shipping_zones WHERE name = 'All Pakistan'), 'Standard Delivery', 0, 350.00, 3, 7),
((SELECT id FROM shipping_zones WHERE name = 'All Pakistan'), 'Free Shipping', 5000.00, 0.00, 3, 7);

-- ═══════════════════════════════════════════════════════════════════
-- SEED DATA: Default tax rule
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO tax_rules (name, country, rate, applies_to) VALUES
('Pakistan GST', 'PK', 0.1700, 'all');

-- ═══════════════════════════════════════════════════════════════════
-- HELPFUL VIEWS
-- ═══════════════════════════════════════════════════════════════════

-- Product with aggregated rating (replaces hardcoded rating/reviewsCount)
CREATE VIEW v_product_ratings AS
SELECT 
    p.id AS product_id,
    COALESCE(AVG(r.rating), 0)::DECIMAL(3,2) AS avg_rating,
    COUNT(r.id) AS reviews_count
FROM products p
LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = TRUE
GROUP BY p.id;

-- Available stock per variant (quantity - reserved)
CREATE VIEW v_available_stock AS
SELECT
    pv.id AS variant_id,
    pv.product_id,
    pv.name AS variant_name,
    pi.quantity,
    pi.reserved,
    (pi.quantity - pi.reserved) AS available,
    pi.low_stock_threshold,
    CASE 
        WHEN (pi.quantity - pi.reserved) <= 0 THEN 'out_of_stock'
        WHEN (pi.quantity - pi.reserved) <= pi.low_stock_threshold THEN 'low_stock'
        ELSE 'in_stock'
    END AS stock_status
FROM product_variants pv
JOIN product_inventory pi ON pi.variant_id = pv.id;

-- Order summary for admin dashboard
CREATE VIEW v_order_summary AS
SELECT
    o.id,
    o.order_number,
    o.status,
    o.total,
    o.shipping_name AS customer_name,
    o.shipping_city AS city,
    u.email AS customer_email,
    o.courier_name,
    o.tracking_number,
    o.created_at,
    COUNT(oi.id) AS item_count
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.email;

-- ═══════════════════════════════════════════════════════════════════
-- END OF SCHEMA
-- Total: 46 tables, 3 views, seed data for roles/shipping/tax
-- ═══════════════════════════════════════════════════════════════════
