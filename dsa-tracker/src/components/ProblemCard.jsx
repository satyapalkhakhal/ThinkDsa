import { useState } from 'react';
import Card from './Card';
import Badge from './Badge';

export default function ProblemCard({ problem }) {
    const [isCompleted, setIsCompleted] = useState(problem.completed);

    const toggleComplete = (e) => {
        e.stopPropagation();
        setIsCompleted(!isCompleted);
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={toggleComplete}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {problem.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {problem.hasVideo && (
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {problem.hasNote && (
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                            {problem.hasSolution && (
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            )}
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    </div>

                    <Badge variant={problem.difficulty.toLowerCase()} className="mb-2">
                        {problem.difficulty}
                    </Badge>

                    {problem.hasNote && (
                        <div className="flex items-center gap-1 mb-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs text-gray-500">NOTE</span>
                        </div>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-1">{problem.description}</p>

                    <div className="flex items-center gap-3 mt-3">
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Note
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Solution
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                            Video
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
