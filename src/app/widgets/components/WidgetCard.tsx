// components/widgets/WidgetCard.tsx

type WidgetCardProps = {
    title: string;
    subtitle?: string;
    info?: React.ReactNode;
    badge?: string;
    footer?: React.ReactNode;
  };


  
  export default function WidgetCard({ title, subtitle, info, badge, footer }: WidgetCardProps) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between h-full border border-gray-200">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-700">{subtitle}</p>}
            </div>
            {badge && (
              <span className="text-xs bg-green-600 text-white font-semibold px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {info && (
            <div className="text-sm mt-2 text-gray-800">
              {info}
            </div>
          )}
        </div>
        {footer && (
          <div className="mt-4 text-xs text-gray-600">
            {footer}
          </div>
        )}
      </div>
    );
  }
  
  