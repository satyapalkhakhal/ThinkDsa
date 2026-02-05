import { user, topics } from '../data/mockData';
import Card from '../components/Card';
import TopicCard from '../components/TopicCard';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button className="p-2 md:hidden">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">THINKSCOPE</h1>
                    <img
                        src={user.avatar}
                        alt="User avatar"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
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
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                +{user.stats.todayIncrease} today
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Solved</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {user.stats.solved} <span className="text-base text-gray-400 font-normal">/ {user.stats.total}</span>
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
                            {user.stats.streak} <span className="text-base text-gray-400 font-normal">Days</span>
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
