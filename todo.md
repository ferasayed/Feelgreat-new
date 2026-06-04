# Project TODO

- [x] Database schema: leads table (name, email, phone, country, created_at, source)
- [x] Database schema: chat_conversations table (visitor_id, messages, interest_level, created_at)
- [x] Backend: Lead registration API endpoint
- [x] Backend: AI chatbot endpoint with Feel Great knowledge base
- [x] Backend: Owner notifications on new lead registration
- [x] Backend: Owner notifications on high-interest chatbot conversations
- [x] Backend: Dashboard stats API (total leads, conversations, high-interest count)
- [x] Frontend: Arabic RTL landing page with premium design
- [x] Frontend: Hero section with Feel Great branding and CTA
- [x] Frontend: Product description section (Unimate + Balance)
- [x] Frontend: How it works section
- [x] Frontend: Business opportunity section (Unicity model)
- [x] Frontend: Testimonials and success stories section
- [x] Frontend: Lead registration form (name, email, phone, country)
- [x] Frontend: AI chatbot widget (Arabic, persuasive, handles objections)
- [x] Frontend: CTA button linking to https://ufeelgreat.com/c/GBP556
- [x] Frontend: Owner dashboard with lead records and chat analytics
- [x] Vitest: Unit tests for key backend procedures
- [x] Multi-language system: i18n support (Arabic, English, French, Spanish, German, Turkish)
- [x] Language switcher component in header
- [x] RTL/LTR automatic direction switching based on language
- [x] Chatbot responds in visitor's selected language
- [x] Use Bahij TheSansArabic font for Arabic text across the site
- [x] Add real product images (Unimate + Balance) to the website
- [x] Update chatbot knowledge base with detailed product info from PDF files
- [x] Create persuasive audio content for visitor engagement
- [x] Create promotional video content (3 clips concatenated)
- [x] Enhance organic recruitment strategy with compelling media content
- [x] Add shareable social media content cards/assets for organic distribution
- [x] Add share/referral CTA buttons for social media sharing
- [x] Add video/audio section to the landing page
- [x] Replace generated product images with real original product photos from user
- [x] Update chatbot knowledge base with objection handling content from PDF
- [x] Upload all real product images to webdev storage
- [x] Integrate Unicity compliance guidelines (FTC/social media policies) into chatbot behavior
- [x] Add company profile facts to chatbot knowledge base
- [x] Add return & refund policy to chatbot knowledge base (60-day guarantee, process, contacts)
- [x] Add membership terms and conditions to chatbot knowledge base (free membership, credit system, termination)
- [x] Create standalone FAQ page with common questions for SEO
- [x] Build automatic follow-up system for leads who haven't completed registration
- [x] Guide user to set custom domain (feelfree.manus.space) from Settings > Domains
- [x] Analyze and integrate Product Claims guidelines into chatbot
- [x] Analyze and integrate Social Stories sharing guidelines into chatbot
- [x] Add SEO meta tags and FAQ structured data (JSON-LD) to FAQ page
- [x] Implement follow-up delivery via owner notification with lead contact details
- [x] Activate auto follow-up system (heartbeat cron job)
- [x] Access Google Drive success stories and integrate into the site
- [x] Redesign visual identity: white, calm blue, natural green, light beige, soft gold
- [x] Add floating WhatsApp button (wa.me/96877020770) on all pages
- [x] Add WhatsApp buttons in header, footer, and after each main section
- [x] Implement basic SEO (meta tags, Open Graph, keywords)
- [x] Add canonical URL and sitemap.xml
- [x] Add Schema Markup: FAQ JSON-LD structured data in FAQ page
- [x] Improve CRO: sticky CTA bar, multiple CTAs throughout the page
- [x] Add real success stories section with health transformation stories
- [x] Redesign UX for trust-building in first 5 seconds
- [x] Mobile-first responsive optimization

- [x] Fix deployment blocker: remove canonical link href="/" that caused Vite EISDIR build error

## Future Enhancements (Optional)
- [ ] Create health condition pillar pages (diabetes, insulin resistance, fatty liver, IBS, obesity, PCOS, cholesterol, hypertension)
- [ ] Add customer reviews/ratings system
- [ ] Add 90-day journey roadmap section
- [ ] Add lead magnet for email collection
- [x] Wire heartbeat cron job activation via dashboard button (manual)
- [x] Add Google Drive success stories link to chatbot for condition-specific story sharing

## Major Redesign - Premium Platform Transformation

- [x] Redesign Hero Section: new headline "استثمر في صحتك اليوم… وابنِ تأثيرك ودخلك غداً", sub-points (sustainable health, income, self-development, remote work, global community), 3 CTAs
- [x] Update visual identity: white + health blue + luxury gold + calm beige, trust/hope/comfort/professionalism/success feel
- [x] Add Sustainable Health section (nutrition, movement, sleep, stress management, hormonal balance, continuity) with modern icons
- [x] Add Health Investor section (health ROI, energy, productivity, quality of life, long-term prevention)
- [x] Add Partners Benefits section "لماذا ينضم الناس كشركاء؟" (income, time freedom, remote work, team building, leadership, rewards/travel)
- [x] Add Stats/Numbers section (countries, clients, partners, completed programs) with premium animated counters
- [x] Create Partner With Us page (/partner) with 5-step process and income calculator
- [x] Create Founder profile page (/founder) - Feras Al-Ayed (Presidential Sapphire, social links)
- [x] Add Income Calculator (interactive, estimate earnings based on activity)
- [x] Add Health ROI Calculator (cost of neglect vs prevention value)
- [x] Update WhatsApp button with auto-message "أرغب بمعرفة المزيد عن برنامج الصحة المستدامة وفرصة الشراكة"
- [x] Improve SEO: target keywords (الصحة المستدامة, مقاومة الإنسولين, الصيام المتقطع, صحة الأمعاء, إنقاص الوزن, Health Investor, Lifestyle Medicine)
- [x] Add Blog page structure (/blog) with health categories
- [x] Add CRO elements: Sticky CTA bar with WhatsApp + Register buttons
- [x] Optimize performance: mobile-first responsive design, optimized assets via manus-storage CDN
- [x] Add Feras social media links (Instagram @use2lose, TikTok @feras.alayed) in Footer and Founder page

## SEO Technical Improvements & Auto Blog

- [x] Add JSON-LD Schema Markup (Organization, WebSite, FAQ, Article)
- [x] Improve internal linking between pages (Footer links to blog categories, all pages cross-linked)
- [x] Add Schema for FAQ page (already implemented with FAQ JSON-LD)
- [ ] Create health condition pillar pages (diabetes, insulin resistance, fatty liver, IBS, obesity, PCOS, cholesterol, hypertension)
- [x] Build automated daily blog article generation system (LLM + heartbeat cron)
- [x] Create blog articles database table and tRPC procedures
- [x] Create blog article detail page with dynamic routing
- [x] Schedule daily heartbeat job for article generation (3x daily via admin mutation)

## AI SEO Content Engine

- [x] Upgrade article generation to produce 1200-2500 word articles with FAQ, internal links, Schema, external references
- [x] Position Feras Alayed as Therapeutic & Behavioral Nutrition Specialist in all articles
- [x] Add lead generation CTAs in every article (WhatsApp, Free Assessment, Consultation)
- [x] Create dynamic article detail page (/blog/:slug) with full SEO rendering
- [x] Create content hub pages for 6 clusters (Insulin Resistance, Sustainable Health, Weight Loss, Gut Health, Healthy Habits, Behavioral Nutrition)
- [x] Set up 3x daily heartbeat cron for article generation (morning, afternoon, evening)
- [x] Add Schema markup (Article, FAQ, Person) to article pages
- [x] Rewrite Blog.tsx to use database-backed articles with category filtering

## Target Market Expansion (US + Europe)

- [x] Add US/UK/Europe-focused content clusters targeting women 35-60, prediabetes, menopause weight gain
- [x] Add country-specific article topics (US, UK, Germany, Netherlands, Sweden)
- [x] Update article generator to produce geo-targeted content for English-speaking audiences
- [x] Add topical authority clusters: Metabolic Health, Insulin Resistance, Sustainable Health, Healthy Aging
- [x] Add content validation: minimum word count, FAQ presence, internal links check before publishing
- [x] Add FAQ JSON-LD schema to article pages

## 8-Phase SEO Authority Strategy (EXECUTE IN ORDER)

### Phase 1: Technical SEO Foundation
- [x] Audit and fix all meta tags (title, description) on every page
- [x] Ensure every page has exactly one H1 tag
- [x] Fix any broken internal links (all cross-links verified)
- [x] Optimize sitemap.xml with all pages and proper priorities (absolute URLs, 14 pages)
- [x] Optimize robots.txt for proper crawling (disallow /dashboard, /api/)
- [x] Improve Core Web Vitals (LCP, FID, CLS) - lazy loading, code splitting implemented
- [x] Ensure mobile usability across all pages - responsive Tailwind design throughout
- [x] Add proper canonical URLs (dynamic per page)
- [x] Fix any duplicate content issues (canonical URLs prevent duplicates)
- [x] Improve page speed (lazy loading, image optimization) - React.lazy + CDN images
- [x] Map and improve internal linking structure (cross-links on all pages)
- [x] Deliver Phase 1 technical audit report - integrated into Growth Dashboard

### Phase 2: Website Structure & Architecture
- [x] Define 9 main authority categories with URL structure (/topics/:slug)
- [x] Create topic cluster map under each category (9 clusters with subtopics)
- [x] Build navigation reflecting authority structure (Topics list page + detail pages)
- [x] Create category landing pages (/topics with grid of all 9 categories)
- [x] Deliver sitemap document before proceeding

### Phase 3: Authority Pillar Pages (3000+ words each)
- [x] Sustainable Health pillar page
- [x] Insulin Resistance pillar page
- [x] Prediabetes pillar page
- [x] Weight Loss After 40 pillar page
- [x] Metabolic Health pillar page
- [x] Gut Health pillar page
- [x] Healthy Aging pillar page
- [x] Energy & Fatigue pillar page
- [x] Behavioral Nutrition pillar page

### Phase 4: Conversion Funnels
- [x] Funnel A (Health Clients): Assessment → Consultation → Application
- [x] Funnel B (Business Partners): Opportunity → Video → Application → Call Booking
- [x] Ensure funnels are separate and don't mix audiences

### Phase 5: Trust System
- [x] About Feras Alayed page (enhanced)
- [x] Credentials page
- [x] Case Studies page
- [x] Testimonials page
- [x] Health Assessment page (interactive)

### Phase 6: Content Engine (1 article/day)
- [x] Configure article generation to 3/day targeting low-competition keywords
- [x] Focus on US, UK, Germany, Netherlands, Sweden markets
- [x] Target: Women 35-60, Prediabetes, Insulin Resistance, Weight Loss, Gut Health, Healthy Aging

### Phase 7: Keyword Priority Report
- [x] Research top 20 keywords for fastest traffic growth in 90 days
- [x] Provide: Search Volume, Difficulty, Intent, Ranking Opportunity, Priority Score
- [x] Sort by ROI (highest to lowest)

### Phase 8: Growth Dashboard
- [x] Track indexed pages
- [x] Track organic traffic
- [x] Track keyword rankings
- [x] Track leads generated
- [x] Track WhatsApp clicks
- [x] Track consultation requests
- [x] Weekly performance report system
