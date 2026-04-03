import { Ads, AdItem } from "@/pages";
import { Main } from "@/components";
import { Routes, Route } from "react-router-dom";

// TODO:
// 1) не забыть сделать юнит-тесты с использование jest

function App() {
    return (
        <Routes>
            <Route element={<Main />}>
                <Route path="/ads" element={<Ads />} index />
                <Route path="/ads/:id" element={<AdItem />} />
            </Route>
        </Routes>
    );
}

export default App;
