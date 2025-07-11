interface AIToolsStatsProps {
  stats: {
    total: number;
    categories: number;
    avgRating: string;
    freeTools: number;
  };
}

export function AIToolsStats({ stats }: AIToolsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">🤖</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{stats.total}</h3>
        <p className="text-dark-text-secondary">أداة متاحة</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">📂</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{stats.categories}</h3>
        <p className="text-dark-text-secondary">فئة مختلفة</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">⭐</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{stats.avgRating}</h3>
        <p className="text-dark-text-secondary">متوسط التقييم</p>
      </div>

      <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">🆓</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{stats.freeTools}</h3>
        <p className="text-dark-text-secondary">أداة مجانية</p>
      </div>
    </div>
  );
}
