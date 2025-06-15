import { glob } from 'glob';

export async function getFile() {
  const files = await glob('posts/**/*.md');
  console.log('files', files);
}

async function main() {
  await getFile();
}

main();
