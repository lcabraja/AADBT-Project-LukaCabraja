// @ts-ignore
import PocketBase from "pocketbase";
import React, { useState } from "react";
import "./header.css";

export const Header = () => {
  const pb = new PocketBase("https://aadbt.lcabraja.dev/");
  const [loggedIn, setLoggedIn] = useState(pb.authStore.isValid);

  return (
    <header>
      <div className="logo">
        <a href="/" title="Isstagram">
          <img src="/isstagram.png" />
        </a>
      </div>
      <ul>
        {loggedIn ? (
          <>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a
                onClick={() => {
                  pb.authStore.clear();
                  setLoggedIn(false);
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
};
