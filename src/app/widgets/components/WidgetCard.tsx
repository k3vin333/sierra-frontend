type WidgetCardProps = {
  title: string;
  subtitle?: string;
  info?: React.ReactNode;
  badge?: string;
  footer?: React.ReactNode;
};



export default function WidgetCard({ title, subtitle, info, badge, footer }: WidgetCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between h-full border border-gray-200">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-base font-bold text-gray-900 truncate" 
              title={title}
            >
              {title}
            </h3>
            {subtitle && <p className="text-sm text-gray-700 mt-1.5">{subtitle}</p>}
          </div>
          {badge && (
            <span className="text-xs bg-green-600 text-white font-semibold px-2.5 py-1.5 rounded-full ml-2 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        {info && (
          <div className="text-sm mt-4 text-gray-800">
            {info}
          </div>
        )}
      </div>
      {footer && (
        <div className="mt-5 pt-3.5 text-xs text-gray-600 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}
