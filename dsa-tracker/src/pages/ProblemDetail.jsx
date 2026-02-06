import { useParams, useNavigate } from 'react-router-dom';
import { problems } from '../data/mockData';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function ProblemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the problem across all topics
    let problem = null;
    for (const topicProblems of Object.values(problems)) {
        problem = topicProblems.find(p => p.id === parseInt(id));
        if (problem) break;
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Not Found</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeVideoId(problem.youtubeUrl);

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">{problem.number}</h1>
                    <button
                        onClick={() => window.open(problem.leetcodeUrl, '_blank')}
                        className="p-2"
                        title="Open in LeetCode"
                    >
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
                {/* Problem Info */}
                <Card className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{problem.title}</h2>
                        <Badge variant={problem.difficulty.toLowerCase()}>
                            {problem.difficulty}
                        </Badge>
                    </div>
                    <p className="text-gray-700 text-lg">{problem.description}</p>

                    <div className="flex items-center gap-4 mt-6">
                        <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Solve on LeetCode
                        </a>
                        {problem.youtubeUrl && (
                            <a
                                href={problem.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Tutorial
                            </a>
                        )}
                    </div>
                </Card>

                {/* YouTube Video Embed */}
                {videoId && (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Video Tutorial</h3>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={problem.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Card>
                )}

                {/* Notes Section */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Add Note
                        </button>
                    </div>
                    {problem.hasNote ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-gray-700">Your notes will appear here...</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No notes yet. Click "Add Note" to get started.</p>
                    )}
                </Card>

                {/* Solution Section */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Solution</h3>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Add Solution
                        </button>
                    </div>
                    {problem.hasSolution ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-700 font-mono text-sm">Your solution code will appear here...</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No solution yet. Click "Add Solution" to save your code.</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
