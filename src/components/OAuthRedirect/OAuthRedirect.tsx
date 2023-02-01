import {
    component$,
    Resource,
    useClientEffect$,
    useResource$,
    useStore,
  } from "@builder.io/qwik";
  import { useLocation } from "@builder.io/qwik-city";
  import type { AuthProviderInfo } from "pocketbase";
import { newPb } from "~/models/pocketbase";
  
  interface RedirectProps {
    providerName: "GitHub" | "Discord" | "Google";
  }
  
  export default component$((props: RedirectProps) => {
    const loc = useLocation();
    const redirectUrl = `https://aadbt.lcabraja.dev/auth/${props.providerName.toLowerCase()}`;
  
    const store = useStore<{
      provider?: AuthProviderInfo;
      success: boolean;
    }>({
      provider: undefined,
      success: false,
    });
  
    useClientEffect$(() => {
      try {
        store.provider = JSON.parse(
          localStorage.getItem("provider")!
        ) as AuthProviderInfo;
      } catch (err) {
        store.provider = undefined;
      }
    });
  
    const authResource = useResource$<string>(async (ctx) => {
      ctx.track(() => store.provider);
      if (store.provider === undefined) return "Missing provider info...";
      if (store.provider.state !== loc.query["state"]) return "State parameters don't match...";
  
      try {
        const pb = newPb();
        const authData = await pb
          .collection("users")
          .authWithOAuth2(
            store.provider.name,
            loc.query["code"],
            store.provider.codeVerifier,
            redirectUrl,
            {
              emailVisibility: false,
            }
          );
        store.success = true;
        return JSON.stringify(authData, null, 2);
      } catch (err) {
        return JSON.stringify(err, null, 2);
      }
    });
  
    return (
      <>
        <Resource
          value={authResource}
          onPending={() => <>Authenticating with {props.providerName}...</>}
          onResolved={(auth) => (
            <>
              {store.success ? (
                <p>Successfully Authenticated</p>
              ) : (
                <p>Failed to Authenticate</p>
              )}
              <pre>
                <code style="display: block;">{auth}</code>
              </pre>
            </>
          )}
        />
      </>
    );
  });
  