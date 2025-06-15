'use client';

import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import { useEffect, useMemo, useState } from 'react';

const ItemContent: React.FC<{ data: number }> = ({ data }) => {
  const height =
    data % 10 === 0 ? 200 : data % 5 === 0 ? 220 : data % 7 ? 240 : 200;
  return (
    <div className='p-[5px]'>
      <div
        className='rounded-[10px] border bg-white p-[18px]'
        style={{ height }}
      >
        <h3 className='font-bold text-static-black'>CSS : flex 规则</h3>
      </div>
    </div>
  );
};

export function Posts() {
  const data = useMemo(() => {
    return Array.from({ length: 200 }, (_, index) => index);
  }, []);

  return (
    <div className='scroll-smooth'>
      <VirtuosoMasonry
        columnCount={3}
        data={data}
        style={{ height: 500 }}
        initialItemCount={50}
        ItemContent={ItemContent}
      />
    </div>
  );
}
