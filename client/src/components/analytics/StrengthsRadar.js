import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { getCategoryName } from '../../utils/formatters';

/**
 * Strengths Radar Component
 * Visualization of user proficiency across different categories
 */
const StrengthsRadar = ({ progress }) => {
    // Transform progress object into data array for RadarChart
    // progress format: { 'number-series': 150, 'patterns': 50, ... }

    const categories = [
        'number-series',
        'patterns',
        'puzzles',
        'aptitude',
        'reasoning'
    ];

    const data = categories.map(cat => ({
        subject: getCategoryName(cat),
        A: progress && progress[cat] ? Math.min(progress[cat], 300) : 20, // Cap at 300 for visualization, min 20 for visibility
        fullMark: 300
    }));

    return (
        <div className="analytics-card strengths-radar">
            <h3>Skill Profile</h3>
            <div className="chart-container" style={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#444', fontSize: 11, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 300]} tick={false} axisLine={false} />
                        <Radar
                            name="Skill Points"
                            dataKey="A"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StrengthsRadar;
