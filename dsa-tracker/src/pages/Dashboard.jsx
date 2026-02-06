import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { topics, problems } from '../data/mockData';
import Card from '../components/Card';
import TopicCard from '../components/TopicCard';
import BottomNav from '../components/BottomNav';
import { API_BASE_URL } from '../config/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        solved: 0,
        total: 450,
        todayIncrease: 0,
        streak: 0,
        percentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch stats from API
    const fetchStats = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/progress/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats({
                    solved: data.data.completed,
                    total: data.data.total,
                    percentage: Math.round((data.data.completed / data.data.total) * 100) || 0,
                    todayIncrease: 0, // TODO: Implement
                    streak: 0 // TODO: Implement
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            // If no user or token, redirect to login
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser({
                ...userData,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4F46E5&color=fff`
            });

            // Fetch stats from API
            fetchStats(token);
            setLoading(false);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate, refreshKey]);

    // Listen for problem toggle events
    useEffect(() => {
        const handleProblemToggle = () => {
            const token = localStorage.getItem('token');
            if (token) {
                fetchStats(token);
            }
        };

        window.addEventListener('problemToggled', handleProblemToggle);

        return () => {
            window.removeEventListener('problemToggled', handleProblemToggle);
        };
    }, []);

    const fetchUserStats = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/progress/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(prev => ({
                    ...prev,
                    todayIncrease: 0, // TODO: Implement today's increase tracking
                    streak: 0, // TODO: Implement streak tracking
                }));
            } else {
                console.error('Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to login
        navigate('/login');
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
            {/* Header */}
            <header className="bg-gray-100 border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">THINKSCOPE</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                        <img
                            src={user.avatar}
                            alt="User avatar"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover cursor-pointer"
                            onClick={() => navigate('/profile')}
                            title="Profile"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
                {/* Greeting */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Hello, {user.name}!</h2>
                    <p className="text-gray-600 md:text-lg">Ready to crack some problems today?</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search topics or problems..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {stats.todayIncrease > 0 && (
                                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                    +{stats.todayIncrease} today
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Solved</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.solved} <span className="text-base text-gray-400 font-normal">/ {stats.total}</span>
                        </p>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Streak</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.streak} <span className="text-base text-gray-400 font-normal">Days</span>
                        </p>
                    </Card>
                </div>

                {/* Topics Section */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Your Topics</h3>
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        See All
                    </button>
                </div>

                {/* Topics List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {topics.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
            </div>

            {/* Floating Action Button - Mobile Only */}
            <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center z-40">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Bottom Nav - Mobile Only */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
