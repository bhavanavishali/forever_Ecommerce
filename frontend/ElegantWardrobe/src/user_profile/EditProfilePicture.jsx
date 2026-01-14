import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import api from "@/api"; // Ensure your API endpoint handles image uploads
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { assets } from "@/assets/assets";

const EditProfilePicture = () => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const user = location.state?.user;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      setLoading(true);
      const res = await api.put("/update_profile_picture/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
       toast.success(res.data.message)
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile Picture</h3>
      <div className="flex flex-col items-center space-y-4">
        <img
          // src={preview?preview:user.profile_picture}
          src={preview?preview:assets.dummy_image}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="profilePicInput"
        />
        <label
          htmlFor="profilePicInput"
          className="cursor-pointer px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Choose Picture
        </label>
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className="flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePicture;
