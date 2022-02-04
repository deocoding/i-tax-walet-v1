import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Store } from "../../utils/Store";

function ObjekPajakDropzone(id) {
  const objekPajakId = id;
  const [images, setImages] = useState([]);
  const [img, setImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevState) => [...prevState, reader.result]);
        setImg((prevState) => [...prevState, file]);
      };
      reader.readAsDataURL(file);
    });
    console.log("acceptedFiles", acceptedFiles);
    console.log("rejectFiles", rejectFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    // console.log(images);
  }, [images]);

  const handleUploadImages = async () => {
    // const file = images;
    // const bodyFormData = new FormData();
    // bodyFormData.append("file", { file });
    // console.log(files);

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/objek-pajaks/pendataan/upload",
        { images, objekPajakId },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (data) {
        setPesan(true);
        setLoading(false);
        setTimeout(async () => {
          setPesan(false);
          setImages([]);
        }, 1500);
        console.log(data);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    // try {
    //   const { data } = await axios.post(
    //     "/api/objek-pajaks/pendataan/upload",
    //     { bodyFormData },
    //     {
    //       "Content-Type": "multipart/form-data",
    //       headers: { authorization: `Bearer ${userInfo.token}` },
    //     }
    //   );
    //   if (data) {
    //     console.log(data);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <>
      <div className="dropzone mt-5" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <h3>Drag Active</h3>
        ) : (
          <h3>Geser dan lepaskan gambar disini</h3>
        )}
      </div>
      {images.length > 0 && (
        <div className="card_list flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="image mx-1 mt-1">
              <img src={image} />
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <div className="flex items-center">
          <button
            className="btn btn_primary ltr:mr-2 rtl:ml-2 uppercase"
            onClick={handleUploadImages}
          >
            {loading ? (
              <span className="pl-3">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            ) : (
              <span>Simpan</span>
            )}
          </button>
          {pesan && (
            <span className="ml-2">
              <svg
                className="animate-bounce"
                fill="none"
                height="26"
                viewBox="0 0 26 26"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 14L11.1 16.6"
                  stroke="#4F4F4F"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <path
                  d="M18.2 10L11.6 16.6"
                  stroke="#4F4F4F"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <path
                  d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z"
                  stroke="#4F4F4F"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
              </svg>
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default ObjekPajakDropzone;
