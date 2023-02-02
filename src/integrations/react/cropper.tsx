import { qwikify$ } from "@builder.io/qwik-react";
import Cropper from "react-cropper";
import styles from "../../node_modules/cropperjs/dist/cropper.css?inline";
// import "./Demo.css";
import { component$, useStore, useStylesScoped$ } from "@builder.io/qwik";

export const RC = qwikify$((props: { image: string; cropper: any }) => {
  return (
    <Cropper
      style={{ height: 400, width: "100%" }}
      zoomTo={0.5}
      initialAspectRatio={1}
      preview=".img-preview"
      src={props.image}
      viewMode={1}
      minCropBoxHeight={10}
      minCropBoxWidth={10}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
      onInitialized={(instance) => {
        props.cropper = instance;
      }}
      guides={true}
    />
  );
});

export const ReactCropper = component$(() => {
  useStylesScoped$(styles);
  const store = useStore<{ image: string; cropData: string; cropper: any }>({
    image: "https://pic.onlinewebfonts.com/svg/img_24073.png",
    cropData: "#",
    cropper: undefined,
  });

  return (
    <div>
      <div style={{ width: "100%" }}>
        <input
          type="file"
          onChange$={(e: any) => {
            e.preventDefault();
            let files;
            if (e.dataTransfer) {
              files = e.dataTransfer.files;
            } else if (e.target) {
              files = e.target.files;
            }
            const reader = new FileReader();
            reader.onload = () => {
              store.image = reader.result as string;
            };
            reader.readAsDataURL(files[0]);
          }}
        />
        <button>Use default img</button>
        <br />
        <br />
        <RC client:load />
      </div>
      <div>
        <div class="box" style={{ width: "50%", float: "right" }}>
          <h1>Preview</h1>
          <div
            class="img-preview"
            style={{ width: "100%", float: "left", height: "300px" }}
          />
        </div>
        <div
          class="box"
          style={{ width: "50%", float: "right", height: "300px" }}
        >
          <h1>
            <span>Crop</span>
            <button
              style={{ float: "right" }}
              onClick$={() => {
                if (typeof store.cropper !== "undefined") {
                  store.cropData = store.cropper.getCroppedCanvas().toDataURL();
                }
              }}
            >
              Crop Image
            </button>
          </h1>
          <img style={{ width: "100%" }} src={store.cropData} alt="cropped" />
        </div>
      </div>
      <br style={{ clear: "both" }} />
    </div>
  );
});

export default ReactCropper;
