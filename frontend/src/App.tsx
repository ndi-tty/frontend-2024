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
import WhereIsCharlie from "./pages/where-is-charlie";
import { useEffect } from "react";

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
      <Route path="where-is-charlie" element={<WhereIsCharlie />} />
    </Route>
  )
);

function App() {
  useEffect(() => {
    // @ts-expect-error matomo
    // eslint-disable-next-line no-var
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });

    // eslint-disable-next-line no-var
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://matomo.moreiradj.net/js/container_ZetIg1f3.js";
    // @ts-expect-error matomo
    s.parentNode.insertBefore(g, s);
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
