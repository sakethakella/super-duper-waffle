import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const token=localStorage.getItem("token");
  const navigate = useNavigate();
  
  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");
    try {
        const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        setStatus("Upload successful!");
        setFile(null);
        setTimeout(() => navigate("/home"), 800);
      } 
      else {
        setStatus("Upload failed.");
        console.error("Upload failed:", await response.text());
      }
    } 
    catch (error) {
      setStatus("Upload failed.");
      console.error("Error during upload:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-md
          bg-black/70 backdrop-blur-xl
          border border-violet-500/20
          rounded-2xl shadow-2xl
          p-8
        "
      >
        {/* ================= Header ================= */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Upload <span className="text-pink-500">File</span>
        </h2>

        {/* ================= File Picker ================= */}
        <label
          className="
            flex flex-col items-center justify-center
            w-full h-40
            border-2 border-dashed border-violet-500/40
            rounded-xl
            cursor-pointer
            bg-white/5
            hover:bg-white/10
            transition
          "
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="text-center">
            <p className="text-gray-300 font-medium">
              {file ? file.name : "Click to select a file"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Any file type supported
            </p>
          </div>
        </label>

        {/* ================= Upload Button ================= */}
        <button
          onClick={handleUpload}
          className="
            mt-6 w-full py-3 rounded-lg font-semibold text-white
            bg-gradient-to-r from-pink-500 to-violet-600
            shadow-lg shadow-pink-500/30
            hover:shadow-violet-500/40
            hover:scale-[1.02]
            transition-all
          "
        >
          Start Upload
        </button>

        {/* ================= Status ================= */}
        {status && (
          <p
            className={`
              mt-4 text-center text-sm font-medium
              ${
                status.includes("successful")
                  ? "text-green-400"
                  : status.includes("Uploading")
                  ? "text-violet-400"
                  : "text-red-400"
              }
            `}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Upload;
