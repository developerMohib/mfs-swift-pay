const ImgFileUp = () => {
    const handleSubmit =(e)=>{
        e.preventDefault()
        const imgFile = e.target.files[0];
        console.log('paici', imgFile)
    }
  return (
    <div className="bg-bg md:flex justify-center items-center">
      <div className="p-6 bg-bg rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 ">
          File Upload
        </h2>
        <form id="uploadForm" onSubmit={handleSubmit} className="relative border-2 border-dashed border-bg rounded-md px-6 py-8">
          <input type="file" name="file" className="hidden" id="fileInput" />
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
        <button type="submit" onClick={() => document.getElementById('uploadForm').requestSubmit()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500 dark:focus:ring-opacity-50">
          Upload
        </button>
      </div>

      {/* img Preview */}
      <div>
        <div className="p-6 bg-bg rounded-md shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6 ">
            Image Preview
          </h2>
          <div className="relative border-2 border-dashed border-bg rounded-md p-6 flex justify-center ">
            <img src="https://i.ibb.co/W0nLxLb/836.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgFileUp;
