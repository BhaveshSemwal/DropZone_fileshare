import React, { useEffect, useRef, useState } from "react";
import { UploadFile } from "./service/api";

function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const uploadRef = useRef();

  const handleUpload = () => {
    uploadRef.current.click();
  };

  const handleCopy = () => {
    if (res) {
      navigator.clipboard.writeText(res);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    if (res) {
      window.open(res, "_blank");
    }
  };

  useEffect(() => {
    const apiCall = async () => {
      setLoading(true);
      const fileData = new FormData();
      fileData.append("name", file.name);
      fileData.append("file", file);

      try {
        const response = await UploadFile(fileData);
        console.log("Upload response:", response);

        if (response?.path) {
          setRes(response.path);
        } else if (response?.url) {
          setRes(response.url);
        } else if (response?.data?.path) {
          setRes(response.data.path);
        } else {
          setRes(null);
          console.error("Upload succeeded but no URL found in response.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (file) apiCall();
  }, [file]);

  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-tr from-indigo-100 via-white to-indigo-200">
      {/* Animated background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Header */}
      <nav className="bg-white shadow-md p-4 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">DropZone</h1>
          <span className="text-lg font-medium text-indigo-600 italic animate-pulse">
            Secure. Simple. Share.
          </span>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-grow flex justify-center items-center px-4 py-10 relative z-10">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-slate-200 backdrop-blur-md bg-opacity-90">
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-6">
            📁 File Sharing Portal
          </h1>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleUpload}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>

            <input
              type="file"
              ref={uploadRef}
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <div className="w-full mt-4 flex flex-col items-center gap-3 text-sm text-slate-700 font-medium">
                ✅ Selected:{" "}
                <span className="text-indigo-700">{file.name}</span>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded shadow-md border"
                  />
                )}
                {file.type === "application/pdf" && (
                  <iframe
                    src={URL.createObjectURL(file)}
                    title="PDF Preview"
                    className="w-full h-48 rounded-md border shadow"
                  ></iframe>
                )}
              </div>
            )}

            {res && (
              <div className="mt-4 w-full bg-slate-50 p-3 rounded-md border border-slate-200">
                <p className="text-green-600 font-semibold text-center">
                  🔗 File Uploaded Successfully!
                </p>

                <div className="flex flex-col items-center mt-2 space-y-2">
                  <a
                    href={res}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline text-sm text-center hover:text-indigo-800 transition break-all"
                  >
                    {res}
                  </a>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCopy}
                      className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md transition"
                    >
                      {copied ? "✔ Copied" : "Copy Link"}
                    </button>

                    <button
                      onClick={handleOpen}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-8 relative z-10">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center text-sm text-slate-500">
          <p>© {year} DropZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
