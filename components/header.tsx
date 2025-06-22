import Link from 'next/link';
// import dynamic from 'next/dynamic';

// const DynamicThemeSwitch = dynamic(() => import('./theme-switch'), {
//   ssr: false,
// });

export default function Header() {
  return (
    <div className='fixed left-[50vw] top-[40px] w-[800px] translate-x-[-400px] rounded-full border-b border-stroke-soft-200 bg-white px-[10px] py-[6px]'>
      <header className='mx-auto flex h-14 max-w-5xl items-center justify-between px-[10px]'>
        <Link
          href='/'
          className='flex items-center gap-2 text-label-md text-text-strong-950'
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/images/logo.png'
            alt=''
            className='size-9 h-[50px] w-[50px] object-contain'
          />
        </Link>

        {/* <DynamicThemeSwitch /> */}
      </header>
    </div>
  );
}
