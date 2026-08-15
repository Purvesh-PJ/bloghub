/**
 * Curated multi-category fallback stories for BlogHub.
 * Ensures the portfolio project is always vibrant, populated, and demonstrates
 * full-stack frontend capabilities across Food, Tech, Science, Design, Travel, and Health.
 */

export const CURATED_POSTS = [
  {
    _id: 'curated-1',
    title: 'The Chemistry of Sourdough: Why Temperature and Hydration Rule the Crumb',
    content: `Sourdough baking is equal parts culinary art and microbiological precision. When wild yeasts and lactic acid bacteria ferment flour and water, they create complex organic acids that give the bread its signature tang and open, airy crumb structure.

### The Role of Hydration
A 75% hydration dough allows gluten to stretch without tearing during the initial bulk fermentation. Combined with gentle stretch-and-folds every 30 minutes, you develop a strong gluten matrix capable of trapping carbon dioxide during the oven spring.

### Temperature as an Ingredient
Fermenting at 26°C (78°F) favors lactic acid production, delivering a smooth yogurt-like flavor profile, whereas lower temperatures (18°C) encourage acetic acid, creating a sharper, vinegary punch. Mastering sourdough is about mastering time and temperature.`,
    categories: [{ _id: 'cat-food', name: 'Food' }, { _id: 'cat-science', name: 'Science' }],
    author: {
      _id: 'author-1',
      username: 'Camilla Rossi',
      name: 'Camilla Rossi',
      avatar: 'CR',
      bio: 'Culinary scientist and artisanal baker based in Florence.',
    },
    imageURL: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    views: 1840,
    reads: 1690,
    readRate: 91.8,
    likesCount: 142,
    commentsCount: 28,
  },
  {
    _id: 'curated-2',
    title: 'Architecting Next-Gen Edge Systems: From Monolith to Micro-Frontends',
    content: `Modern web scale demands that compute lives as close to the user as possible. By offloading routing, authentication, and SSR caching to globally distributed edge nodes, applications can achieve sub-50ms TTFB worldwide.

### Why Micro-Frontends at the Edge?
Independent deployability allows engineering teams to ship features without locking the entire release train. When stitched together at the edge via stream-composition, the client receives a single seamless HTML payload with zero runtime hydration penalty.

### Key Takeaways
1. Always isolate failure domains so a widget downtime never brings down the whole page.
2. Utilize stale-while-revalidate caching headers on edge lambdas.
3. Optimize critical rendering paths with progressive hydration.`,
    categories: [{ _id: 'cat-tech', name: 'Technology' }, { _id: 'cat-prog', name: 'Programming' }],
    author: {
      _id: 'author-2',
      username: 'Purvesh Joshi',
      name: 'Purvesh Joshi',
      avatar: 'PJ',
      bio: 'Full Stack Engineer & Cloud Architect.',
    },
    imageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    views: 3420,
    reads: 3220,
    readRate: 94.1,
    likesCount: 384,
    commentsCount: 52,
  },
  {
    _id: 'curated-3',
    title: 'Beyond the Event Horizon: What James Webb Tells Us About Early Galaxies',
    content: `Deep-field infrared imagery from the James Webb Space Telescope (JWST) has upended several foundational assumptions in cosmology. Galaxies formed merely 350 million years after the Big Bang appear far more massive, structured, and luminous than classical stellar models predicted.

### The Mystery of Cosmic Dawn
Spectroscopic analysis of redshift galaxies reveals early metallicity and rapid black hole seeding that suggests stellar nurseries ignited with unprecedented velocity in the primordial universe.

The next decade of astrophysics will be defined by reconciling these observations with existing gravitational collapse models.`,
    categories: [{ _id: 'cat-science', name: 'Science' }],
    author: {
      _id: 'author-3',
      username: 'Dr. Evelyn Vance',
      name: 'Dr. Evelyn Vance',
      avatar: 'EV',
      bio: 'Astrophysics researcher and science communicator.',
    },
    imageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    views: 2950,
    reads: 2710,
    readRate: 91.8,
    likesCount: 290,
    commentsCount: 41,
  },
  {
    _id: 'curated-4',
    title: 'Crafting Interfaces That Feel Alive: The Philosophy of Micro-Interactions',
    content: `Great design is rarely about flashy visual fireworks; it is about the quiet delight of responsive physics. When an interface reacts with natural easing curves, spring physics, and purposeful tactile feedback, software feels less like pixels and more like a crafted physical tool.

### The Power of Spatial Continuity
When an item expands into a detail view, keeping the focal elements continuously connected grounds the user's mental model and eliminates disorientation.

### Rules for Micro-Interactions:
- Respect reduced motion settings unconditionally.
- Keep transition durations between 150ms and 240ms.
- Use natural cubic-bezier curves rather than linear timing.`,
    categories: [{ _id: 'cat-design', name: 'Design' }],
    author: {
      _id: 'author-4',
      username: 'Kaito Tanaka',
      name: 'Kaito Tanaka',
      avatar: 'KT',
      bio: 'Product Designer exploring fluid human-computer interfaces.',
    },
    imageURL: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    views: 2100,
    reads: 1980,
    readRate: 94.2,
    likesCount: 215,
    commentsCount: 19,
  },
  {
    _id: 'curated-5',
    title: 'Lost in the Alleys of Kyoto: A Journey Through Ancient Tea Culture',
    content: `In the quiet residential pockets behind Gion, century-old machiya townhouses preserve centuries of ceremonial Uji matcha preparation. Here, the ritual of tea is not about speed; it is an exercise in mindfulness, seasonal awareness, and hospitality (Omotenashi).

Walking past cedar lanterns in the mist of early morning, you realize that traditional craftsmanship is not just surviving in modern Japan—it is quietly thriving.`,
    categories: [{ _id: 'cat-travel', name: 'Travel' }],
    author: {
      _id: 'author-5',
      username: 'Maya Lin',
      name: 'Maya Lin',
      avatar: 'ML',
      bio: 'Travel essayist and documentary photographer.',
    },
    imageURL: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    views: 1750,
    reads: 1610,
    readRate: 92.0,
    likesCount: 178,
    commentsCount: 22,
  },
  {
    _id: 'curated-6',
    title: 'The Science of Deep Sleep: Circadian Rhythms and Cognitive Recovery',
    content: `Slow-wave sleep and REM cycles are the biological foundation of memory consolidation, neural waste clearance, and emotional resilience. 

By aligning light exposure, meal timing, and evening wind-down rituals with natural melatonin secretion, cognitive output during waking hours increases significantly without relying on stimulant cycles.`,
    categories: [{ _id: 'cat-health', name: 'Health' }, { _id: 'cat-science', name: 'Science' }],
    author: {
      _id: 'author-6',
      username: 'Dr. Lucas Berg',
      name: 'Dr. Lucas Berg',
      avatar: 'LB',
      bio: 'Neuroscientist and sleep health researcher.',
    },
    imageURL: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    views: 1420,
    reads: 1310,
    readRate: 92.2,
    likesCount: 146,
    commentsCount: 16,
  },
];
