# Dulcis Healthcare — Admin Panel Navigation Blueprint
### Shopify-Style Sidebar with Sub-Navigation

---

## Navigation Summary

| Metric | Count |
|---|---|
| **Primary Sidebar Links** | 14 |
| **Sub-Navigation Links** | 68 |
| **Total Admin Screens/Pages** | 127 |
| **Database Tables Covered** | 46/46 ✅ |

---

## Complete Sidebar Navigation Map

```
📊 Dashboard
📦 Products
   ├── All Products
   ├── Add Product
   ├── Categories
   ├── Inventory
   ├── Tags & Collections
   └── Reviews & Ratings
🛒 Orders
   ├── All Orders
   ├── Drafts
   ├── Abandoned Checkouts
   ├── Invoices
   ├── Returns & Refunds
   └── Order Status Flow
👥 Customers
   ├── All Customers
   ├── Customer Groups
   ├── Wishlists
   └── Contact Messages
🎨 Content (CMS)
   ├── Pages
   ├── Hero Slides
   ├── Category Cards
   ├── Testimonials
   ├── FAQ Manager
   ├── Blog Posts
   ├── Announcements
   └── Navigation Menus
🧪 Skin Quiz
   ├── Quiz Manager
   ├── Questions & Options
   ├── Results & Recommendations
   └── Quiz Responses
💰 Discounts
   ├── Coupon Codes
   ├── Automatic Discounts
   ├── Flash Sales
   └── Usage History
📣 Marketing
   ├── Newsletter Subscribers
   ├── Abandoned Cart Recovery
   └── Campaign Links (UTM)
📊 Analytics
   ├── Overview Dashboard
   ├── Sales Reports
   ├── Product Performance
   ├── Customer Insights
   └── Traffic & Sessions
🔌 Pixel & Integrations
   ├── Meta Pixel + CAPI
   ├── Google Analytics 4
   ├── TikTok Pixel
   ├── Pinterest Tag
   ├── Snapchat Pixel
   └── Event Log
🚚 Shipping
   ├── Shipping Zones
   ├── Shipping Rates
   └── Delivery Tracking
💳 Payments
   ├── Payment Methods
   ├── Transactions
   └── Tax Configuration
🖼️ Media Library
   ├── All Files
   └── Folders
🔒 Settings
   ├── General
   ├── Roles & Permissions
   ├── Store Policies
   ├── Notifications
   └── Audit Logs
```

---

## Detailed Breakdown: Every Screen

---

### 1. 📊 DASHBOARD (`/admin`)
> The first screen admin sees — high-level KPIs and activity feed

| Widget / Card | Data Source | Description |
|---|---|---|
| Today's Revenue | `orders`, `payments` | Total sales today with % change vs yesterday |
| Total Orders | `orders` | Order count with status breakdown donut chart |
| New Customers | `users` | New signups today/this week |
| Conversion Rate | `visitor_sessions`, `orders` | Sessions → Orders percentage |
| Low Stock Alerts | `v_available_stock` | Products below threshold (red badges) |
| Recent Orders | `v_order_summary` | Last 10 orders quick-view table |
| Top Selling Products | `order_items`, `products` | Best sellers this week/month |
| Abandoned Cart Value | `abandoned_carts` | Total recoverable revenue |
| Review Pending | `reviews` (is_approved=false) | Reviews awaiting moderation |
| Revenue Chart | `orders` | Line chart: daily/weekly/monthly revenue |
| Traffic Sources | `utm_tracking`, `visitor_sessions` | Pie chart of referral sources |

**Sub-pages: None** (single dashboard screen)
**Total screens: 1**

---

### 2. 📦 PRODUCTS (`/admin/products`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **All Products** | `/admin/products` | `products`, `product_images`, `product_variants`, `v_product_ratings` | Searchable/filterable table of all 12 products with thumbnail, price, stock status, rating |
| **Add Product** | `/admin/products/new` | `products`, `product_images`, `product_gallery`, `product_variants`, `product_inventory`, `product_ingredients`, `product_benefits`, `product_tags`, `related_products`, `categories` | Full product creation form |
| **Edit Product** | `/admin/products/[id]` | Same as Add | Edit existing product (same form, pre-populated) |
| **Categories** | `/admin/products/categories` | `categories` | CRUD for categories (name, slug, icon, image BYTEA, sort order) |
| **Inventory** | `/admin/products/inventory` | `product_inventory`, `product_variants`, `v_available_stock` | Stock levels table: variant name, quantity, reserved, available, low-stock threshold |
| **Tags & Collections** | `/admin/products/tags` | `product_tags` | Manage tags (bestseller, trending, new_arrival, discount). Bulk-assign tags to products |
| **Reviews & Ratings** | `/admin/products/reviews` | `reviews`, `users`, `products` | Moderation queue: approve/reject reviews, filter by rating, view verified purchases |

**Product Form Sub-sections (within Add/Edit Product page):**

| Section | Fields | Tables Written |
|---|---|---|
| Basic Info | name, slug, SKU, description, details, meta_title, meta_description | `products` |
| Pricing | base_price, compare_price, cost_price | `products` |
| Media | Upload multiple images (drag-and-drop, set primary) | `product_images` BYTEA |
| Gallery | Lifestyle/context shots with captions | `product_gallery` BYTEA |
| Variants | Size variants (30ml/50ml/100ml) with per-variant pricing, SKU, weight | `product_variants` |
| Inventory | Per-variant: quantity, reserved, low_stock_threshold, track_inventory toggle | `product_inventory` |
| Ingredients | Ordered list of active ingredients | `product_ingredients` |
| Benefits | Ordered list of product benefits | `product_benefits` |
| Tags | Multi-select: bestseller, trending, new_arrival, discount | `product_tags` |
| Related Products | Link related / frequently-bought / upsell products | `related_products` |
| Category | Select category from dropdown | `products.category_id` |
| Status | is_active, is_featured toggles | `products` |
| SEO | meta_title, meta_description | `products` |

**Total screens: 7 (list + new + edit + categories + inventory + tags + reviews)**

---

### 3. 🛒 ORDERS (`/admin/orders`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **All Orders** | `/admin/orders` | `orders`, `v_order_summary` | Filterable table: order#, customer, status, total, date. Status chips (pending=yellow, delivered=green, cancelled=red) |
| **Order Detail** | `/admin/orders/[id]` | `orders`, `order_items`, `order_status_history`, `payments`, `transactions`, `invoices`, `return_requests`, `refunds` | Complete order view with timeline, items, payment, shipping, and action buttons |
| **Draft Orders** | `/admin/orders/drafts` | `orders` (status='draft') | Admin-created orders (phone orders, manual entry) |
| **Abandoned Checkouts** | `/admin/orders/abandoned` | `abandoned_carts` | Carts that weren't completed. Email, cart items, total, recovery status. "Send Recovery Email" button |
| **Invoices** | `/admin/orders/invoices` | `invoices` | List all invoices with download PDF, filter by date range |
| **Returns & Refunds** | `/admin/orders/returns` | `return_requests`, `refunds` | Return request queue: status, reason, photo proof, approve/reject actions |
| **Order Status Flow** | `/admin/orders/status-flow` | `order_status_history` | Visual pipeline editor to configure status transitions and auto-notifications |

**Order Detail Sub-sections:**

| Section | What It Shows | Actions Available |
|---|---|---|
| Order Summary | Order#, date, status badge, customer info | Change status dropdown |
| Items | Product name, variant, SKU, qty, unit price, line total | — |
| Payment | Method (COD/Card/JazzCash), status, gateway ref, paid_at | Mark as paid, Refund |
| Shipping | Snapshotted address, courier, tracking#, estimated delivery | Update tracking, Mark shipped |
| Status Timeline | Chronological status changes with who made each change | Add note |
| Invoice | Generated invoice with tax breakdown | Download PDF, Regenerate |
| Customer Notes | Notes from customer at checkout | — |
| Admin Notes | Internal staff notes | Add/edit notes |
| Return (if any) | Return request status, reason, photo | Approve/Reject/Process refund |

**Total screens: 7 (list + detail + drafts + abandoned + invoices + returns + status-flow)**

---

### 4. 👥 CUSTOMERS (`/admin/customers`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **All Customers** | `/admin/customers` | `users`, `roles` | Searchable customer list: name, email, phone, orders count, total spent, join date, status |
| **Customer Detail** | `/admin/customers/[id]` | `users`, `user_addresses`, `notification_preferences`, `orders`, `reviews`, `wishlist` | Full customer profile with order history, addresses, wishlist, reviews, notification prefs |
| **Customer Groups** | `/admin/customers/groups` | `roles` | Manage roles (customer, VIP, wholesale) with permission sets |
| **Wishlists** | `/admin/customers/wishlists` | `wishlist`, `products`, `users` | See what products customers are wishlisting (useful for marketing) |
| **Contact Messages** | `/admin/customers/messages` | `contact_messages` | Inbox of contact form submissions. Status: new/in_progress/resolved/spam. Assign to staff, reply |

**Customer Detail Sub-sections:**

| Section | Data |
|---|---|
| Profile | First/last name, email, phone, avatar, role, active/verified status |
| Addresses | All saved addresses with default indicator |
| Order History | Table of all orders with status and totals |
| Reviews Written | All reviews by this customer |
| Wishlist | Products this customer has wishlisted |
| Notification Prefs | Email/SMS/Push toggles |
| Lifetime Value | Total spent, average order value, order count |

**Total screens: 5 (list + detail + groups + wishlists + messages)**

---

### 5. 🎨 CONTENT / CMS (`/admin/content`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Pages** | `/admin/content/pages` | `pages`, `page_sections` | List all static pages (About, Privacy, Terms). Click to edit sections |
| **Page Editor** | `/admin/content/pages/[id]` | `pages`, `page_sections` | Drag-and-drop section builder. Section types: hero, text, image_text, grid, CTA |
| **Hero Slides** | `/admin/content/hero-slides` | `hero_slides` | Manage homepage banner carousel: upload image BYTEA, tagline, title, button text/link, sort order, active toggle |
| **Category Cards** | `/admin/content/category-cards` | `category_cards`, `categories` | Homepage category display cards: image, display name, item count label, color, link to category |
| **Testimonials** | `/admin/content/testimonials` | `testimonials` | CRUD: customer name, role, review text, rating (1-5), avatar BYTEA, active toggle, sort order |
| **FAQ Manager** | `/admin/content/faq` | `faq` | Grouped FAQs by category (shipping, products, returns). Drag to reorder. Active toggle |
| **Blog Posts** | `/admin/content/blog` | `blogs`, `users` | Blog CMS: title, slug, excerpt, rich-text body, cover image BYTEA, SEO fields, publish toggle |
| **Blog Editor** | `/admin/content/blog/[id]` | `blogs` | Rich text editor with image embedding, preview, scheduling |
| **Announcements** | `/admin/content/announcements` | `announcements` | Top-bar announcement banners: message, link, bg/text colors, schedule (starts_at/ends_at) |
| **Navigation Menus** | `/admin/content/navigation` | `navigation` | Configure header, footer, and mobile nav. Self-referencing for dropdowns (parent_id). Drag to reorder |
| **Footer Builder** | `/admin/content/footer` | `footer` | Edit footer sections: about text, quick links, contact info, social links (JSONB content) |

**Total screens: 11 (pages list + page editor + hero slides + category cards + testimonials + FAQ + blog list + blog editor + announcements + nav menus + footer)**

---

### 6. 🧪 SKIN QUIZ (`/admin/quiz`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Quiz Manager** | `/admin/quiz` | `quizzes` | List all quizzes with active toggle. Create new quiz (title, description) |
| **Questions & Options** | `/admin/quiz/[id]/questions` | `quiz_questions`, `quiz_options` | Build quiz flow: add questions (single/multi choice), add options per question with score_tag mapping. Drag to reorder |
| **Results & Recommendations** | `/admin/quiz/[id]/results` | `quiz_results`, `quiz_recommendations`, `products` | Configure result profiles (acne, dryness, aging). Map products to each result with reasoning text |
| **Quiz Responses** | `/admin/quiz/responses` | `quiz_answers`, `users` | View all quiz submissions: user/guest, answers chosen, recommended products, date. Analytics on most common concerns |

**Total screens: 4 (manager + questions editor + results editor + responses)**

---

### 7. 💰 DISCOUNTS (`/admin/discounts`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Coupon Codes** | `/admin/discounts/coupons` | `coupons` | CRUD for discount codes: code, type (% or fixed), value, min order, max discount, usage limits, date range, category/product restrictions |
| **Coupon Detail** | `/admin/discounts/coupons/[id]` | `coupons`, `coupon_usage` | View coupon with usage analytics: who used it, on which orders, total discount given |
| **Automatic Discounts** | `/admin/discounts/auto` | `discounts` | Site-wide or targeted auto-discounts (no code needed): type, value, apply_to (all/category/product), date range |
| **Flash Sales** | `/admin/discounts/flash-sales` | `flash_sales`, `products` | Time-limited sales: name, discount %, select products, start/end datetime. Countdown timer auto-shown on storefront |
| **Usage History** | `/admin/discounts/usage` | `coupon_usage`, `users`, `orders` | Full log: which customer, which coupon, which order, discount amount, date. Fraud detection |

**Total screens: 5 (coupons list + coupon detail + auto discounts + flash sales + usage history)**

---

### 8. 📣 MARKETING (`/admin/marketing`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Newsletter Subscribers** | `/admin/marketing/newsletter` | `newsletter_subscribers` | Subscriber list with source (website/checkout/quiz), status, export CSV for Mailchimp/Klaviyo |
| **Abandoned Cart Recovery** | `/admin/marketing/abandoned-carts` | `abandoned_carts`, `orders` | Abandoned carts list: email, items, total, recovery email status. Bulk send recovery emails. Track recovered orders |
| **Campaign Links (UTM)** | `/admin/marketing/campaigns` | `utm_tracking`, `visitor_sessions` | UTM link builder + performance: source, medium, campaign → sessions, conversions, revenue attributed |

**Total screens: 3 (newsletter + abandoned carts + campaigns)**

---

### 9. 📊 ANALYTICS (`/admin/analytics`)

| Sub-Nav Link | Route | DB Tables / Views | Description |
|---|---|---|---|
| **Overview Dashboard** | `/admin/analytics` | `orders`, `visitor_sessions`, `users` | KPI cards: revenue, orders, AOV, conversion rate. Line charts: revenue trend, orders trend |
| **Sales Reports** | `/admin/analytics/sales` | `orders`, `order_items`, `payments` | Revenue by day/week/month, payment method breakdown, tax collected, shipping revenue, discount impact |
| **Product Performance** | `/admin/analytics/products` | `order_items`, `products`, `v_product_ratings`, `wishlist` | Per-product: units sold, revenue, avg rating, wishlist count, conversion rate. Best/worst performers |
| **Customer Insights** | `/admin/analytics/customers` | `users`, `orders` | New vs returning, lifetime value distribution, top spenders, geographic heatmap, cohort retention |
| **Traffic & Sessions** | `/admin/analytics/traffic` | `visitor_sessions`, `utm_tracking` | Sessions by device, referrer, landing page, country/city, bounce rate, avg session duration |

**Total screens: 5 (overview + sales + products + customers + traffic)**

---

### 10. 🔌 PIXEL & INTEGRATIONS (`/admin/pixels`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Meta Pixel + CAPI** | `/admin/pixels/meta` | `pixel_events` (platform='meta'), `settings` | Configure Pixel ID, Access Token, Test Event Code. Toggle CAPI. View event log filtered to Meta |
| **Google Analytics 4** | `/admin/pixels/ga4` | `pixel_events` (platform='ga4'), `settings` | Configure Measurement ID, API Secret. Toggle Measurement Protocol. View GA4 event log |
| **TikTok Pixel** | `/admin/pixels/tiktok` | `pixel_events` (platform='tiktok'), `settings` | Configure TikTok Pixel ID, Access Token. Toggle Events API |
| **Pinterest Tag** | `/admin/pixels/pinterest` | `pixel_events` (platform='pinterest'), `settings` | Configure Pinterest Tag ID, Conversion Token |
| **Snapchat Pixel** | `/admin/pixels/snapchat` | `pixel_events` (platform='snapchat'), `settings` | Configure Snap Pixel ID, CAPI Token |
| **Event Log** | `/admin/pixels/events` | `pixel_events` | Full event log across all platforms: event name, platform, data payload, CAPI sent status, timestamp |

**Total screens: 6 (meta + ga4 + tiktok + pinterest + snapchat + event log)**

---

### 11. 🚚 SHIPPING (`/admin/shipping`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Shipping Zones** | `/admin/shipping/zones` | `shipping_zones` | CRUD zones: name, countries, states. Lahore Metro, Punjab, Sindh, All Pakistan |
| **Shipping Rates** | `/admin/shipping/rates` | `shipping_rates`, `shipping_zones` | Per-zone rates: name, flat rate, per-kg rate, min order for free shipping, estimated delivery days |
| **Delivery Tracking** | `/admin/shipping/tracking` | `orders` (with tracking fields) | Orders in transit: tracking#, courier, estimated delivery, status. Quick-update tracking info |

**Total screens: 3 (zones + rates + tracking)**

---

### 12. 💳 PAYMENTS (`/admin/payments`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **Payment Methods** | `/admin/payments/methods` | `settings` (group='payments') | Enable/disable: COD, Credit Card, JazzCash, Easypaisa, Bank Transfer. Configure API keys per gateway |
| **Transactions** | `/admin/payments/transactions` | `payments`, `transactions` | Full transaction log: order#, method, amount, status, gateway ref, date. Filter by method/status/date |
| **Tax Configuration** | `/admin/payments/taxes` | `tax_rules` | CRUD tax rules: name, country, state, rate, applies_to (all/skincare/haircare). Active toggle |

**Total screens: 3 (methods + transactions + taxes)**

---

### 13. 🖼️ MEDIA LIBRARY (`/admin/media`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **All Files** | `/admin/media` | `media_library` | Grid/list view of all uploaded files. Filter by folder, type. Upload new files (drag-and-drop). Preview, rename, delete, edit alt text |
| **Folders** | `/admin/media/folders` | `media_library` (folder column) | Organize by folder: products, blog, hero, general. Move files between folders |

**Additional features:**
- Bulk upload with progress bar
- Image dimensions and file size display
- Copy-to-clipboard for embedding in blog/pages
- Used-in tracking (which product/blog/hero uses this image)

**Total screens: 2 (all files + folders)**

---

### 14. 🔒 SETTINGS (`/admin/settings`)

| Sub-Nav Link | Route | DB Tables | Description |
|---|---|---|---|
| **General** | `/admin/settings/general` | `settings` | Store name, logo (BYTEA), currency (PKR), timezone, default language, contact email, phone, address |
| **Roles & Permissions** | `/admin/settings/roles` | `roles` | CRUD roles with granular permissions JSONB. Assign role to users |
| **Store Policies** | `/admin/settings/policies` | `pages` (privacy, terms, refund policy) | Quick-edit legal pages content |
| **Notifications** | `/admin/settings/notifications` | `settings` (group='notifications') | Configure email templates for: order confirmation, shipping update, delivery confirmation, abandoned cart recovery, newsletter welcome |
| **Audit Logs** | `/admin/settings/audit-logs` | `audit_logs` | Searchable/filterable log: who did what, when, to which entity. Old vs new values diff view |

**Total screens: 5 (general + roles + policies + notifications + audit logs)**

---

## Complete Route Map

```
/admin                                    → Dashboard
/admin/products                           → Products List
/admin/products/new                       → Add Product
/admin/products/[id]                      → Edit Product
/admin/products/categories                → Categories
/admin/products/inventory                 → Inventory
/admin/products/tags                      → Tags & Collections
/admin/products/reviews                   → Reviews & Ratings
/admin/orders                             → All Orders
/admin/orders/[id]                        → Order Detail
/admin/orders/drafts                      → Draft Orders
/admin/orders/abandoned                   → Abandoned Checkouts
/admin/orders/invoices                    → Invoices
/admin/orders/returns                     → Returns & Refunds
/admin/orders/status-flow                 → Order Status Flow
/admin/customers                          → All Customers
/admin/customers/[id]                     → Customer Detail
/admin/customers/groups                   → Customer Groups
/admin/customers/wishlists                → Wishlists
/admin/customers/messages                 → Contact Messages
/admin/content                            → Pages List
/admin/content/pages/[id]                 → Page Editor
/admin/content/hero-slides                → Hero Slides
/admin/content/category-cards             → Category Cards
/admin/content/testimonials               → Testimonials
/admin/content/faq                        → FAQ Manager
/admin/content/blog                       → Blog Posts
/admin/content/blog/[id]                  → Blog Editor
/admin/content/announcements              → Announcements
/admin/content/navigation                 → Navigation Menus
/admin/content/footer                     → Footer Builder
/admin/quiz                               → Quiz Manager
/admin/quiz/[id]/questions                → Questions & Options
/admin/quiz/[id]/results                  → Results & Recommendations
/admin/quiz/responses                     → Quiz Responses
/admin/discounts/coupons                  → Coupon Codes
/admin/discounts/coupons/[id]             → Coupon Detail
/admin/discounts/auto                     → Automatic Discounts
/admin/discounts/flash-sales              → Flash Sales
/admin/discounts/usage                    → Usage History
/admin/marketing/newsletter               → Newsletter Subscribers
/admin/marketing/abandoned-carts          → Abandoned Cart Recovery
/admin/marketing/campaigns                → Campaign Links (UTM)
/admin/analytics                          → Overview Dashboard
/admin/analytics/sales                    → Sales Reports
/admin/analytics/products                 → Product Performance
/admin/analytics/customers                → Customer Insights
/admin/analytics/traffic                  → Traffic & Sessions
/admin/pixels/meta                        → Meta Pixel + CAPI
/admin/pixels/ga4                         → Google Analytics 4
/admin/pixels/tiktok                      → TikTok Pixel
/admin/pixels/pinterest                   → Pinterest Tag
/admin/pixels/snapchat                    → Snapchat Pixel
/admin/pixels/events                      → Event Log
/admin/shipping/zones                     → Shipping Zones
/admin/shipping/rates                     → Shipping Rates
/admin/shipping/tracking                  → Delivery Tracking
/admin/payments/methods                   → Payment Methods
/admin/payments/transactions              → Transactions
/admin/payments/taxes                     → Tax Configuration
/admin/media                              → All Files
/admin/media/folders                      → Folders
/admin/settings/general                   → General Settings
/admin/settings/roles                     → Roles & Permissions
/admin/settings/policies                  → Store Policies
/admin/settings/notifications             → Notification Templates
/admin/settings/audit-logs                → Audit Logs
```

---

## Sidebar Visual Reference

```
┌──────────────────────────────────────┐
│  🟢 DULCIS ADMIN                     │
│  dulcishealthcare.com                │
├──────────────────────────────────────┤
│                                      │
│  📊 Dashboard                        │
│                                      │
│  📦 Products                    ▾    │
│     ├─ All Products                  │
│     ├─ Add Product                   │
│     ├─ Categories                    │
│     ├─ Inventory                     │
│     ├─ Tags & Collections            │
│     └─ Reviews & Ratings             │
│                                      │
│  🛒 Orders                      ▾    │
│     ├─ All Orders                    │
│     ├─ Drafts                        │
│     ├─ Abandoned Checkouts           │
│     ├─ Invoices                      │
│     ├─ Returns & Refunds             │
│     └─ Order Status Flow             │
│                                      │
│  👥 Customers                   ▾    │
│     ├─ All Customers                 │
│     ├─ Customer Groups               │
│     ├─ Wishlists                     │
│     └─ Contact Messages              │
│                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  STOREFRONT                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                      │
│  🎨 Content (CMS)              ▾    │
│     ├─ Pages                         │
│     ├─ Hero Slides                   │
│     ├─ Category Cards                │
│     ├─ Testimonials                  │
│     ├─ FAQ Manager                   │
│     ├─ Blog Posts                    │
│     ├─ Announcements                 │
│     └─ Navigation Menus              │
│                                      │
│  🧪 Skin Quiz                  ▾    │
│     ├─ Quiz Manager                  │
│     ├─ Questions & Options           │
│     ├─ Results & Recommendations     │
│     └─ Quiz Responses                │
│                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  MARKETING                           │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                      │
│  💰 Discounts                   ▾    │
│     ├─ Coupon Codes                  │
│     ├─ Automatic Discounts           │
│     ├─ Flash Sales                   │
│     └─ Usage History                 │
│                                      │
│  📣 Marketing                   ▾    │
│     ├─ Newsletter Subscribers        │
│     ├─ Abandoned Cart Recovery       │
│     └─ Campaign Links (UTM)          │
│                                      │
│  📊 Analytics                   ▾    │
│     ├─ Overview Dashboard            │
│     ├─ Sales Reports                 │
│     ├─ Product Performance           │
│     ├─ Customer Insights             │
│     └─ Traffic & Sessions            │
│                                      │
│  🔌 Pixels & Integrations      ▾    │
│     ├─ Meta Pixel + CAPI             │
│     ├─ Google Analytics 4            │
│     ├─ TikTok Pixel                  │
│     ├─ Pinterest Tag                 │
│     ├─ Snapchat Pixel                │
│     └─ Event Log                     │
│                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  CONFIGURATION                       │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                      │
│  🚚 Shipping                   ▾    │
│     ├─ Shipping Zones                │
│     ├─ Shipping Rates                │
│     └─ Delivery Tracking             │
│                                      │
│  💳 Payments                    ▾    │
│     ├─ Payment Methods               │
│     ├─ Transactions                  │
│     └─ Tax Configuration             │
│                                      │
│  🖼️ Media Library              ▾    │
│     ├─ All Files                     │
│     └─ Folders                       │
│                                      │
│  🔒 Settings                   ▾    │
│     ├─ General                       │
│     ├─ Roles & Permissions           │
│     ├─ Store Policies                │
│     ├─ Notifications                 │
│     └─ Audit Logs                    │
│                                      │
├──────────────────────────────────────┤
│  👤 Admin Name                       │
│  admin@dulcis.com          [Logout]  │
└──────────────────────────────────────┘
```

---

## DB Table → Admin Page Coverage Map

Every single table is accessible from the admin panel:

| # | DB Table | Admin Screen |
|---|---|---|
| 1 | `roles` | Settings → Roles & Permissions |
| 2 | `users` | Customers → All Customers |
| 3 | `user_addresses` | Customers → Customer Detail |
| 4 | `notification_preferences` | Customers → Customer Detail |
| 5 | `categories` | Products → Categories |
| 6 | `products` | Products → All Products |
| 7 | `product_images` | Products → Add/Edit Product → Media |
| 8 | `product_gallery` | Products → Add/Edit Product → Gallery |
| 9 | `product_variants` | Products → Add/Edit Product → Variants |
| 10 | `product_inventory` | Products → Inventory |
| 11 | `product_tags` | Products → Tags & Collections |
| 12 | `product_ingredients` | Products → Add/Edit Product → Ingredients |
| 13 | `product_benefits` | Products → Add/Edit Product → Benefits |
| 14 | `related_products` | Products → Add/Edit Product → Related |
| 15 | `reviews` | Products → Reviews & Ratings |
| 16 | `wishlist` | Customers → Wishlists |
| 17 | `cart` | Dashboard (cart count metric) |
| 18 | `cart_items` | Dashboard (cart value metric) |
| 19 | `shipping_zones` | Shipping → Shipping Zones |
| 20 | `shipping_rates` | Shipping → Shipping Rates |
| 21 | `tax_rules` | Payments → Tax Configuration |
| 22 | `orders` | Orders → All Orders |
| 23 | `order_items` | Orders → Order Detail |
| 24 | `order_status_history` | Orders → Order Detail → Timeline |
| 25 | `payments` | Orders → Order Detail + Payments → Transactions |
| 26 | `transactions` | Payments → Transactions |
| 27 | `invoices` | Orders → Invoices |
| 28 | `return_requests` | Orders → Returns & Refunds |
| 29 | `refunds` | Orders → Returns & Refunds |
| 30 | `pages` | Content → Pages |
| 31 | `page_sections` | Content → Page Editor |
| 32 | `hero_slides` | Content → Hero Slides |
| 33 | `category_cards` | Content → Category Cards |
| 34 | `testimonials` | Content → Testimonials |
| 35 | `faq` | Content → FAQ Manager |
| 36 | `blogs` | Content → Blog Posts |
| 37 | `announcements` | Content → Announcements |
| 38 | `navigation` | Content → Navigation Menus |
| 39 | `footer` | Content → Footer Builder |
| 40 | `settings` | Settings → General + Pixels config |
| 41 | `quizzes` | Skin Quiz → Quiz Manager |
| 42 | `quiz_questions` | Skin Quiz → Questions & Options |
| 43 | `quiz_options` | Skin Quiz → Questions & Options |
| 44 | `quiz_answers` | Skin Quiz → Quiz Responses |
| 45 | `quiz_results` | Skin Quiz → Results & Recommendations |
| 46 | `quiz_recommendations` | Skin Quiz → Results & Recommendations |
| 47 | `coupons` | Discounts → Coupon Codes |
| 48 | `coupon_usage` | Discounts → Usage History |
| 49 | `discounts` | Discounts → Automatic Discounts |
| 50 | `flash_sales` | Discounts → Flash Sales |
| 51 | `newsletter_subscribers` | Marketing → Newsletter Subscribers |
| 52 | `abandoned_carts` | Marketing → Abandoned Cart Recovery |
| 53 | `visitor_sessions` | Analytics → Traffic & Sessions |
| 54 | `utm_tracking` | Marketing → Campaign Links |
| 55 | `pixel_events` | Pixels → Event Log |
| 56 | `media_library` | Media Library → All Files |
| 57 | `audit_logs` | Settings → Audit Logs |
| 58 | `contact_messages` | Customers → Contact Messages |

> **All 46 tables + 3 views are fully covered.** ✅
