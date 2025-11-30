import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Left Section: Logo and Background */}
            <div className="flex w-1/2 items-center justify-center bg-[#015162]">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24 fill-current text-white" />
                </Link>
            </div>

            {/* Right Section: Form */}
            <div className="flex w-1/2 items-center justify-center bg-gray-100">
                <div className="w-full overflow-hidden  px-6 py-8  sm:max-w-lg ">
                    {children}
                </div>
            </div>
        </div>
    );
}
