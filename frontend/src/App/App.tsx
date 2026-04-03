import { Ads } from "@/pages";
import { Main } from "@/components";
import { Routes, Route } from "react-router-dom";

// TODO:
// 1) не забыть сделать юнит-тесты с использование jest


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
