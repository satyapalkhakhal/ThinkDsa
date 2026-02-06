import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import { API_BASE_URL } from '../config/api';

export default function ProblemCard({ problem, initialCompleted = false }) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const toggleComplete = async (e) => {
        e.stopPropagation();

        // Optimistic update
        const previousState = isCompleted;
        setIsCompleted(!isCompleted);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/progress/toggle-number`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ problemId: problem.id })
            });

            if (!response.ok) {
                throw new Error('Failed to update progress');
            }

            const data = await response.json();
            setIsCompleted(data.data.isCompleted);

            // Dispatch custom event to update progress across components
            window.dispatchEvent(new Event('problemToggled'));
        } catch (error) {
            console.error('Error toggling progress:', error);
            // Revert on error
            setIsCompleted(previousState);
            alert('Failed to update progress. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/problem/${problem.id}`);
    };

    const handleYouTubeClick = (e) => {
        e.stopPropagation();
        if (problem.youtubeUrl) {
            window.open(problem.youtubeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleLeetCodeClick = (e) => {
        e.stopPropagation();
        if (problem.leetcodeUrl) {
            window.open(problem.leetcodeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Card
            className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex items-start gap-3">
                <div onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={toggleComplete}
                        disabled={isLoading}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium">{problem.number}</span>
                            <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                {problem.title}
                            </h3>
                        </div>
                        <Badge variant={problem.difficulty} size="sm">
                            {problem.difficulty}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{problem.description}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full border ${problem.categoryColor} bg-white`}>
                            {problem.category}
                        </span>

                        <div className="flex items-center gap-1 ml-auto">
                            {problem.hasNote && (
                                <span className="text-xs text-gray-400" title="Has notes">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                            {problem.hasSolution && (
                                <span className="text-xs text-gray-400" title="Has solution">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                            {problem.hasVideo && problem.youtubeUrl && (
                                <button
                                    onClick={handleYouTubeClick}
                                    className="text-xs text-red-600 hover:text-red-700"
                                    title="Watch video tutorial"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                </button>
                            )}
                            {problem.leetcodeUrl && (
                                <button
                                    onClick={handleLeetCodeClick}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                    title="Open in LeetCode"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
