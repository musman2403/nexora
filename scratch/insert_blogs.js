
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser to avoid extra dependencies and respect security
function getEnv() {
  const envPath = path.resolve('.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      env[key.trim()] = value.join('=').trim();
    }
  });
  return env;
}

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const blogs = [
  {
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
    image_local: 'sustainable_luxury_architecture_1778692647914.png'
  },
  {
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
    image_local: 'real_estate_investment_1778692666426.png'
  },
  {
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
    image_local: 'ai_smart_homes_1778692692656.png'
  }
];

async function uploadAndInsert() {
  for (const blog of blogs) {
    console.log(`Processing: ${blog.title}`);
    
    // Upload image
    const imagePath = path.join(process.env.HOME || process.env.USERPROFILE, '.gemini/antigravity/brain/508ad52e-f40c-480b-82f3-76f74230ee43', blog.image_local);
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `blogs/${Date.now()}-${blog.image_local}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('projects')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`Error uploading ${blog.image_local}:`, uploadError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);

    // Insert blog
    const { error: insertError } = await supabase.from('blogs').insert([{
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: publicUrl
    }]);

    if (insertError) {
      console.error(`Error inserting blog ${blog.title}:`, insertError);
    } else {
      console.log(`Successfully added: ${blog.title}`);
    }
  }
}

uploadAndInsert();
