import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

/**
 * Activity Heatmap Component
 * Visualization of user activity over the last 7 days (mock data for now)
 */
const ActivityHeatmap = ({ recentScores }) => {
    // Process recent scores to get daily activity count
    // Since we might not have real historical dates in the simple mock data, 
    // we'll generate a realistic "Last 7 Days" pattern based on recent activity or random for demo

    // Mock data generator for "Last 7 Days"
    const generateLast7Days = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date().getDay(); // 0 is Sunday

        // Rotate days array so today is last
        const rotatedDays = [...days.slice(today === 0 ? 6 : today), ...days.slice(0, today === 0 ? 6 : today)];
        // Actually we want today at the end.
        // If today is Wed (3), we want [Thu, Fri, Sat, Sun, Mon, Tue, Wed]

        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1]; // Make Monday index 0 for array
            last7.push({
                day: dayName,
                questions: Math.floor(Math.random() * 10) + (i === 0 ? 5 : 0) // Ensure today has some activity
            });
        }
        return last7;
    };

    const data = generateLast7Days();

    return (
        <div className="analytics-card activity-heatmap">
            <h3>Weekly Activity</h3>
            <div className="chart-container" style={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                            dataKey="questions"
                            fill="#3B82F6"
                            radius={[4, 4, 4, 4]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
