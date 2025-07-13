import { Posts } from '@/components/posts';
import { Center, VStack } from '@/components/ui/layouts';

export default function Home() {
  return (
    <Center className='w-screen'>
      <VStack className='my-[80px] w-[80%] min-w-[800px] max-w-[960px] flex-col items-center bg-white sm:my-[60px]'>
        <div className='w-full'>
          <h4 className='mb-[20px] text-title-h4'>All Articles</h4>
          <Posts />
        </div>
      </VStack>
    </Center>
  );
}
