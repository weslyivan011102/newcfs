const SkeletonCard = () => {
   return (
      <div className="p-4 border rounded-lg shadow bg-gray-100 animate-pulse">
         <div className="h-4 w-1/3 bg-gray-300 rounded mb-3"></div>
         <div className="h-3 w-2/3 bg-gray-300 rounded mb-2"></div>
         <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
         <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
      </div>
   );
};

export default SkeletonCard;
