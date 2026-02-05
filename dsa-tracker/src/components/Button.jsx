export default function Button({ children, variant = "primary", size = "md", className = "", onClick }) {
    const baseStyles = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300",
        outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
