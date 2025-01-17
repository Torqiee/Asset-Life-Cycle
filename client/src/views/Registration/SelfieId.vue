<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100" style="background-color: #ececec;">
    <div class="row border rounded-5 p-3 bg-white box-area justify-content-center">
      <div class="d-flex align-items-center pt-4 ps-4">
        <img src="../assets/camera.png" alt="Logo" style="width: 45px;" />
        <h2 class="fw-bolder fs-4 ps-4">Take a selfie with your ID Card</h2>
      </div>

      <div class="col-md-12 box">
        <div class="row justify-content-center">
          <div class="col-md-10 mb-4 text-center">
            <!-- Canvas Element -->
            <canvas
              ref="canvas"
              id="canvas"
              class="rounded-4"
              style="width: 100%; max-width: 100%; aspect-ratio: 16/9;"
            ></canvas>
          </div>
          <h2 class="fs-6 py-2 fw-medium text-center" style="color: #989898;">
            Make sure to re-check your data before continuing.
          </h2>
          <div class="col-md-6">
            <div class="mt-3 d-flex justify-content-between">
              <!-- Capture/Continue Button -->
              <button
                @click="captureOrContinue"
                id="captureOrContinue"
                :class="['btn btn-lg fs-5 text-white fw-semibold', captureMode ? 'w-100' : 'w-50']"
                style="background-color: #133E87;"
              >
                {{ captureMode ? "Capture" : "Continue" }}
              </button>

              <!-- Retake Button (Visible After Capture) -->
              <button
                v-if="!captureMode"
                @click="retake"
                id="retakeButton"
                class="btn btn-lg fs-5 text-white fw-semibold w-50 ms-2"
                style="background-color: #FF6B6B;"
              >
                Retake
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const canvas = ref(null);
    const ctx = ref(null);
    const videoStream = ref(null);
    const captureMode = ref(true); // Toggle between "Capture" and "Continue"
    const router = useRouter();

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream.value = stream;

        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        videoElement.play();

        videoElement.addEventListener("loadedmetadata", () => {
          canvas.value.width = videoElement.videoWidth;
          canvas.value.height = videoElement.videoHeight;
          ctx.value = canvas.value.getContext("2d");

          // Apply the mirroring effect to the video element
          videoElement.style.transform = "scaleX(-1)"; // Flip horizontally

          const drawFrame = () => {
            if (captureMode.value) {
              // Clear the canvas before drawing
              ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

              // Draw the mirrored video frame on the canvas
              ctx.value.drawImage(
                videoElement,
                0,
                0,
                canvas.value.width,
                canvas.value.height
              );

              requestAnimationFrame(drawFrame);
            }
          };

          drawFrame();
        });
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Unable to access the camera. Please ensure you have granted permissions.");
      }
    };

    const addWatermark = () => {
      const currentDate = new Date();
      const dateTime = currentDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      ctx.value.font = "20px Arial";
      ctx.value.fillStyle = "rgba(255, 255, 255, 0.8)"; // Semi-transparent white
      ctx.value.textAlign = "right";
      ctx.value.textBaseline = "bottom";

      // Add the watermark text at the bottom-right corner
      ctx.value.fillText(
        dateTime,
        canvas.value.width - 20, // 20px padding from the right edge
        canvas.value.height - 20 // 20px padding from the bottom edge
      );
    };

    const compressImage = (imageData) => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      const maxWidth = 800;
      const maxHeight = 800;

      const img = new Image();
      img.src = imageData;
      return new Promise((resolve) => {
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          tempCanvas.width = width;
          tempCanvas.height = height;

          tempCtx.drawImage(img, 0, 0, width, height);
          resolve(tempCanvas.toDataURL("image/jpeg", 0.8));
        };
      });
    };

    const captureOrContinue = async () => {
      if (captureMode.value) {
        // Flip the canvas horizontally
        ctx.value.save();
        ctx.value.scale(-1, 1); // Flip horizontally
        ctx.value.translate(-canvas.value.width, 0); // Adjust position after flipping

        // Draw the current video frame on the canvas
        ctx.value.drawImage(
          canvas.value,
          0,
          0,
          canvas.value.width,
          canvas.value.height
        );

        ctx.value.restore(); // Restore the canvas state to prevent affecting future drawings

        // Add the watermark
        addWatermark();

        // Capture the image as base64
        const imageData = canvas.value.toDataURL("image/png");

        // Compress the captured image
        const compressedImage = await compressImage(imageData);

        // Save the compressed image
        const registrationData = JSON.parse(localStorage.getItem("registrationData")) || {};
        registrationData.selfieIdCardImage = compressedImage; // Save as "selfieIdCardImage"
        localStorage.setItem("registrationData", JSON.stringify(registrationData));
        console.log("Compressed image data saved:", registrationData);

        // Stop the video feed after capture
        videoStream.value.getTracks().forEach((track) => track.stop());

        captureMode.value = false; // Update button to "Continue"
      } else {
        // Navigate to the second page
        router.push("/IdCardPhoto");
      }
    };

    const retake = () => {
      captureMode.value = true;
      initializeCamera();
    };

    onMounted(() => {
      initializeCamera();
    });

    return {
      canvas,
      captureOrContinue,
      retake,
      captureMode,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

body {
  font-family: "Poppins", sans-serif;
  background: #ececec;
}

.box-area {
  width: 730px;
}

.box {
  padding: 60px 40px 60px 40px;
}

.rounded-4 {
  border-radius: 20px;
}

.rounded-5 {
  border-radius: 30px;
}

canvas {
  display: block;
  margin: 0 auto;
  border-radius: 20px;
  transform: scaleX(-1); /* Mirror the canvas horizontally (optional if video is mirrored) */
}


@media only screen and (max-width: 768px) {
  .box-area {
    margin: 0 10px;
  }
  .box {
    padding: 20px;
  }
}
</style>