import { useState } from "react";
import type { AppTab } from "./types";
import { Header } from "./components/layout/Header";
import { ImageStudioScreen } from "./components/image-studio/ImageStudioScreen";
import { HomeworkGradingScreen } from "./components/homework-grading/HomeworkGradingScreen";
import "./App.css";

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("studio");

  return (
    <div className="app-root">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        {activeTab === "studio" && <ImageStudioScreen />}
        {activeTab === "grading" && <HomeworkGradingScreen />}
      </main>
    </div>
  );
}

export default App;
