import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./App.css";
// @ts-ignore
import { filterImage, sepia } from "lena.js";
// @ts-ignore
import PocketBase from "pocketbase";

export const App: React.FC = () => {
  const [image, setImage] = useState("#");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState<any>();
  const [formData, _] = useState(new FormData());

  const [description, changeDescription] = useState("");
  const [hashtags, changeHashtags] = useState("");
  const [error, changeError] = useState("");

  const pb = new PocketBase("https://aadbt.lcabraja.dev/");
  formData.append("poster", pb.authStore.model.id);

  const setNewImage = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    formData.append("original", files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCroppedImage = () => {
    try {
      if (typeof cropper !== "undefined") {
        resizedataURL(cropper.getCroppedCanvas().toDataURL(), 512, 512).then(
          // @ts-ignore
          (cropData) => setCropData(cropData)
        );
      }
    } catch {
      console.log("No source Image!");
    }
  };

  const resizedataURL = (
    datas: string,
    wantedWidth: number,
    wantedHeight: number
  ) => {
    return new Promise(async function (resolve, reject) {
      // We create an image to receive the Data URI
      var img = document.createElement("img");

      // When the event "onload" is triggered we can resize the image.
      img.onload = function () {
        // We create a canvas and get its context.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        var aspectRatio =
          // @ts-ignore
          this.width < this.height
            ? // @ts-ignore
              this.width / this.height
            : // @ts-ignore
              this.height / this.width;

        // @ts-ignore
        if (this.width < this.height) {
          canvas.width = ~~(wantedWidth * aspectRatio);
          canvas.height = wantedHeight;
        } else {
          canvas.width = ~~(wantedWidth * aspectRatio);
          canvas.height = wantedHeight;
        }

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = ~~(wantedHeight * aspectRatio);

        // @ts-ignore
        console.log({ datauriw: this.width, dataurih: this.height });
        // @ts-ignore
        ctx.drawImage(this, 0, 0, wantedWidth, ~~(wantedHeight * aspectRatio));

        var dataURI = canvas.toDataURL();

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;
    });
  };

  const getFilteredImage = () => {
    try {
      var originalImage = document.getElementById("original-image");
      var canvas = document.createElement("canvas");
      var filter = sepia; // TODO: Chain of Responsibility? (chaining canvases)
      filterImage(canvas, filter, originalImage);
      resizedataURL(canvas.toDataURL(), 512, 512).then((cropData) =>
        // @ts-ignore
        setCropData(cropData)
      );
      formData.append("filtered", dataURItoBlob(canvas.toDataURL()));
    } catch (err) {
      console.error(err);
      console.log("No source Image!");
    }
  };

  const uploadImage = async () => {
    try {
      formData.append("description", description);
      formData.append("hashtags", hashtags);
      await pb.collection("posts").create(formData);
      await pb.collection("logs").create({
        user: pb.authStore.model.id,
        action: "create",
        collection: "posts",
      });
      // @ts-ignore
      window.location = "/";
    } catch (err) {
      changeError(err);
    }
  };

  const descriptionChange = (e) => {
    changeDescription(e.target.value);
  };

  const hashtagsChange = (e) => {
    changeHashtags(e.target.value);
  };

  function dataURItoBlob(dataURI: string) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <div>
      <div style={{ width: "100%" }}>
        <input type="file" onChange={setNewImage} />
        <br />
        <button onClick={getCroppedImage}>Crop Image</button>

        <Cropper
          style={{ height: 400, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          // preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
      </div>
      <div>
        <button onClick={getFilteredImage}>Sepia!</button>
        <br />
        <img id="original-image" style={{ width: "512px" }} src={cropData} />
      </div>
      <div>
        <input placeholder="Description" onChange={descriptionChange} />
        <input placeholder="#hashtags" onChange={hashtagsChange} />

        <button onClick={uploadImage}>Upload Image</button>
      </div>
      <p>{error}</p>
    </div>
  );
};

export default App;
