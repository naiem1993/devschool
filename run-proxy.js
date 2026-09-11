// run-proxy.js
const { spawn } = require('child_process');

const projectDir = 'C:\\Users\\Naiem\\Desktop\\devschool';

const child = spawn(
  'npx.cmd',
  ['-y', 'mcp-proxy', '--port', '4001', '--shell', '--', 'npx.cmd', '-y', 'next-devtools-mcp@latest'],
  {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true,
  }
);

child.on('exit', (code) => {
  console.log(`Proxy exited with code ${code}`);
  process.exit(code);
});