export default function Card({ children, className = "", onClick, hover = false }) {
    return (
        <div
            className={`bg-white rounded-xl shadow-sm ${hover ? 'hover:shadow-md cursor-pointer transition-shadow duration-200' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
