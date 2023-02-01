import {
  component$,
  useClientEffect$,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
// import PocketBase from "pocketbase";

import styles from "./header.css?inline";
import { newPb } from "~/models/pocketbase";
export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore({ loggedin: false });

  useClientEffect$(() => {
    const pb = newPb();
    store.loggedin = pb.authStore.isValid;
  });

  return (
    <header>
      <div class="logo">
        <a href="/" title="Isstagram">
          <img src="/isstagram.png" />
        </a>
      </div>
      <ul>
        {store.loggedin ? (
          <>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a
                onClick$={() => {
                  const pb = newPb();
                  pb.authStore.clear();
                  store.loggedin = false;
                }}
                href="#"
              >
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/register">Register</a>
            </li>
          </>
        )}
      </ul>
    </header>
  );
});
