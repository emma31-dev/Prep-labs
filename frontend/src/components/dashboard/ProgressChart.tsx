import { useState } from "react";

interface TestScore {
  label: string;
  value: number;
  date?: string;
}

interface ProgressChartProps {
  testScores?: TestScore[];
}

const ProgressChart = ({ testScores = [] }: ProgressChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Take last 4 test scores
  const data = testScores.slice(-4);
  const hasData = data.length > 0;

  // Empty state
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#f3e8ff' }}
        >
          <svg 
            className="w-10 h-10" 
            style={{ color: '#581c87' }} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#171717' }}>
          No tests taken yet
        </h3>
        <p className="text-sm text-center max-w-xs" style={{ color: '#737373' }}>
          Complete your first quiz to see your progress chart here. Your last 4 test scores will be displayed.
        </p>
        <button
          className="mt-6 px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#581c87' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
        >
          Take a Quiz
        </button>
      </div>
    );
  }

  // Calculate SVG path for the area chart
  const width = 600;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding;

  const xStep = chartWidth / (data.length - 1 || 1);
  const yScale = (value: number) => chartHeight - (value / 100) * chartHeight + padding / 2;

  const linePath = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${yScale(point.value)}`)
    .join(' ');

  const areaPath = `${linePath} L ${padding + (data.length - 1) * xStep} ${chartHeight + padding / 2} L ${padding} ${chartHeight + padding / 2} Z`;

  // Calculate average score
  const avgScore = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  return (
    <div className="w-full">
      {/* Stats Summary */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm" style={{ color: '#737373' }}>Average Score</span>
          <div className="text-2xl font-bold" style={{ color: '#581c87' }}>{avgScore}%</div>
        </div>
        <div className="text-right">
          <span className="text-sm" style={{ color: '#737373' }}>Tests Shown</span>
          <div className="text-2xl font-bold" style={{ color: '#171717' }}>{data.length}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height + 40}`} className="w-full h-auto">
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((value) => (
            <text
              key={value}
              x={padding - 10}
              y={yScale(value) + 4}
              textAnchor="end"
              className="text-xs"
              fill="#737373"
            >
              {value}%
            </text>
          ))}

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <line
              key={value}
              x1={padding}
              y1={yScale(value)}
              x2={width - padding}
              y2={yScale(value)}
              stroke="#e5e5e5"
              strokeDasharray="4"
            />
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#581c87"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, i) => (
            <g key={i}>
              <circle
                cx={padding + i * xStep}
                cy={yScale(point.value)}
                r={hoveredPoint === i ? 8 : 6}
                fill="#581c87"
                stroke="#ffffff"
                strokeWidth="2"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Tooltip */}
              {hoveredPoint === i && (
                <g>
                  <rect
                    x={padding + i * xStep - 25}
                    y={yScale(point.value) - 35}
                    width="50"
                    height="24"
                    rx="4"
                    fill="#171717"
                  />
                  <text
                    x={padding + i * xStep}
                    y={yScale(point.value) - 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="text-xs font-medium"
                  >
                    {point.value}%
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((point, i) => (
            <text
              key={i}
              x={padding + i * xStep}
              y={height + 20}
              textAnchor="middle"
              className="text-xs"
              fill="#737373"
            >
              {point.label}
            </text>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#581c87" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ProgressChart;
