import React from 'react';

// This is a reusable layout component for our Login and Register pages.
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel (Illustration and Welcome Message) */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#008080] p-12 text-white">
                <div className="text-center max-w-sm">
                    <h1 className="text-3xl font-bold mb-4">LinkSpace</h1>
                    <div className="flex justify-center items-center my-12">
                        {/* Placeholder for the three profile pictures in a circle */}
                        <div className="relative w-48 h-48">
                            <img className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 h-16 w-16 rounded-full border-4 border-white object-cover" src="https://placehold.co/100x100/2563eb/ffffff?text=A" alt="User 1"/>
                            <img className="absolute bottom-0 left-0 h-16 w-16 rounded-full border-4 border-white object-cover" src="https://placehold.co/100x100/4ade80/ffffff?text=B" alt="User 2"/>
                            <img className="absolute bottom-0 right-0 h-16 w-16 rounded-full border-4 border-white object-cover" src="https://placehold.co/100x100/f97316/ffffff?text=C" alt="User 3"/>
                            <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-full"></div>
                        </div>
                    </div>
                    <h2 className="text-4xl font-semibold leading-tight">{title}</h2>
                    <p className="text-lg text-gray-200 mt-4">{subtitle}</p>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
