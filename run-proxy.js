// run-proxy.js
const { spawn } = require('child_process');

// পথটি আপনার নিজের কম্পিউটার অনুযায়ী হতে পারে, যদি ভিন্ন হয় তবে পরিবর্তন করুন
const projectDir = 'C:\\Users\\Naiem\\Desktop\\devschool\\frontend';

const child = spawn(
  'npx.cmd', // Windows-এ .cmd ফাইল সরাসরি চালানোর জন্য
  ['-y', 'mcp-proxy', '--port', '4001', '--shell', '--', 'npx.cmd', '-y', 'next-devtools-mcp@latest'],
  {
    cwd: projectDir, // Next.js প্রজেক্টের ডিরেক্টরি
    stdio: 'inherit', // আউটপুট PM2 লগে পাঠাবে
    shell: true, // Windows-এ .cmd স্পন করার জন্য এটি অত্যন্ত জরুরি
  }
);

child.on('exit', (code) => {
  console.log(`Proxy exited with code ${code}`);
  process.exit(code);
});