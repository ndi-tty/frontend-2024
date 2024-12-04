import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error";
import RootLayout from "./components/layout/rootLayout";
import Home from "./pages/home";
import Equipe from "./pages/equipe";
import FlappyBird from "./pages/flappy-bird";
import FAQ from "./pages/faq";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      //   loader={rootLoader}
      //   action={HomeNavAction}
      errorElement={<ErrorPage />}
    >
      <Route index element={<Home />} />
      <Route path="about" element={<FAQ />} />
      <Route path="team" element={<Equipe />} />
      <Route path="flappy-bird" element={<FlappyBird />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
