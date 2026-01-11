const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user.model');
const Post = require('./models/post.model');
const Category = require('./models/category.model');
const Comment = require('./models/comment.model');
const Like = require('./models/like.model');
const Profile = require('./models/user-profile.model');
const View = require('./models/view.model');
const Analytics = require('./models/analytics.model');

const { connectDB } = require('./config/db');

// Categories matching the homepage slideshow
const categories = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Science',
  'Travel',
  'Programming',
  'Health',
  'Food',
  'Photography',
];

const users = [
  { username: 'john_doe', email: 'john@example.com', password: 'password123', bio: 'Full-stack developer passionate about React and Node.js. Building the future one line at a time.' },
  { username: 'jane_smith', email: 'jane@example.com', password: 'password123', bio: 'UX Designer crafting beautiful digital experiences. Design is not just what it looks like, it is how it works.' },
  { username: 'mike_wilson', email: 'mike@example.com', password: 'password123', bio: 'DevOps engineer and cloud architect. Automating everything that can be automated.' },
  { username: 'sarah_jones', email: 'sarah@example.com', password: 'password123', bio: 'Frontend developer specializing in Vue.js and modern CSS. Pixel perfectionist.' },
  { username: 'alex_brown', email: 'alex@example.com', password: 'password123', bio: 'Mobile app developer and startup founder. Turning ideas into reality.' },
  { username: 'emily_davis', email: 'emily@example.com', password: 'password123', bio: 'Data scientist exploring the world through numbers. ML enthusiast and Python lover.' },
  { username: 'chris_taylor', email: 'chris@example.com', password: 'password123', bio: 'Backend developer with expertise in Python and Go. Performance optimization geek.' },
  { username: 'lisa_anderson', email: 'lisa@example.com', password: 'password123', bio: 'Product manager and agile coach. Bridging the gap between tech and business.' },
  { username: 'david_martin', email: 'david@example.com', password: 'password123', bio: 'Security researcher and ethical hacker. Keeping the internet safe one bug at a time.' },
  { username: 'emma_white', email: 'emma@example.com', password: 'password123', bio: 'Technical writer and content creator. Making complex topics simple and engaging.' },
  { username: 'james_lee', email: 'james@example.com', password: 'password123', bio: 'AI researcher working on next-gen language models. The future is intelligent.' },
  { username: 'olivia_chen', email: 'olivia@example.com', password: 'password123', bio: 'Blockchain developer and Web3 enthusiast. Decentralizing the world.' },
  { username: 'ryan_garcia', email: 'ryan@example.com', password: 'password123', bio: 'Game developer creating immersive experiences. Play is the highest form of research.' },
  { username: 'sophia_kim', email: 'sophia@example.com', password: 'password123', bio: 'Cloud solutions architect at a Fortune 500. Scaling systems to millions of users.' },
  { username: 'admin', email: 'admin@bloghub.com', password: 'admin123', bio: 'BlogHub Administrator', roles: ['user', 'admin'] },
];

const samplePosts = [
  // Technology
  { title: 'Getting Started with React 18: A Complete Guide', slug: 'getting-started-react-18', content: `# Introduction to React 18\n\nReact 18 brings exciting new features that improve performance and developer experience. In this comprehensive guide, we'll explore the key changes.\n\n## Concurrent Rendering\n\nOne of the most significant additions is concurrent rendering, which allows React to prepare multiple versions of the UI at the same time.\n\n## Automatic Batching\n\nReact 18 automatically batches state updates, even in promises and timeouts. This reduces unnecessary re-renders.\n\n> The future of React is concurrent, and React 18 is the first step in that direction.\n\nStart experimenting with these features today!`, imageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', visibility: 'public', category: 'Technology' },
  { title: 'Docker for Developers: A Practical Guide', slug: 'docker-developers-practical-guide', content: `# Why Docker?\n\nDocker solves the "it works on my machine" problem by packaging applications with their dependencies into containers.\n\n## Key Concepts\n\n- **Images:** Read-only templates used to create containers\n- **Containers:** Running instances of images\n- **Dockerfile:** Instructions for building images\n\n## Best Practices\n\nUse multi-stage builds, minimize layers, and never store secrets in images.\n\nContainerize your apps and deploy with confidence!`, imageURL: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800', visibility: 'public', category: 'Technology' },
  { title: 'The Future of Web Development in 2024', slug: 'future-web-development-2024', content: `# What's Next for the Web?\n\nThe web platform continues to evolve rapidly. Here are the trends shaping web development.\n\n## AI-Powered Development\n\nAI tools are becoming integral to the development workflow, from code completion to automated testing.\n\n## Edge Computing\n\nRunning code closer to users reduces latency and improves performance.\n\n## Web Components\n\nFramework-agnostic components are gaining traction, enabling better interoperability.\n\nStay curious and keep learning!`, imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', visibility: 'public', category: 'Technology' },
  
  // Design
  { title: 'Modern CSS Techniques Every Developer Should Know', slug: 'modern-css-techniques', content: `# CSS Has Evolved\n\nGone are the days of float-based layouts. Modern CSS is powerful and enjoyable to write.\n\n## CSS Grid\n\nCSS Grid is the most powerful layout system. It's two-dimensional, handling both columns and rows.\n\n## CSS Custom Properties\n\nVariables in CSS! Define once, use everywhere. They cascade and can be updated with JavaScript.\n\n## Container Queries\n\nStyle elements based on their container's size, not just the viewport.\n\nEmbrace these modern techniques!`, imageURL: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800', visibility: 'public', category: 'Design' },
  { title: 'UI Design Principles for Better User Experience', slug: 'ui-design-principles-ux', content: `# Designing for Humans\n\nGreat UI design is invisible. Users should focus on their tasks, not the interface.\n\n## Consistency is Key\n\nUse consistent patterns, colors, and typography throughout your application.\n\n## Visual Hierarchy\n\nGuide users' attention with size, color, and spacing. The most important elements should stand out.\n\n## Feedback Matters\n\nEvery action should have a visible response. Users need to know their input was received.\n\nDesign with empathy!`, imageURL: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', visibility: 'public', category: 'Design' },
  { title: 'Color Theory for Digital Designers', slug: 'color-theory-digital-designers', content: `# The Power of Color\n\nColor influences emotion, guides attention, and creates brand recognition.\n\n## The Color Wheel\n\nUnderstand complementary, analogous, and triadic color schemes to create harmonious designs.\n\n## Accessibility\n\nEnsure sufficient contrast ratios. Not everyone sees color the same way.\n\n## Psychology of Color\n\n- Blue: Trust and stability\n- Green: Growth and nature\n- Red: Energy and urgency\n\nChoose colors intentionally!`, imageURL: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', visibility: 'public', category: 'Design' },

  // Business
  { title: 'Building a Successful Startup: Lessons Learned', slug: 'building-successful-startup', content: `# The Startup Journey\n\nStarting a company is a rollercoaster. Here's what I learned building mine.\n\n## Start with the Problem\n\nDon't fall in love with your solution. Fall in love with the problem you're solving.\n\n## Build in Public\n\nShare your journey. The community support and feedback are invaluable.\n\n## Hire Slow, Fire Fast\n\nCulture fit matters as much as skills. One toxic person can destroy a team.\n\nEmbrace the chaos!`, imageURL: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', visibility: 'public', category: 'Business' },
  { title: 'Remote Team Management Best Practices', slug: 'remote-team-management', content: `# Leading from Anywhere\n\nManaging remote teams requires intentional communication and trust.\n\n## Over-communicate\n\nIn remote settings, there's no such thing as too much communication. Be proactive.\n\n## Async by Default\n\nNot everything needs a meeting. Use async communication for most things.\n\n## Build Culture Intentionally\n\nCulture doesn't happen by accident remotely. Create rituals and traditions.\n\nTrust your team!`, imageURL: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', visibility: 'public', category: 'Business' },

  // Lifestyle
  { title: 'Remote Work: Tips for Staying Productive', slug: 'remote-work-productivity-tips', content: `# Thriving in Remote Work\n\nRemote work offers flexibility but comes with unique challenges.\n\n## Create a Dedicated Workspace\n\nHaving a specific area for work helps your brain switch into "work mode".\n\n## Establish a Routine\n\nStart and end work at consistent times. Include breaks and exercise.\n\n## Set Boundaries\n\nJust because you can work anytime doesn't mean you should.\n\nRemote work is a skill that improves with practice!`, imageURL: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800', visibility: 'public', category: 'Lifestyle' },
  { title: 'Healthy Habits for Software Developers', slug: 'healthy-habits-developers', content: `# Taking Care of Yourself\n\nLong hours at the computer can take a toll. Here's how to stay healthy.\n\n## Ergonomics Matter\n\nInvest in a good chair, position your monitor at eye level.\n\n## Take Regular Breaks\n\nFollow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.\n\n## Exercise Regularly\n\nEven a short walk can boost creativity and reduce stress.\n\nYour health is your most important asset!`, imageURL: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', visibility: 'public', category: 'Lifestyle' },
  { title: 'Work-Life Balance in the Tech Industry', slug: 'work-life-balance-tech', content: `# Finding Balance\n\nThe tech industry glorifies hustle culture. But burnout is real.\n\n## Set Clear Boundaries\n\nDefine when work ends. Stick to it. Your Slack messages can wait.\n\n## Pursue Hobbies\n\nHave interests outside of tech. It makes you a better developer and person.\n\n## Learn to Say No\n\nYou can't do everything. Focus on what matters most.\n\nBalance is not a destination, it's a practice.`, imageURL: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', visibility: 'public', category: 'Lifestyle' },

  // Science
  { title: 'Introduction to Machine Learning for Beginners', slug: 'intro-machine-learning-beginners', content: `# What is Machine Learning?\n\nML enables systems to learn from experience without being explicitly programmed.\n\n## Types of Machine Learning\n\n- **Supervised Learning:** Learns from labeled data\n- **Unsupervised Learning:** Finds patterns in unlabeled data\n- **Reinforcement Learning:** Learns through trial and error\n\n## Getting Started\n\nStart with Python and scikit-learn. Begin with simple projects.\n\nThe journey of a thousand models begins with a single dataset!`, imageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', visibility: 'public', category: 'Science' },
  { title: 'Understanding Neural Networks', slug: 'understanding-neural-networks', content: `# How Neural Networks Work\n\nNeural networks are inspired by the human brain, but they're really just math.\n\n## Layers and Neurons\n\nInput layer receives data, hidden layers process it, output layer gives results.\n\n## Training Process\n\nNetworks learn by adjusting weights through backpropagation.\n\n## Applications\n\nImage recognition, natural language processing, game playing, and more.\n\nThe possibilities are endless!`, imageURL: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', visibility: 'public', category: 'Science' },

  // Travel
  { title: 'Digital Nomad Guide: Working from Anywhere', slug: 'digital-nomad-guide', content: `# The Nomad Life\n\nWork from beaches, mountains, or cafes around the world.\n\n## Essential Gear\n\nReliable laptop, noise-canceling headphones, portable charger, and good backpack.\n\n## Best Destinations\n\nBali, Lisbon, Chiang Mai, and Mexico City offer great nomad communities.\n\n## Staying Productive\n\nFind coworking spaces, maintain routines across time zones.\n\nThe world is your office!`, imageURL: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', visibility: 'public', category: 'Travel' },
  { title: 'Best Cities for Tech Workers', slug: 'best-cities-tech-workers', content: `# Where to Build Your Career\n\nLocation matters for networking, opportunities, and quality of life.\n\n## San Francisco\n\nStill the heart of tech, but expensive. Great for startups and VC access.\n\n## Austin\n\nGrowing tech scene, no state income tax, vibrant culture.\n\n## Remote-First\n\nMore companies are fully remote. Location becomes a lifestyle choice.\n\nChoose what fits your life!`, imageURL: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', visibility: 'public', category: 'Travel' },

  // Programming
  { title: 'The Art of Clean Code: Best Practices', slug: 'art-of-clean-code', content: `# Why Clean Code Matters\n\nWriting clean code is about readability, maintainability, and scalability.\n\n## Meaningful Names\n\nChoose names that reveal intent. A variable name should tell you why it exists.\n\n## Functions Should Do One Thing\n\nEach function should have a single responsibility.\n\n## Comments Are Not Always Good\n\nThe best code is self-documenting. If you need a comment, consider rewriting.\n\nCode is read more often than it's written!`, imageURL: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', visibility: 'public', category: 'Programming' },
  { title: 'Building Scalable APIs with Node.js', slug: 'scalable-apis-nodejs', content: `# Designing APIs That Scale\n\nBuilding APIs that handle millions of requests requires careful planning.\n\n## Project Structure\n\nOrganize into layers: routes, controllers, services, and models.\n\n## Error Handling\n\nImplement centralized error handling with custom error classes.\n\n## Rate Limiting\n\nProtect your API from abuse with rate limiting.\n\nYour API will be ready for production!`, imageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', visibility: 'public', category: 'Programming' },
  { title: 'TypeScript Best Practices in 2024', slug: 'typescript-best-practices-2024', content: `# Why TypeScript?\n\nTypeScript adds type safety to JavaScript, catching errors before runtime.\n\n## Strict Mode\n\nAlways enable strict mode. It catches more errors and makes your code safer.\n\n## Use Type Inference\n\nDon't over-annotate. Let TypeScript infer types when it can.\n\n## Utility Types\n\nMaster Partial, Required, Pick, and Omit for flexible type manipulation.\n\nTypes are documentation that never goes stale!`, imageURL: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', visibility: 'public', category: 'Programming' },
  { title: 'Database Design Patterns for Modern Apps', slug: 'database-design-patterns', content: `# Choosing the Right Database\n\nThe database you choose can make or break your application.\n\n## SQL vs NoSQL\n\nSQL excels at complex queries. NoSQL offers flexibility and horizontal scaling.\n\n## Indexing Strategies\n\nProper indexing improves query performance by orders of magnitude.\n\n## Caching\n\nUse Redis or Memcached to reduce database load.\n\nDesign your database with your queries in mind!`, imageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800', visibility: 'public', category: 'Programming' },

  // Health
  { title: 'Mental Health in Tech: Breaking the Stigma', slug: 'mental-health-tech', content: `# It's Okay to Not Be Okay\n\nThe tech industry has high rates of burnout and mental health issues.\n\n## Recognize the Signs\n\nExhaustion, cynicism, and reduced productivity are warning signs.\n\n## Seek Help\n\nTherapy, coaching, and support groups are valuable resources.\n\n## Create Safe Spaces\n\nTeams should normalize mental health conversations.\n\nYour mental health matters!`, imageURL: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800', visibility: 'public', category: 'Health' },

  // Food
  { title: 'Quick Healthy Meals for Busy Developers', slug: 'quick-healthy-meals-developers', content: `# Eating Well While Coding\n\nYou don't need hours to eat healthy. Here are quick options.\n\n## Meal Prep Sundays\n\nSpend 2 hours prepping meals for the week. Your future self will thank you.\n\n## Healthy Snacks\n\nNuts, fruits, and yogurt beat chips and candy for sustained energy.\n\n## Stay Hydrated\n\nKeep water at your desk. Dehydration affects focus and mood.\n\nFuel your brain properly!`, imageURL: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', visibility: 'public', category: 'Food' },

  // Photography
  { title: 'Smartphone Photography Tips for Beginners', slug: 'smartphone-photography-tips', content: `# Great Photos with Your Phone\n\nYou don't need expensive gear to take stunning photos.\n\n## Lighting is Everything\n\nNatural light is your best friend. Shoot during golden hour for magic.\n\n## Composition Rules\n\nRule of thirds, leading lines, and framing create visual interest.\n\n## Edit Thoughtfully\n\nLess is more. Subtle adjustments beat heavy filters.\n\nThe best camera is the one you have with you!`, imageURL: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', visibility: 'public', category: 'Photography' },
];

const comments = [
  'Great article! This really helped me understand the concept better.',
  'Thanks for sharing! I learned something new today.',
  'Excellent explanation. Looking forward to more content like this.',
  'This is exactly what I was looking for. Very well written!',
  'Bookmarked for future reference. Super helpful!',
  'Could you elaborate more on this topic in a future post?',
  'I implemented this in my project and it works perfectly!',
  'Clear and concise. Thank you for this guide.',
  'This changed my perspective on the subject. Great insights!',
  'One of the best articles I have read on this topic.',
  'Finally someone explains this properly! Thank you!',
  'Sharing this with my team. Everyone should read this.',
  'The examples really helped clarify the concepts.',
  'Would love to see a follow-up post on advanced topics.',
  'This saved me hours of debugging. Much appreciated!',
];

// Helper to get random date within last 60 days
function randomDate(daysAgo = 60) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

async function seed() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Category.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Profile.deleteMany({}),
      View.deleteMany({}),
      Analytics.deleteMany({}),
    ]);

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(
      categories.map((name) => ({ name, posts: [] }))
    );
    const categoryMap = {};
    createdCategories.forEach((cat) => (categoryMap[cat.name] = cat));
    console.log(`Created ${createdCategories.length} categories`);

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        roles: userData.roles || ['user'],
        posts: [],
        createdAt: randomDate(90),
      });
      await user.save();

      const profile = new Profile({
        user: user._id,
        bio: userData.bio,
        followings: [],
        followers: [],
        postCount: 0,
        followingsCount: 0,
        followersCount: 0,
      });
      await profile.save();

      user.profile = profile._id;
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create posts with varied dates
    console.log('Creating posts...');
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const user = createdUsers[i % (createdUsers.length - 1)]; // Exclude admin
      const category = categoryMap[postData.category];

      const post = new Post({
        user: user._id,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        imageURL: postData.imageURL,
        visibility: postData.visibility,
        categories: [category._id],
        likes: [],
        comments: [],
        views: [],
        createdAt: randomDate(45),
      });
      await post.save();

      user.posts.push(post._id);
      await user.save();
      await Profile.findOneAndUpdate({ user: user._id }, { $inc: { postCount: 1 } });

      category.posts.push(post._id);
      await category.save();

      createdPosts.push(post);
    }
    console.log(`Created ${createdPosts.length} posts`);

    // Add comments
    console.log('Adding comments...');
    let commentCount = 0;
    for (const post of createdPosts) {
      const numComments = Math.floor(Math.random() * 6) + 2;
      for (let i = 0; i < numComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * (createdUsers.length - 1))];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];

        const comment = new Comment({
          user: randomUser._id,
          message: randomComment,
          likes: [],
          dislikes: [],
          replies: [],
          replyCount: 0,
          date: new Date(post.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
        await comment.save();
        post.comments.push(comment._id);
        commentCount++;
      }
      await post.save();
    }
    console.log(`Added ${commentCount} comments`);

    // Add likes
    console.log('Adding likes...');
    let likeCount = 0;
    for (const post of createdPosts) {
      const numLikes = Math.floor(Math.random() * 10) + 3;
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.min(numLikes, shuffledUsers.length); i++) {
        const like = new Like({ user: shuffledUsers[i]._id, posts: post._id });
        await like.save();
        post.likes.push(like._id);
        likeCount++;
      }
      await post.save();
    }
    console.log(`Added ${likeCount} likes`);

    // Add views (for analytics)
    console.log('Adding views...');
    let viewCount = 0;
    for (const post of createdPosts) {
      const numViews = Math.floor(Math.random() * 50) + 10;
      for (let i = 0; i < numViews; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const view = new View({ user: randomUser._id, post: post._id });
        await view.save();
        post.views.push(view._id);
        viewCount++;
      }
      await post.save();
    }
    console.log(`Added ${viewCount} views`);

    // Create analytics records
    console.log('Creating analytics...');
    for (const post of createdPosts) {
      const analytics = new Analytics({
        blogPost: post._id,
        totalPageViews: post.views.length + Math.floor(Math.random() * 100),
        totalLikes: post.likes.length,
        totalComments: post.comments.length,
      });
      await analytics.save();
    }
    console.log(`Created analytics for ${createdPosts.length} posts`);

    // Add followers
    console.log('Adding followers...');
    let followerCount = 0;
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numFollowers = Math.floor(Math.random() * 8) + 2;

      for (let j = 0; j < numFollowers; j++) {
        const followerIndex = Math.floor(Math.random() * createdUsers.length);
        if (followerIndex !== i) {
          await Profile.findOneAndUpdate(
            { user: user._id },
            { $addToSet: { followers: createdUsers[followerIndex]._id }, $inc: { followersCount: 1 } }
          );
          await Profile.findOneAndUpdate(
            { user: createdUsers[followerIndex]._id },
            { $addToSet: { followings: user._id }, $inc: { followingsCount: 1 } }
          );
          followerCount++;
        }
      }
    }
    console.log(`Added ${followerCount} follow relationships`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${createdUsers.length} users`);
    console.log(`   • ${createdPosts.length} posts`);
    console.log(`   • ${createdCategories.length} categories`);
    console.log(`   • ${commentCount} comments`);
    console.log(`   • ${likeCount} likes`);
    console.log(`   • ${viewCount} views`);
    console.log('\n📝 Test Accounts:');
    console.log('─────────────────────────────────────');
    console.log('Regular User: john@example.com / password123');
    console.log('Admin User:   admin@bloghub.com / admin123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
