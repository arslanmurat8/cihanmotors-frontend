export default function VehicleSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-6 w-2/3 rounded-lg" />
        <div className="skeleton h-4 w-1/3 rounded-lg" />
        <div className="flex gap-4">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-14 rounded" />
        </div>
        <div className="skeleton h-12 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}
