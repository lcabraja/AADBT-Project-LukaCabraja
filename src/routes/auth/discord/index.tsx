import { component$ } from "@builder.io/qwik";
import OAuthRedirect from "~/components/OAuthRedirect/OAuthRedirect";

export default component$(() => {
  return (
    <>
      <OAuthRedirect providerName="Discord" />
    </>
  );
});
