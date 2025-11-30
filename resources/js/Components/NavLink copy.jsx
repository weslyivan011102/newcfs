import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex items-center px-3 py-2 my-0 transition-colors duration-300 transform rounded-lg ${
                active
                    ? "bg-blue-50 text-blue-700 dark:text-gray-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            } ${className}`}
        >
            {children}
        </Link>
    );
}
