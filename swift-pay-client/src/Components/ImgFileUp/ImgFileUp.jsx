import { useContext, useState } from "react";
import { UserContext } from "../../AuthProvider/AuthProvider";

const ImgFileUp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useContext(UserContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      console.log("File ready for upload:", selectedFile);
      // Add file upload logic here, such as sending the file to a server
    } else {
      console.log("No file selected");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file in state
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="bg-bg md:flex justify-center items-center">
      <div className="p-6 bg-bg rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 ">
          File Upload
        </h2>

        <form
          id="uploadForm"
          onSubmit={handleSubmit}
          className="relative border-2 border-dashed border-bg rounded-md px-6 py-8"
        >
          <input
            type="file"
            className="hidden"
            id="fileInput"
            accept="image/*" // Ensures only image files can be selected
            onChange={handleFileChange} // Handles the file change event
          />

          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4"
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
          onClick={() => document.getElementById("fileInput").click()} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500 dark:focus:ring-opacity-50"
        >
          Upload
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
