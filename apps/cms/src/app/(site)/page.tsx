import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        margin: '0 auto',
        maxWidth: '720px',
        padding: '64px 24px',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Z1 CMS</h1>
      <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
        Payload 运行在 Cloudflare，作为独立内容后台和 API 服务。前端站点单独部署，
        通过 REST API 拉取内容。
      </p>
      <p style={{ marginTop: '24px' }}>
        打开 <Link href='/admin'>/admin</Link> 进入后台。
      </p>
    </main>
  );
}
