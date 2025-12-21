import { useState } from "react";
import { useEffect } from "react";


const Home = () => {
  const [files, setFiles] = useState([]);
  const token=localStorage.getItem("token");
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files",{method: "GET",credentials: "include"});
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        console.error("Failed to fetch files", err);
      } 
    };

    fetchFiles();
  }, []);
    async function openFile(fileName) {
    try {
      const response = await fetch(`/api/files/${fileName}`, {
        method: 'GET',
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const fileBlob = await response.blob();
      const fileUrl = URL.createObjectURL(fileBlob);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName; // ✅ this sets the correct filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Clean up the temporary URL
      URL.revokeObjectURL(fileUrl);

    } catch (error) {
      console.error("Failed to fetch the file:", error);
    }
  }

  const handleDownload = (fileName) => {
    openFile(fileName);
  };
  const handleDelete = async (fileName) => {
    try{
      const response = await fetch(`/api/files/delete/${fileName}`,{method: "GET",credentials: "include"});
      const output= await response.json();
      if(response.ok){
        window.location.reload();
        console.log("file deleted",output);
      }
      else{
        console.log("file not deleted",output);
      }
    }catch(err){
      console.error("Failed to delete file", err);
    }
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Your <span className="text-pink-500">Files</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {files.length} items stored
        </p>
      </div>

      {/* Files */}
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="
              bg-black/70 backdrop-blur-xl
              border border-violet-500/20
              rounded-2xl p-4
              shadow-lg
            "
          >
            {/* Top Row */}
            <div className="flex items-center gap-3">

              <div className="flex-1">
                <p className="text-white font-medium leading-tight">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">{file.size}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleDownload(file.name)}
                className="
                  flex-1 py-2 rounded-xl text-sm font-semibold
                  bg-gradient-to-r from-pink-500 to-violet-600
                  text-white
                  shadow-md shadow-pink-500/30
                  active:scale-95 transition
                "
              >
                ⬇ Download
              </button>

              <button
                onClick={() => handleDelete(file.name)}
                className="
                  px-4 py-2 rounded-xl text-sm font-semibold
                  bg-white/5 text-red-400
                  border border-red-500/20
                  hover:bg-red-500/10
                  active:scale-95 transition
                "
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {files.length === 0 && (
        <div className="mt-20 text-center text-gray-400">
          No files uploaded yet
        </div>
      )}
    </div>
  );
};

export default Home;
