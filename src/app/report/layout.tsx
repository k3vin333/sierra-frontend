import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f9f9f9] p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}