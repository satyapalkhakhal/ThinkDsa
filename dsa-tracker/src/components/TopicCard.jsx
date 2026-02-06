import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../data/mockData';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { API_BASE_URL } from '../config/api';

export default function TopicCard({ topic }) {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [solvedCount, setSolvedCount] = useState(0);

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/progress/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const completedSet = new Set(data.data.completedProblems);

                const topicProblems = problems[topic.id] || [];
                if (topicProblems.length === 0) {
                    setProgress(0);
                    setSolvedCount(0);
                    return;
                }

                const solved = topicProblems.filter(p => completedSet.has(p.id)).length;
                const progressPercent = Math.round((solved / topicProblems.length) * 100);
                setProgress(progressPercent);
                setSolvedCount(solved);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    useEffect(() => {
        fetchProgress();

        const handleProblemToggle = () => {
            fetchProgress();
        };

        window.addEventListener('problemToggled', handleProblemToggle);

        return () => {
            window.removeEventListener('problemToggled', handleProblemToggle);
        };
    }, [topic.id]);

    return (
        <Card hover onClick={() => navigate(`/topic/${topic.id}`)}>
            <div className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 ${topic.iconBg} ${topic.iconColor} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                    {topic.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{topic.totalProblems} Problems</p>
                    <ProgressBar progress={progress} color={topic.progressColor} />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{progress}%</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Card>
    );
}
