import {
  component$,
  Resource,
  useClientEffect$,
  useResource$,
} from "@builder.io/qwik";
import { type AuthMethodsList } from "pocketbase";
import { newPb } from "~/models/pocketbase";

export default component$(() => {
  const authResource = useResource$<AuthMethodsList>(async () => {
    const pb = newPb();
    return await pb.collection("users").listAuthMethods();
  });

  return (
    <div>
      <ul>
        <Resource
          value={authResource}
          onPending={() => <li>Loading OAuth2 providers...</li>}
          onResolved={(authMethods) => {
            return <OAuthProviders methods={authMethods} />;
          }}
        />
      </ul>
    </div>
  );
});

interface OAuthProps {
  methods: AuthMethodsList;
}

export const OAuthProviders = component$((props: OAuthProps) => {
  useClientEffect$(() => {
    document.querySelectorAll("a[provider]").forEach((a) => {
      (a as HTMLAnchorElement).onclick = () => {
        localStorage.setItem(
          "provider",
          a.attributes.getNamedItem("provider")!.value
        );
        console.info(localStorage.getItem("provider"));
      };
    });
  });

  return (
    <>
      {props.methods.authProviders
        .sort((providerA, providerB) =>
          providerA.name.localeCompare(providerB.name)
        )
        .map((provider) => (
          <li>
            <a
              {...{ provider: JSON.stringify(provider) }}
              href={
                provider.authUrl +
                `https://aadbt.lcabraja.dev/auth/${provider.name}`
              }
            >
              Login with {provider.name}
            </a>
          </li>
        ))
        .flat(1)}
    </>
  );
});
