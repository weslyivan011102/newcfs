import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="grid min-h-screen place-items-center bg-gray-50 ">
            <div className="grid grid-cols-2 max-w-5xl w-full bg-white shadow-sm rounded-lg overflow-hidden ">
                {/* Left Section: Logo and Background */}
                <div className="flex items-center justify-center ">
                    <Link href="/">
                        <ApplicationLogo className="h-24 w-24 fill-current text-white" />
                    </Link>
                </div>

                {/* Right Section: Form */}
                <div className="flex items-center justify-center bg-gray-100">
                    <div className="w-full px-6 py-28 sm:max-w-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
