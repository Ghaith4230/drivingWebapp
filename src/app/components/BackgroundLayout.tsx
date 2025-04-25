import React, { ReactNode } from "react";
import Image from "next/image";

// Define the prop types, including children
interface BackgroundLayoutProps {
    children: ReactNode; // Explicitly define children prop as ReactNode
}

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children }) => {
    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-full">
                <Image
                    src="/car.jpeg"
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Blur effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0"></div>

            {/* Children */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default BackgroundLayout;
