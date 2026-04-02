import { Ads } from "@/pages";
import { Main } from "@/components";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route element={<Main />}>
                <Route path="/" element={<Ads />} index />
            </Route>
        </Routes>
    );
}

export default App;
