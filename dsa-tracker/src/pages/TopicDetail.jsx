import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topics, problems } from '../data/mockData';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import ProblemCard from '../components/ProblemCard';
import { API_BASE_URL } from '../config/api';

export default function TopicDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const topic = topics.find(t => t.id === parseInt(id));
    const topicProblems = problems[id] || [];

    const [activeFilter, setActiveFilter] = useState('All');
    const [completedProblems, setCompletedProblems] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Fetch user progress from API
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
                setCompletedProblems(new Set(data.data.completedProblems));
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();

        // Listen for problem toggles to refresh
        const handleToggle = () => {
            fetchProgress();
        };

        window.addEventListener('problemToggled', handleToggle);

        return () => {
            window.removeEventListener('problemToggled', handleToggle);
        };
    }, []);

    const solvedProblems = topicProblems.filter(p => completedProblems.has(p.id)).length;
    const totalProblems = topicProblems.length;
    const progress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    if (!topic) {
        return <div>Topic not found</div>;
    }

    const filters = ['All', 'Easy', 'Medium', 'Hard'];

    const filteredProblems = activeFilter === 'All'
        ? topicProblems
        : topicProblems.filter(p => p.difficulty === activeFilter.toUpperCase());

    const groupedProblems = filteredProblems.reduce((acc, problem) => {
        const category = problem.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(problem);
        return acc;
    }, {});

    const getCategoryStats = (category) => {
        const categoryProblems = topicProblems.filter(p => p.category === category);
        const solved = categoryProblems.filter(problem => completedProblems.has(problem.id)).length;
        const total = categoryProblems.length;
        return `${solved}/${total} Done`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="p-2">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">{topic.name.split('&')[0].trim()}</h1>
                    <button className="p-2">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
                {/* Topic Info Card */}
                <Card className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{topic.name}</h2>
                    {topic.description && (
                        <p className="text-sm md:text-base text-gray-600 mb-4">{topic.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm md:text-base font-medium text-gray-700">
                            {solvedProblems}/{totalProblems} Solved
                        </span>
                        <span className="text-sm md:text-base font-bold text-blue-600">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} color={topic.progressColor} height="h-3" />
                </Card>

                {/* Filters */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeFilter === filter
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Problems by Category */}
                {Object.entries(groupedProblems).map(([category, categoryProblems]) => {
                    const categoryColor = categoryProblems[0]?.categoryColor || 'border-gray-500';

                    return (
                        <div key={category} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-6 ${categoryColor.replace('border', 'bg')} rounded-full`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">{category}</h3>
                                        <span className="text-sm text-gray-500">{getCategoryStats(category)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {categoryProblems.map((problem) => (
                                    <ProblemCard
                                        key={problem.id}
                                        problem={problem}
                                        initialCompleted={completedProblems.has(problem.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Action Button - Mobile Only */}
            <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center z-40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
}
