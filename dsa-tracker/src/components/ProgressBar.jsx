export default function ProgressBar({ progress, color = "bg-blue-600", height = "h-2" }) {
    return (
        <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
            <div
                className={`${height} ${color} rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
