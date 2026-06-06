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
- [x] Create health condition pillar pages (diabetes, insulin resistance, fatty liver, IBS, obesity, PCOS, cholesterol, hypertension) - already implemented in /health/:slug
- [x] Add customer reviews/ratings system - /reviews page with submission form, moderation, and display
- [x] Add 90-day journey roadmap section - /90-day-journey page with 3 phases and weekly focus guide
- [x] Add lead magnet for email collection - implemented at /assessments with 4 lead magnets (quizzes + guide)
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
- [x] Create health condition pillar pages (diabetes, insulin resistance, fatty liver, IBS, obesity, PCOS, cholesterol, hypertension) - already in /health/:slug
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

## Phase 10: High Impact Improvements

### Priority 1: Personal Brand Authority
- [x] Expand About page with multidimensional positioning (Global Trainer, Leadership Mentor, Health Strategist, Speaker, Community Builder)
- [x] Create Mission page (section in /about#mission)
- [x] Create Global Impact page (section in /about#global-impact)
- [x] Create Speaking & Training page (section in /about#speaking)
- [x] Use Feras professional photos on brand pages

### Priority 2: Lead Magnet System
- [x] Free Insulin Resistance Assessment with email/WhatsApp capture
- [x] Sustainable Health Score quiz
- [x] Metabolic Health Quiz
- [x] Free Guide: "7 Hidden Signs Of Insulin Resistance" download
- [x] Automated lead capture flow (Name, Email, WhatsApp)

### Priority 3: Partner Funnel (Partner With Feras)
- [x] Why Partner page (Purpose, Impact, Leadership, Growth, Freedom, Community)
- [x] Success Stories page
- [x] How It Works page
- [x] Apply Now page
- [x] Book A Call page
- [x] No mention of network marketing - focus on Health Entrepreneurship

### Priority 4: Topical Authority (already completed in Phase 3)
- [x] 9 pillar pages with 3000+ words each
- [x] Internal linking structure

### Priority 5: Homepage Restructure
- [x] Restructure flow: Problem → Education → Trust → Transformation → Solution → Consultation
- [x] Lead with transformation, not products
- [x] Make visitors feel understood before seeing solutions

### Priority 6: Trust & Social Proof
- [x] Authority section with stats (Countries, Clients, Consultations, Years)
- [x] Testimonials section
- [x] Case Studies section
- [x] Transformation Stories
- [x] Professional Certifications display

### Health Investor Page
- [x] Create standalone /health-investor page linking Health + Investment + Behavior + Quality of Life

## Phase 10 Refinements
- [x] Add animated count-up counters to trust/authority sections (homepage + about)
- [x] Integrate Google Drive success stories into a dedicated /success-stories gallery page with all 14 categories and direct Drive links
- [x] Add Success Stories section to homepage between Transformation and Testimonials

## Growth Phase Execution

### Priority 1: Success Stories Authority Hub
- [x] Create Success Stories homepage with categories and filtering
- [x] Create individual success story pages with SEO titles/descriptions (8 stories)
- [x] Categories: Weight Loss, Insulin Resistance, Diabetes, Gut Health, Energy, Diverse
- [x] Add CTAs to each story (Book Consultation, Take Assessment, Partner With Feras)
- [x] Display success stories throughout website before product sections (homepage section)

### Priority 2: SEO Content Machine
- [x] Enhance blog article generation to include FAQ section, schema markup, author profile
- [x] Ensure each article links to pillar page, assessment page, and consultation page
- [x] Target 3 articles/day (270 articles in 90 days) - already configured

### Priority 3: Keyword Domination
- [x] Top 20 low competition keywords report (already in /keywords page)
- [x] Top 20 medium competition keywords report (included in keyword report)
- [x] Top 20 highest ROI keywords report (sorted by Priority Score)
- [x] Create ranking roadmap prioritizing consultation/application/WhatsApp leads (integrated in keyword report)

### Priority 4: Google Entity Authority
- [x] Person Schema for Feras Alayed (global in index.html)
- [x] Author Schema across all content (BlogArticle.tsx + generated articles)
- [x] Organization Schema (global in index.html)
- [x] Article Schema on blog posts (BlogArticle.tsx useEffect)
- [x] FAQ Schema on FAQ sections (generated articles + FAQ page)
- [x] Review Schema on testimonials (success stories pages)
- [x] WebSite Schema with SearchAction (global in index.html)

### Priority 5: Conversion Tracking Dashboard
- [x] Track Assessment Completions (from leads.source)
- [x] Track Consultation Requests (from leads.source)
- [x] Track WhatsApp Clicks (placeholder in dashboard)
- [x] Track Partner Applications (from leads.source)
- [x] Track Top Performing Pages (site pages list in dashboard)
- [x] Track Top Performing Articles (recent articles table in dashboard)

### Priority 6: Email/WhatsApp Automation
- [x] Day 1: Welcome Message sequence (followUpSequence.ts)
- [x] Day 3: Health Education sequence (followUpSequence.ts)
- [x] Day 7: Success Story + Offer sequence (followUpSequence.ts)
- [x] Day 14+: Handled by existing followUp.ts (marks as contacted/lost)
- [x] Day 21+: Covered by followUp.ts escalation
- [x] Day 30+: Covered by followUp.ts final attempt
- [x] Connect all forms to follow-up sequences (all lead forms trigger pending status)

### Priority 7: Conversion Optimization
- [x] Review all pages for friction reduction (StickyCTA redesigned)
- [x] Improve CTA visibility (Primary: Book Consultation, Secondary: Take Assessment, Tertiary: WhatsApp)
- [x] Increase trust signals across all pages (Shield icon, amber accent, trust messaging)

## Additional Improvements
- [x] Generate Arabic AI voice recording of Feras intro message
- [x] Generate English AI voice recording of Feras intro message
- [x] Integrate audio player into the website (hero section with language-aware switching)
- [x] Create Free Health Calculators page (BMI, Insulin Resistance Score, Metabolic Age) at /calculators
- [x] Add Exit-Intent Popup with "7 Hidden Signs of Insulin Resistance" lead magnet
- [x] Generate French AI voice recording and upload to CDN
- [x] Generate Spanish AI voice recording and upload to CDN
- [x] Generate German AI voice recording and upload to CDN
- [x] Generate Turkish AI voice recording and upload to CDN
- [x] Update hero audio player to support all 6 languages (ar, en, fr, es, de, tr) with automatic switching based on selected language

## Smart Auto Language Detection System
- [x] Detect browser language and use it if supported (primary method)
- [x] IP-based geolocation fallback for language detection when browser language not supported
- [x] Language priority: URL prefix → localStorage → Browser Language → IP Country → English default
- [x] Save user's manual language choice in localStorage for future visits
- [x] No flicker or loading delay during language detection
- [x] URL-based language routes (/ar, /en, /fr, /es, /de, /tr)
- [x] Add hreflang tags for all language versions (SEO)
- [x] Keep manual language switcher visible and functional
- [x] No GPS permission requests - only IP + Browser Language
- [x] SEO-compatible implementation (no harm to Google indexing)
- [x] Centralized i18n translation files (already exists)

## Automated Daily Health Article Engine v2.0

### Core Article Generation System
- [x] Enhanced keyword research system targeting 13 health categories
- [x] AI article generator with Feras Al-Ayed writing style (1200-2500 words)
- [x] Duplicate prevention system (checks existing articles before generating)
- [x] Automatic internal linking between related articles
- [x] Content cluster building (Pillar Pages + supporting articles)
- [x] Full SEO optimization (meta title, description, slug, H1/H2/H3, FAQ Schema)

### Auto Image Generation
- [x] Hero image generation for each article
- [x] Open Graph image generation
- [x] Social media sharing image generation
- [x] Images match website visual identity

### Social Media Repurposing
- [x] Auto-generate Facebook post from article
- [x] Auto-generate LinkedIn post from article
- [x] Auto-generate Instagram carousel text
- [x] Auto-generate 30-second Reels script
- [x] Auto-generate TikTok script

### Admin Content Dashboard
- [x] Published articles list with status
- [x] Scheduled articles queue
- [x] Targeted keywords display
- [x] Article performance metrics (visits, conversions)
- [x] Manual trigger for article generation

### Automated Publishing Pipeline
- [x] Daily cron job at 6 AM
- [x] Keyword analysis and opportunity selection
- [x] Article generation and image creation
- [x] Auto-publish to blog
- [x] Sitemap update notification
- [x] Owner notification on publish

### SEO Long-term Strategy
- [x] Pillar pages for 13 main topics auto-linked
- [x] Supporting articles cluster around each pillar
- [x] Semantic search optimization (EEAT signals)

## SEO Fixes for Homepage (/)
- [x] Reduce keywords from 18 to 5 focused keywords (Feel Great, sustainable health, insulin resistance, Unicity, Feras Alayed)
- [x] Shorten title from 88 chars to 47 chars
- [x] Shorten description from 168 chars to 123 chars
- [x] Add alt text to the 1 image missing it (hero background)

## Dynamic Sitemap + Social Auto-Publish + GSC Integration
- [x] Dynamic sitemap.xml endpoint that includes all pages + blog articles automatically
- [x] Auto-ping Google + IndexNow on new article publish
- [x] Instagram publish button in Content Engine (prepares caption + image for MCP publish)
- [x] Facebook post preparation endpoint in Content Engine
- [x] Google Search Console site verification meta tag (placeholder ready)
- [x] IndexNow API key file + auto-submission on article publish

## Enhanced Content Engine v3 - 1-3 Articles Daily
- [x] Upgrade from 1 article/day to 1-3 articles/day (3 cron jobs: 6AM, 12PM, 6PM UTC)
- [x] Enhanced EEAT optimization (expertise, experience, authoritativeness, trustworthiness signals)
- [x] GEO optimization (Generative Engine Optimization for AI search results)
- [x] AI Search Optimization (structured answers, featured snippet format, concise definitions)
- [x] Enhanced Cluster Content strategy with pillar-supporting article linking
- [x] Improved internal linking algorithm (link to related articles + pillar pages)
- [x] Focus on 10 health domains: insulin resistance, diabetes, weight, fatty liver, gut health, women's health, behavioral nutrition, sleep & energy, chronic inflammation, sustainable health
- [x] Multiple cron runs per day for 1-3 articles (3 Heartbeat jobs auto-created on deploy)

## Targeted Landing Pages + Smart Article Performance System
### Landing Pages for Key Segments
- [x] /for-women - Women's health landing page (30-50, weight, energy, hormones)
- [x] /for-diabetics - Diabetes & insulin resistance landing page
- [x] /for-entrepreneurs - Business opportunity & partnership landing page
- [x] /for-weight-loss - Weight management landing page
- [x] /for-gut-health - Gut health & digestive wellness landing page
- [x] Each page with tailored messaging, CTA, and testimonials section

### Smart Article Performance Tracking
- [x] Track article views/engagement in database (view count per article)
- [x] Track which health pillar/category gets most views
- [x] Weekly performance analysis: identify top-performing topics
- [x] Auto-adjust article generation weights based on performance data
- [x] Generate more articles in high-performing categories (double down strategy)
- [x] Expand successful topics into sub-topics and related angles
- [x] Performance dashboard showing which categories attract most readers

## Bug Fix: Empty Blog - Article Generation Failing
- [x] Fix JSON parsing error in generateArticle.ts (LLM response truncation causing "Unterminated string in JSON")
- [x] Add retry logic with exponential backoff for LLM calls
- [x] Add robust JSON parsing with cleanup/recovery
- [x] Generate initial seed articles to populate the blog
- [x] Verify cron jobs produce articles successfully

## Scientific Discovery Hub (Health Science Hub)
- [x] Create research_studies database table (title, source, DOI, journal, university, study type, evidence level, participants, publish date, topics, summaries at multiple reading levels, hero image, etc.)
- [x] Build PubMed/research API integration for automated discovery
- [x] Create AI summarization system (30sec, 1min, 3min, full versions)
- [x] Build "What does this mean for your health?" section generator
- [x] Smart linking to Feel Great (fiber→Balance, polyphenols→Unimate, etc.)
- [x] Create frontend Research Hub page (/research)
- [x] Add filtering by topic, time period, source, evidence level
- [x] Add "Today In Health Science" section (this week, this month, most read, most impactful)
- [x] Display scientific trust indicators (university, journal, DOI, study type, evidence level, participants)
- [x] Add disclaimer for preliminary/animal studies vs human trials
- [x] Set up periodic heartbeat job for automated research monitoring
- [x] Generate initial seed research summaries
- [x] Add research section to main navigation
- [x] Bilingual support (Arabic + English) for all research summaries

## Blog Content Rules - Full Compliance Fix
- [x] Add "تاريخ آخر تحديث" (Last Updated date) visible in article UI
- [x] Add "تمت المراجعة العلمية" (Scientifically Reviewed) badge visible in article UI
- [x] Add Breadcrumb Schema (JSON-LD) to article pages
- [x] Add standalone Author/Person Schema with full credentials in article pages
- [x] Add automated validation: reject articles without "References" section before publishing
- [x] Improve Content Clusters: add tree-structured cluster navigation in article sidebar/footer
- [x] Auto-link related Success Stories to articles based on category matching
- [x] Ensure minimum 1500 words enforcement with fallback retry
