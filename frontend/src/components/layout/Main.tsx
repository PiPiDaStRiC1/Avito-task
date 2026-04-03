import { Outlet } from "react-router-dom";

export const Main = () => {
    return (
        <div className="max-h-full">
            <div className="max-w-8xl mx-auto p-5 sm:px-4 md:px-6">
                <Outlet />
            </div>
        </div>
    );
};
