import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface Subject {
  name: string;
  color: string;
  data: DataPoint[];
}

interface ProgressChartProps {
  subjects?: Subject[];
}

const defaultSubjects: Subject[] = [
  {
    name: "All",
    color: "#581c87",
    data: [
      { label: "Test 1", value: 45 },
      { label: "Test 2", value: 79 },
      { label: "Test 3", value: 72 },
      { label: "Test 4", value: 68 },
      { label: "Test 5", value: 75 },
    ],
  },
  {
    name: "Maths",
    color: "#581c87",
    data: [
      { label: "Test 1", value: 50 },
      { label: "Test 2", value: 85 },
      { label: "Test 3", value: 70 },
      { label: "Test 4", value: 65 },
      { label: "Test 5", value: 80 },
    ],
  },
  {
    name: "Science",
    color: "#581c87",
    data: [
      { label: "Test 1", value: 40 },
      { label: "Test 2", value: 75 },
      { label: "Test 3", value: 78 },
      { label: "Test 4", value: 72 },
      { label: "Test 5", value: 70 },
    ],
  },
  {
    name: "English",
    color: "#581c87",
    data: [
      { label: "Test 1", value: 55 },
      { label: "Test 2", value: 80 },
      { label: "Test 3", value: 68 },
      { label: "Test 4", value: 70 },
      { label: "Test 5", value: 76 },
    ],
  },
];

const ProgressChart = ({ subjects = defaultSubjects }: ProgressChartProps) => {
  const [activeSubject, setActiveSubject] = useState("All");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const currentSubject = subjects.find(s => s.name === activeSubject) || subjects[0];
  const data = currentSubject.data;

  // Calculate SVG path for the area chart
  const width = 600;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding;

  const xStep = chartWidth / (data.length - 1);
  const yScale = (value: number) => chartHeight - (value / 100) * chartHeight + padding / 2;

  const linePath = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${yScale(point.value)}`)
    .join(' ');

  const areaPath = `${linePath} L ${padding + (data.length - 1) * xStep} ${chartHeight + padding / 2} L ${padding} ${chartHeight + padding / 2} Z`;

  return (
    <div className="w-full">
      {/* Subject Filters */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => setActiveSubject(subject.name)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors"
            style={{
              backgroundColor: activeSubject === subject.name ? '#581c87' : '#f5f5f5',
              color: activeSubject === subject.name ? '#ffffff' : '#737373',
            }}
          >
            {subject.name !== "All" && (
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#581c87' }}
              />
            )}
            {subject.name}
          </button>
        ))}
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