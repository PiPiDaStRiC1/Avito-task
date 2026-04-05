import { Ads, AdItem, AdEdit } from "@/pages";
import { Main } from "@/components";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";


function App() {
    return (
        <>
            <Toaster toastOptions={{ duration: 1000 }} reverseOrder={false} />
            <Routes>
                <Route element={<Main />}>
                    <Route path="/ads" element={<Ads />} index />
                    <Route path="/ads/:id" element={<AdItem />} />
                    <Route path="/ads/:id/edit" element={<AdEdit />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
