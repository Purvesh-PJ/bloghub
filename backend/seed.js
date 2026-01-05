const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user.model');
const Post = require('./models/post.model');
const Category = require('./models/category.model');
const Comment = require('./models/comment.model');
const Like = require('./models/like.model');
const Profile = require('./models/user-profile.model');

const { connectDB } = require('./config/db');

// Sample data
const categories = [
  'Technology',
  'Programming',
  'Web Development',
  'Design',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Business',
  'Science'
];

const users = [
  { username: 'john_doe', email: 'john@example.com', password: 'password123', bio: 'Full-stack developer passionate about React and Node.js' },
  { username: 'jane_smith', email: 'jane@example.com', password: 'password123', bio: 'UX Designer and tech enthusiast' },
  { username: 'mike_wilson', email: 'mike@example.com', password: 'password123', bio: 'DevOps engineer and cloud architect' },
  { username: 'sarah_jones', email: 'sarah@example.com', password: 'password123', bio: 'Frontend developer specializing in Vue.js' },
  { username: 'alex_brown', email: 'alex@example.com', password: 'password123', bio: 'Mobile app developer and startup founder' },
  { username: 'emily_davis', email: 'emily@example.com', password: 'password123', bio: 'Data scientist and machine learning enthusiast' },
  { username: 'chris_taylor', email: 'chris@example.com', password: 'password123', bio: 'Backend developer with expertise in Python' },
  { username: 'lisa_anderson', email: 'lisa@example.com', password: 'password123', bio: 'Product manager and agile coach' },
  { username: 'david_martin', email: 'david@example.com', password: 'password123', bio: 'Security researcher and ethical hacker' },
  { username: 'admin', email: 'admin@bloghub.com', password: 'admin123', bio: 'BlogHub Administrator', roles: ['user', 'admin'] }
];

const samplePosts = [
  {
    title: 'Getting Started with React 18: A Complete Guide',
    slug: 'getting-started-react-18',
    content: `<h2>Introduction to React 18</h2>
<p>React 18 brings exciting new features that improve performance and developer experience. In this comprehensive guide, we'll explore the key changes and how to leverage them in your projects.</p>
<h3>Concurrent Rendering</h3>
<p>One of the most significant additions is concurrent rendering, which allows React to prepare multiple versions of the UI at the same time. This means smoother user experiences and better responsiveness.</p>
<h3>Automatic Batching</h3>
<p>React 18 automatically batches state updates, even in promises, timeouts, and native event handlers. This reduces unnecessary re-renders and improves performance.</p>
<blockquote>The future of React is concurrent, and React 18 is the first step in that direction.</blockquote>
<p>Start experimenting with these features today and see the difference in your applications!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    visibility: 'public',
    categoryIndex: 1
  },
  {
    title: 'The Art of Clean Code: Best Practices for Developers',
    slug: 'art-of-clean-code',
    content: `<h2>Why Clean Code Matters</h2>
<p>Writing clean code is not just about making your code work—it's about making it readable, maintainable, and scalable. Let's dive into the principles that separate good code from great code.</p>
<h3>Meaningful Names</h3>
<p>Choose names that reveal intent. A variable name should tell you why it exists, what it does, and how it's used.</p>
<h3>Functions Should Do One Thing</h3>
<p>Each function should have a single responsibility. If you can extract another function from it, it's doing too much.</p>
<h3>Comments Are Not Always Good</h3>
<p>The best code is self-documenting. If you need a comment to explain what your code does, consider rewriting the code instead.</p>
<p>Remember: Code is read more often than it's written. Invest in readability!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    visibility: 'public',
    categoryIndex: 1
  },
  {
    title: 'Building Scalable APIs with Node.js and Express',
    slug: 'scalable-apis-nodejs-express',
    content: `<h2>Designing APIs That Scale</h2>
<p>Building APIs that can handle millions of requests requires careful planning and the right architecture. Here's how to build robust APIs with Node.js.</p>
<h3>Project Structure</h3>
<p>Organize your code into layers: routes, controllers, services, and models. This separation of concerns makes your code easier to test and maintain.</p>
<h3>Error Handling</h3>
<p>Implement centralized error handling with custom error classes. This ensures consistent error responses across your API.</p>
<h3>Rate Limiting</h3>
<p>Protect your API from abuse with rate limiting. Use libraries like express-rate-limit to implement this easily.</p>
<p>With these practices, your API will be ready for production!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    visibility: 'public',
    categoryIndex: 2
  },
  {
    title: 'Modern CSS Techniques Every Developer Should Know',
    slug: 'modern-css-techniques',
    content: `<h2>CSS Has Evolved</h2>
<p>Gone are the days of float-based layouts and vendor prefixes everywhere. Modern CSS is powerful, flexible, and actually enjoyable to write.</p>
<h3>CSS Grid</h3>
<p>CSS Grid is the most powerful layout system in CSS. It's two-dimensional, meaning it can handle both columns and rows simultaneously.</p>
<h3>CSS Custom Properties</h3>
<p>Variables in CSS! Define once, use everywhere. They cascade and can be updated with JavaScript.</p>
<h3>Container Queries</h3>
<p>The newest addition to CSS allows you to style elements based on their container's size, not just the viewport.</p>
<p>Embrace these modern techniques and write better CSS!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    visibility: 'public',
    categoryIndex: 3
  },
  {
    title: 'Introduction to Machine Learning for Beginners',
    slug: 'intro-machine-learning-beginners',
    content: `<h2>What is Machine Learning?</h2>
<p>Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.</p>
<h3>Types of Machine Learning</h3>
<p><strong>Supervised Learning:</strong> The algorithm learns from labeled training data.</p>
<p><strong>Unsupervised Learning:</strong> The algorithm finds patterns in unlabeled data.</p>
<p><strong>Reinforcement Learning:</strong> The algorithm learns through trial and error.</p>
<h3>Getting Started</h3>
<p>Start with Python and libraries like scikit-learn, TensorFlow, or PyTorch. Begin with simple projects and gradually increase complexity.</p>
<p>The journey of a thousand models begins with a single dataset!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    visibility: 'public',
    categoryIndex: 9
  },
  {
    title: 'Remote Work: Tips for Staying Productive',
    slug: 'remote-work-productivity-tips',
    content: `<h2>Thriving in Remote Work</h2>
<p>Remote work offers flexibility but comes with unique challenges. Here's how to stay productive and maintain work-life balance.</p>
<h3>Create a Dedicated Workspace</h3>
<p>Having a specific area for work helps your brain switch into "work mode" and improves focus.</p>
<h3>Establish a Routine</h3>
<p>Start and end work at consistent times. Include breaks and exercise in your schedule.</p>
<h3>Over-communicate</h3>
<p>In remote settings, communication is key. Be proactive about sharing updates and asking questions.</p>
<p>Remote work is a skill that improves with practice!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    visibility: 'public',
    categoryIndex: 4
  },
  {
    title: 'Docker for Developers: A Practical Guide',
    slug: 'docker-developers-practical-guide',
    content: `<h2>Why Docker?</h2>
<p>Docker solves the "it works on my machine" problem by packaging applications with their dependencies into containers.</p>
<h3>Key Concepts</h3>
<p><strong>Images:</strong> Read-only templates used to create containers.</p>
<p><strong>Containers:</strong> Running instances of images.</p>
<p><strong>Dockerfile:</strong> Instructions for building images.</p>
<h3>Best Practices</h3>
<p>Use multi-stage builds, minimize layers, and never store secrets in images.</p>
<p>Containerize your apps and deploy with confidence!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    visibility: 'public',
    categoryIndex: 0
  },
  {
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    content: `<h2>What's Next for the Web?</h2>
<p>The web platform continues to evolve rapidly. Here are the trends shaping web development this year.</p>
<h3>AI-Powered Development</h3>
<p>AI tools are becoming integral to the development workflow, from code completion to automated testing.</p>
<h3>Edge Computing</h3>
<p>Running code closer to users reduces latency and improves performance. Edge functions are becoming mainstream.</p>
<h3>Web Components</h3>
<p>Framework-agnostic components are gaining traction, enabling better interoperability.</p>
<p>Stay curious and keep learning!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    visibility: 'public',
    categoryIndex: 2
  },
  {
    title: 'Database Design Patterns for Modern Applications',
    slug: 'database-design-patterns',
    content: `<h2>Choosing the Right Database</h2>
<p>The database you choose can make or break your application. Let's explore different patterns and when to use them.</p>
<h3>SQL vs NoSQL</h3>
<p>SQL databases excel at complex queries and transactions. NoSQL databases offer flexibility and horizontal scaling.</p>
<h3>Normalization vs Denormalization</h3>
<p>Normalize for data integrity, denormalize for read performance. Often, you'll need both.</p>
<h3>Indexing Strategies</h3>
<p>Proper indexing can improve query performance by orders of magnitude. But over-indexing hurts write performance.</p>
<p>Design your database with your queries in mind!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    visibility: 'public',
    categoryIndex: 0
  },
  {
    title: 'Healthy Habits for Software Developers',
    slug: 'healthy-habits-developers',
    content: `<h2>Taking Care of Yourself</h2>
<p>Long hours at the computer can take a toll on your health. Here's how to stay healthy while coding.</p>
<h3>Ergonomics Matter</h3>
<p>Invest in a good chair, position your monitor at eye level, and keep your keyboard at the right height.</p>
<h3>Take Regular Breaks</h3>
<p>Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.</p>
<h3>Exercise Regularly</h3>
<p>Even a short walk can boost creativity and reduce stress. Make movement part of your routine.</p>
<p>Your health is your most important asset!</p>`,
    imageURL: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    visibility: 'public',
    categoryIndex: 7
  }
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
  'One of the best articles I have read on this topic.'
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Profile.deleteMany({});

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(
      categories.map(name => ({ name, posts: [] }))
    );
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
        posts: []
      });
      await user.save();

      // Create profile
      const profile = new Profile({
        user: user._id,
        bio: userData.bio,
        followings: [],
        followers: [],
        postCount: 0,
        followingsCount: 0,
        followersCount: 0
      });
      await profile.save();

      user.profile = profile._id;
      await user.save();

      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create posts
    console.log('Creating posts...');
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const user = createdUsers[i % createdUsers.length];
      const category = createdCategories[postData.categoryIndex];

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
        views: []
      });
      await post.save();

      // Update user's posts
      user.posts.push(post._id);
      await user.save();

      // Update user's profile post count
      await Profile.findOneAndUpdate(
        { user: user._id },
        { $inc: { postCount: 1 } }
      );

      // Update category
      category.posts.push(post._id);
      await category.save();

      createdPosts.push(post);
    }
    console.log(`Created ${createdPosts.length} posts`);

    // Add comments to posts
    console.log('Adding comments...');
    let commentCount = 0;
    for (const post of createdPosts) {
      const numComments = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];

        const comment = new Comment({
          user: randomUser._id,
          message: randomComment,
          likes: [],
          dislikes: [],
          replies: [],
          replyCount: 0
        });
        await comment.save();

        post.comments.push(comment._id);
        commentCount++;
      }
      await post.save();
    }
    console.log(`Added ${commentCount} comments`);

    // Add likes to posts
    console.log('Adding likes...');
    let likeCount = 0;
    for (const post of createdPosts) {
      const numLikes = Math.floor(Math.random() * 6) + 2;
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < Math.min(numLikes, shuffledUsers.length); i++) {
        const like = new Like({
          user: shuffledUsers[i]._id,
          posts: post._id
        });
        await like.save();
        post.likes.push(like._id);
        likeCount++;
      }
      await post.save();
    }
    console.log(`Added ${likeCount} likes`);

    // Add some followers
    console.log('Adding followers...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numFollowers = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < numFollowers; j++) {
        const followerIndex = (i + j + 1) % createdUsers.length;
        if (followerIndex !== i) {
          await Profile.findOneAndUpdate(
            { user: user._id },
            { 
              $addToSet: { followers: createdUsers[followerIndex]._id },
              $inc: { followersCount: 1 }
            }
          );
          await Profile.findOneAndUpdate(
            { user: createdUsers[followerIndex]._id },
            { 
              $addToSet: { followings: user._id },
              $inc: { followingsCount: 1 }
            }
          );
        }
      }
    }
    console.log('Added followers');

    console.log('\n✅ Seed completed successfully!');
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
