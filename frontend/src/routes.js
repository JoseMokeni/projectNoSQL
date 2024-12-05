import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Abonnes from "./pages/Abonnes";
import Emprunts from "./pages/Emprunts";

export const routes = [
  {
    path: "/",
    component: <Dashboard />,
    label: "Tableau de bord",
  },
  {
    path: "/documents",
    component: <Documents />,
    label: "Documents",
  },
  {
    path: "/abonnes",
    component: <Abonnes />,
    label: "Abonnés",
  },
  {
    path: "/emprunts",
    component: <Emprunts />,
    label: "Emprunts",
  },
];
