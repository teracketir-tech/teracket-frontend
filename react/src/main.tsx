import { createRoot } from "react-dom/client";
import "./index.css";
import { DirectionProvider } from "@/components/ui/direction";
import App from "./App";

createRoot(document.getElementById("root")!).render(
    <DirectionProvider dir="rtl">
        <App />
    </DirectionProvider>,
);
