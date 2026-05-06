import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/pages.css";

const routerBaseName = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter basename={routerBaseName}>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
