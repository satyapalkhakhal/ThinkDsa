export default function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        easy: "bg-green-100 text-green-700",
        medium: "bg-orange-100 text-orange-700",
        hard: "bg-red-100 text-red-700",
        success: "bg-green-100 text-green-700"
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
