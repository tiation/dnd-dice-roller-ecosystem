#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('⚔️ Epic D&D Character Forge - Vercel Deployment Script');
console.log('');

// Check if already logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ Already logged in to Vercel');
} catch (error) {
  console.log('🔑 Need to login to Vercel first');
  console.log('');
  console.log('Please run ONE of these commands to login:');
  console.log('');
  console.log('1. For GitHub: vercel login');
  console.log('   Then select "Continue with GitHub"');
  console.log('');
  console.log('2. For Email: vercel login');
  console.log('   Then select "Continue with Email"');
  console.log('');
  console.log('After logging in, run this script again:');
  console.log('node deploy-vercel.js');
  process.exit(1);
}

console.log('🚀 Starting deployment...');

try {
  // Create vercel.json if it doesn't exist
  const vercelConfig = {
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "installCommand": "npm install",
    "functions": {
      "app/**/*.{js,ts}": {
        "maxDuration": 30
      }
    }
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('📝 Created vercel.json configuration');

  // Deploy to Vercel
  console.log('⚡ Deploying to Vercel...');
  const output = execSync('vercel --prod --yes --force', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });

  console.log('✅ Deployment successful!');
  console.log('');
  
  // Extract URL from output
  const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
  if (urlMatch) {
    const appUrl = urlMatch[0];
    console.log('🌟 Your Epic D&D Character Forge is now live at:');
    console.log(`🔗 ${appUrl}`);
    console.log('');
    
    console.log('🔧 Next Steps:');
    console.log('1. Visit the Vercel dashboard: https://vercel.com/dashboard');
    console.log('2. Go to your project settings');
    console.log('3. Add environment variables:');
    console.log('   - DATABASE_URL: file:./dev.db');
    console.log('   - NEXTAUTH_SECRET: (generate a random 32+ char string)');
    console.log(`   - NEXTAUTH_URL: ${appUrl}`);
    console.log('4. Redeploy to apply environment variables');
    console.log('');
    console.log('⚔️ Your legend begins now!');
  } else {
    console.log('Deployment output:', output);
  }

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('');
  console.log('🛠️ Troubleshooting:');
  console.log('1. Make sure you are logged in: vercel whoami');
  console.log('2. Check your internet connection');
  console.log('3. Try manual deployment: vercel --prod');
  process.exit(1);
}