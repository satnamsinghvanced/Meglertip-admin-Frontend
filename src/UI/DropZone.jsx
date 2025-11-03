import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiLoader4Fill } from "react-icons/ri";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";
import Button from "./Button";

const DropZone = ({
  onUpload,
  heading,
  subheading,
  className,
  is_loading,
  clear,
  accept,
  hideUpload = false,
  multiple = true,
  id = "AtUploadLogo",
}) => {
  const [uploadFileType, setUploadFileType] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadAllFile, setUploadAllFile] = useState(null);
  const [uploadFileData, setUploadFileData] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const clearHandler = () => {
    setUploaded(false);
    setUploadFile(null);
    setUploadFileData(null);
    onUpload(null);
  };

  const fileChangeHandler = (event) => {
    let file = event.target.files[0];

    if (file) {
      let fileType = file.type.split("/")[0];
      setUploadFileType(fileType);

      const reader = new FileReader();
      reader.onload = function (e) {
        setUploadFile(file);
        setUploadAllFile(event.target.files);
        setUploadFileData(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      clearHandler();
    }
  };

  const uploadHandler = async (event) => {
    setUploading(true);
    if (uploadAllFile) {
      const filesArray = Array.from(uploadAllFile);

      const maxFileSize = 100 * 1024 * 1024;
      let totalSize = 0;

      for (let i = 0; i < filesArray.length; i++) {
        totalSize = totalSize + filesArray[i].size;

        if (filesArray[i].type === "") {
          toast.error("Files not supported");
          setUploading(false);
          return;
        }

        let fileType = filesArray[i].type.split("/")[0];

        if (accept && accept.length > 0 && !accept.includes(fileType)) {
          toast.warn("Selected file type is not supported.");
          setUploading(false);
          return;
        }

        if (maxFileSize < filesArray[i].size) {
          toast.warn("One file size must be lower than 100 mb");
          setUploading(false);
          return;
        }
      }

      const formData = new FormData();

      filesArray.forEach((file) => {
        formData.append("avatar", file);
      });

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/image/upload-profile`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        onUpload(data?.fileUrl);
        console.log(data?.fileUrl, "adjfaslkfsjdklf")
        // toast.success(data?.message);
      } catch (error) {
        toast.error(error);
      }
    }

    setUploaded(true);
    setUploading(false);
    if (clear) {
      clearHandler();
    }
  };

  return (
    <>
      <div
        className={`py-5 px-3 w-full mx-auto h-full rounded-nd flex items-center justify-center flex-col ${
          className?.includes("jobDropZone") ? "border" : ""
        }`}
      >
        {(is_loading || uploading) && (
          <div className="h-[200px] flex items-center justify-start">
            <RiLoader4Fill
              fontSize={60}
              className="animate-spin text-darkBlue dark:text-white"
            />
          </div>
        )}

        {!uploadFile && (
          <>
            <h4
              className={`${
                className?.includes("jobDropZone") ? "h5" : ""
              } font-bold mb-3 text-center`}
            >
              {heading}
            </h4>
            <span className="block text-center text-sm dark:text-white font-normal">
              {subheading}
            </span>
          </>
        )}

        {!uploadFile && !hideUpload && (
          <div className="mt-6">
            <div className="AtThemeUploadFile">
              <input
                type="file"
                name="uploadFile"
                accept={accept}
                id={id}
                onChange={fileChangeHandler}
                multiple={multiple}
                className="hidden"
              />
              <label
                htmlFor={id}
                className="btn btn-primary font-bold text-sm flex items-center justify-center gap-2"
              >
                <LuUpload fontSize={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Upload File</span>
              </label>
            </div>
          </div>
        )}
        {uploadFile && !uploading && uploadFileType === "image" && (
          <figure className="flex items-center justify-center max-w-xs overflow-hidden mt-2 relative border border-gray-200 rounded-lg">
            <img
              src={uploadFileData}
              width={150}
              height={170}
              className="w-full h-full"
              alt="Upload icon"
            />
            {!uploading && (
              <button
                type="button"
                onClick={clearHandler}
                className="absolute top-2 right-2 w-[30px] h-[30px] rounded-8 flex items-center justify-center bg-danger-200 z-20"
              >
                <FaRegTrashCan color="white" fontSize={16} />
              </button>
            )}
          </figure>
        )}
        {uploadFile && !uploading && uploadFileType !== "image" && (
          <>
            <LuUpload fontSize={150} />
            <p className="text-sm text-justify">{uploadFile?.name}</p>
          </>
        )}

        {uploadFile && !uploading && (
          <div className="mt-4">
            {!uploaded && (
              <Button
                value="Upload"
                onClick={uploadHandler}
                className="!px-8"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DropZone;
