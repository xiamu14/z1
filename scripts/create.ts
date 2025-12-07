const template = `---
title: 
description: 
cover: 
---

### {title}
`;

import { writeFileSync } from 'fs';
import { join } from 'path';

const postsDir = join(process.cwd(), 'posts');
const timestamp = Date.now();
const filename = `post-${timestamp}.md`;
const filepath = join(postsDir, filename);

writeFileSync(filepath, template);

console.log(`Created new post: ${filename}`);
