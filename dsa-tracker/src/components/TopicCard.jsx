import { useNavigate } from 'react-router-dom';
import Card from './Card';
import ProgressBar from './ProgressBar';

export default function TopicCard({ topic }) {
    const navigate = useNavigate();

    return (
        <Card hover onClick={() => navigate(`/topic/${topic.id}`)}>
            <div className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 ${topic.iconBg} ${topic.iconColor} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                    {topic.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{topic.totalProblems} Problems</p>
                    <ProgressBar progress={topic.progress} color={topic.progressColor} />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{topic.progress}%</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Card>
    );
}
