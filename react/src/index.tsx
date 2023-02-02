import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Header } from "./Header";
import "./index.css";

const Root = () => (
  <>
  <main>
        <Header />
        <section>
          <App />;
        </section>
      </main>
      <footer>
        <a
          href="https://github.com/lcabraja/AADBT-Project-LukaCabraja"
          target="_blank"
        >
          made with not enough sleep by lcabraja
        </a>
      </footer>
  </>
);

ReactDOM.render(<Root />, document.getElementById("root"));
