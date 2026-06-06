/**
 * SEO & Performance Module
 * 
 * Exports all SEO-related middleware:
 * - Meta tag injection for dynamic pages
 * - Performance optimization (caching, preloading)
 * - Prerendering for search engine bots
 */
export { createMetaInjectorMiddleware, resolveMetaForPath, injectMetaIntoHtml, getResolvedMeta } from "./metaInjector";
export { performanceMiddleware, cacheHeadersMiddleware, preloadHintsMiddleware } from "./performance";
export { prerenderMiddleware } from "./prerender";
