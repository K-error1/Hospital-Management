import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  bgColor?: string;
  href?: string;
}

export default function StatCard({ title, value, icon, change, changeType = 'neutral', bgColor = 'bg-white', href }: StatCardProps) {
  const navigate = useNavigate();
  const changeColors = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const content = (
    <div className={`${bgColor} rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 ${href ? 'cursor-pointer hover:border-indigo-200 hover:-translate-y-0.5 group' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            {title}
            {href && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 text-xs">→</span>}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <button onClick={() => navigate(href)} className="text-left w-full block">
        {content}
      </button>
    );
  }

  return content;
}
