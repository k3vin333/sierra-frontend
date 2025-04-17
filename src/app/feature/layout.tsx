export default function FeatureLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {children}
        </div>
      </div>
    );
  } 