import { component$ } from "@builder.io/qwik";
import ReactCropper from "~/integrations/react/cropper";

export default component$(() => {
  return (
    <>
      <ReactCropper />
    </>
  );
});
