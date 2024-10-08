import { toast } from "react-toastify";
import { useContext, useRef, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { UserContext } from "../../AuthProvider/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const ImgFileUp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const formRef = useRef(null);
  const axiosPublic = useAxiosPublic();
  // upload file in server

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profile", selectedFile);

      try {
        // Send the image file to the backend (adjust the URL to your backend endpoint)
        const response = await axiosPublic.post("/profile-img", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data) {
          toast.success(response.data.message);
          // console.log('img',response.data)
          // const imgUrl = response.data.fileUrl;
          // localStorage.setItem('uploadedImage', imgUrl);
        }
      } catch (error) {
        toast.success(error?.response?.data.message);
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false); // Remove loading state
      }
    } else {
      console.log("No file selected");
    }
  };

  // it's for preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file in state
    }
  };

  return (
    <div className="bg-bg md:flex justify-center items-center">
      <div className="p-6 bg-bg rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 ">
          File Upload
        </h2>

        <form
          ref={formRef}
          action="/submit"
          id="uploadForm"
          className="relative border-2 border-dashed border-bg rounded-md px-6 py-8"
        >
          <input
            type="file"
            name="profile"
            className="hidden"
            id="fileInput"
            accept="image/*" // Ensures only image files can be selected
            onChange={handleFileChange} // Handles the file change event
          />

          <svg
            onClick={() => document.getElementById("fileInput").click()}
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 17l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag &amp; Drop your files here or{" "}
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              browse
            </label>{" "}
            to upload.
          </p>
        </form>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500 dark:focus:ring-opacity-50"
        >
          {loading ? <ImSpinner9 className="text-2xl" /> : "Upload Image"}
        </button>
      </div>

      {/* Image Preview */}
      <div>
        <div className="p-6 bg-bg rounded-md shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6 ">
            Image Preview
          </h2>
          <div className="relative border-2 border-dashed border-bg rounded-md p-6 flex justify-center ">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : user?.userPhoto
              }
              alt="Preview"
              className="h-48 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgFileUp;
