import "./App.css";
import { APP_NAME } from "@/lib/constants";
import { SyncBadge } from "@/components/SyncBadge";

function App() {
	return (
		<>
			<SyncBadge />
			<div>{APP_NAME}</div>
		</>
	);
}

export default App;
