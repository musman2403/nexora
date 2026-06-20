import { useEffect } from 'react';

const BASE_URL = 'https://nexora.com.pk';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO Component — dynamically updates all head meta tags per page.
 * Supports: title, description, OG, Twitter, canonical, noindex, structuredData
 */
export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  article = null,      // { publishedTime, modifiedTime, author, tags }
  noindex = false,
  structuredData = null,
}) {
  const fullTitle = title
    ? `${title} | Nexora Ventures`
    : 'Nexora Ventures | Technology-Driven Real Estate Solutions';

  const metaDesc = description ||
    'Nexora Ventures delivers integrated real estate solutions — from strategic acquisition to turnkey construction — for investors who demand precision.';

  const metaImage = image || DEFAULT_IMAGE;
  const metaUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set or create a meta tag
    const setMeta = (selector, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.startsWith('meta[name')
          ? 'name'
          : selector.startsWith('meta[property')
          ? 'property'
          : 'name';
        const val = selector.match(/["']([^"']+)["']/)?.[1] || '';
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Helper to set or create a link tag
    const setLink = (rel, value) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', value);
    };

    // Primary Meta
    setMeta('meta[name="description"]', metaDesc);
    setMeta('meta[name="robots"]', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', metaDesc);
    setMeta('meta[property="og:image"]', metaImage);
    setMeta('meta[property="og:url"]', metaUrl);
    setMeta('meta[property="og:type"]', type);

    // Article-specific OG
    if (article) {
      setMeta('meta[property="article:published_time"]', article.publishedTime || '');
      setMeta('meta[property="article:modified_time"]', article.modifiedTime || article.publishedTime || '');
      setMeta('meta[property="article:author"]', article.author || 'Nexora Ventures');
    }

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', metaDesc);
    setMeta('meta[name="twitter:image"]', metaImage);

    // Canonical
    setLink('canonical', metaUrl);

    // Structured Data (JSON-LD)
    const existingScript = document.getElementById('seo-structured-data');
    if (structuredData) {
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData);
      } else {
        const script = document.createElement('script');
        script.id = 'seo-structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [fullTitle, metaDesc, metaImage, metaUrl, type, noindex, structuredData, article]);

  return null;
}
