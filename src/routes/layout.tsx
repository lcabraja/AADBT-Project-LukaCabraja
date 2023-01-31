import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
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
});
