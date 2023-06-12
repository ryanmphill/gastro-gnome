import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { GastroGnome } from "./components/GastroGnome"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <GastroGnome />
    </BrowserRouter>
)