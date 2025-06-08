export function SidebarSkeleton() {
  return (
    <div className='w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl h-screen'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between p-4 border-b border-purple-700/50 min-h-[65px]'>
        <div className='flex items-center'>
          <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-3 shadow-lg animate-pulse'>
            <div className='h-5 w-5 bg-white/20 rounded'></div>
          </div>
          <div className='h-5 w-24 bg-white/20 rounded animate-pulse'></div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <nav className='mt-4 pb-4'>
        <div className='px-3 space-y-1'>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className='flex items-center px-3 py-2.5 rounded-xl'>
              <div className='h-5 w-5 bg-purple-300/20 rounded mr-3 animate-pulse'></div>
              <div className='h-4 w-20 bg-purple-300/20 rounded animate-pulse'></div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
