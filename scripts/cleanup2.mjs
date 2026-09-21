import fs from 'node:fs';
try { fs.unlinkSync('scripts/set-navlabel2.mjs'); console.log('deleted'); } catch { console.log('skip'); }
