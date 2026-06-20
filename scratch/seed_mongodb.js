import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

// Parse .env manually
function getEnv() {
  const envPath = path.resolve('.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      env[key.trim()] = value.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    }
  });
  return env;
}

const env = getEnv();
const mongoUri = env.MONGODB_URI;

if (!mongoUri) {
  console.error('Error: MONGODB_URI not found in .env');
  process.exit(1);
}

const blogs = [
  {
    id: 1,
    title: 'The Rise of Sustainable Luxury: Architecture in 2026',
    excerpt: 'Exploring how eco-conscious design is redefining high-end residential projects through material innovation and energy efficiency.',
    content: `Architecture in 2026 has reached a pivotal turning point where luxury is no longer defined by excess, but by harmony with the natural environment. At Nexora Ventures, we are witnessing a surge in demand for "Net-Zero Luxury" — homes that offer uncompromising comfort while maintaining a minimal carbon footprint.

### Material Innovation
The modern luxury home now incorporates cross-laminated timber (CLT) and carbon-sequestering concrete. These materials are not just sustainable; they provide a warmth and texture that traditional steel and glass cannot match.

### Energy Autonomy
With the integration of advanced photovoltaic skins and residential-scale hydrogen fuel cells, today’s high-end properties are becoming entirely self-sufficient. This autonomy is the ultimate luxury in an increasingly unpredictable climate.

### Biophilic Integration
We are no longer just building next to nature; we are building within it. Internal vertical forests and water filtration systems that mimic natural wetlands are becoming standard features in our upcoming developments.

As we look toward the future, Nexora remains committed to pushing the boundaries of what sustainable architecture can achieve.`,
    author: 'Nexora Design Team',
    category: 'Architecture',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    views: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Strategic Real Estate Investment in Emerging Markets',
    excerpt: 'A deep dive into the most promising regions for real estate growth this decade and why timing is everything.',
    content: `The global real estate landscape is shifting rapidly. While traditional markets in New York and London remain stable, the real growth opportunities are emerging in unexpected regions.

### The Rise of Secondary Cities
As remote work becomes the permanent standard, secondary cities with high qualities of life are seeing unprecedented capital inflow. Investors who identify these hubs early are seeing returns that far outpace traditional metropolitan cores.

### Technology-Driven Valuations
At Nexora, we utilize proprietary AI algorithms to predict neighborhood appreciation before it hits the mainstream media. By analyzing transit patterns, retail permits, and social sentiment, we can identify "sleeping giant" markets.

### Diversification through Tokenization
The future of investment is fractional. Nexora is exploring blockchain-based ownership models that allow investors to diversify their portfolios across multiple high-yield properties with lower entry points.

Understanding these shifts is crucial for any modern investor. Nexora Investment Group is here to navigate these complexities and secure your legacy.`,
    author: 'Nexora Investment Group',
    category: 'Investment',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    views: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Smart Homes: Integrating AI into Living Spaces',
    excerpt: 'How artificial intelligence is transforming the way we interact with our homes, moving beyond simple automation to true predictive living.',
    content: `The "Smart Home" of yesterday was a collection of connected gadgets. The "Intelligent Home" of 2026 is a unified living organism powered by predictive AI.

### From Automation to Intuition
Imagine a home that adjusts its lighting and acoustic profile based on your circadian rhythms and stress levels. AI-integrated living spaces at Nexora developments don't wait for your command; they anticipate your needs.

### Privacy and Local Processing
In an era of data concerns, Nexora's smart systems prioritize local edge computing. Your habits and preferences are processed within the home's own server, ensuring that your private life remains truly private.

### Seamless Architectural Integration
We believe technology should be felt, not seen. Our designs incorporate invisible haptic interfaces and directional audio systems that remove the need for unsightly screens and speakers.

The integration of AI is not about complexity; it's about simplicity. It's about a home that works for you, so you can focus on what truly matters.`,
    author: 'Nexora Tech Insights',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    views: 24,
    created_at: new Date().toISOString()
  }
];

const projects = [
  {
    id: 1,
    title: 'Premio Homes',
    status: 'In Progress',
    description: 'A premium luxury residential development designed with cross-laminated timber, passive cooling, and smart grid automation.',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    features: ['Passive Cooling', 'Smart Grid Automation', 'Cross-Laminated Timber', 'Private Solar Farm'],
    investment: {
      price: '$150,000',
      plan: 'Once',
      duration: '18 Months'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Nexora Heights',
    status: 'Already Done',
    description: 'Our signature commercial office spaces featuring a full biophilic vertical forest, net-zero operations, and rooftop hydrogen power cells.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    features: ['Biophilic Vertical Forest', 'Net-Zero Operations', 'Hydrogen Fuel Cells', 'Executive Lounge'],
    investment: {
      price: '$4,500',
      plan: 'Per Month',
      duration: '24 Months'
    },
    created_at: new Date().toISOString()
  }
];

const partners = [
  {
    id: 1,
    name: 'Atlas Constructors',
    logo_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=300&q=80',
    details: 'Primary construction contractor for all Nexora Ventures developments.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Lahore Realty Group',
    logo_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
    details: 'Exclusive brokerage and consulting partner.',
    created_at: new Date().toISOString()
  }
];

async function seed() {
  console.log('--- SEEDING MONGODB DATABASE ---');
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db('nexora');

    // 1. Seed blogs
    const blogsCol = db.collection('blogs');
    const existingBlogs = await blogsCol.countDocuments();
    if (existingBlogs === 0) {
      console.log('Seeding blogs...');
      await blogsCol.insertMany(blogs);
      console.log('Blogs seeded successfully.');
    } else {
      console.log('Blogs collection already has data. Skipping.');
    }

    // 2. Seed projects
    const projectsCol = db.collection('projects');
    const existingProjects = await projectsCol.countDocuments();
    if (existingProjects === 0) {
      console.log('Seeding projects...');
      await projectsCol.insertMany(projects);
      console.log('Projects seeded successfully.');
    } else {
      console.log('Projects collection already has data. Skipping.');
    }

    // 3. Seed partners
    const partnersCol = db.collection('partners');
    const existingPartners = await partnersCol.countDocuments();
    if (existingPartners === 0) {
      console.log('Seeding partners...');
      await partnersCol.insertMany(partners);
      console.log('Partners seeded successfully.');
    } else {
      console.log('Partners collection already has data. Skipping.');
    }

    console.log('--- SEEDING COMPLETE ---');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

seed();
