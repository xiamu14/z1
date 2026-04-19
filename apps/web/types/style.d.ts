// CSS file imports (supports both CSS modules and global CSS)
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
