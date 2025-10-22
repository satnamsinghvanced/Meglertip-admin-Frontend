const TableSkeleton = () => {
  return (
    <div role="status" className="space-y-2.5 animate-pulse w-full">
      <div className="h-7 mb-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
      <div className="h-7 mb-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
      <div className="h-7 mb-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
      <div className="h-7 mb-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
      <div className="h-7 mb-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
    </div>
  );
};

const DetailsSkeleton = () => {
  return (
    <div role="status" className="flex flex-col lg:flex-row gap-5 animate-pulse">
      <div className="flex h-[25rem] min-w-[19rem] lg:w-[19rem] rounded-lg bg-gradient-to-r dark:from-slate-400 dark:to-slate-500 from-gray-150 to-gray-200">
        <div role="status" className="w-full lg:max-w-sm p-4 border border-gray-200 rounded shadow md:p-6 dark:border-gray-700">
          <div className="flex items-center justify-center h-48 mb-4 dark:bg-gray-700">
            <svg className="w-32 h-32 text-gray-400 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </div>
          <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-700 mb-4"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-400 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="flex h-[25rem] w-full rounded-lg">
        <div role="status" className="w-full p-4 rounded shadow md:p-6 bg-gradient-to-r dark:from-slate-400 dark:to-slate-500 from-gray-150 to-gray-200">
          <div className="h-12 bg-gray-400 rounded dark:bg-gray-700 mb-3"></div>
          <div className="h-28 bg-gray-400 rounded dark:bg-gray-700 mb-3"></div>
          <div className="h-28 bg-gray-400 rounded dark:bg-gray-700 mb-3"></div>
          <div className="h-12 bg-gray-400 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};


export {
  TableSkeleton,
  DetailsSkeleton
};
