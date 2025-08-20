import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function PostEditor() {
  const [value, setValue] = useState("Write something...");
  const [published, setPublished] = useState("");

  // Simulate image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Simulate upload -> normally you'd send this file to backend/cloud
    const url = URL.createObjectURL(file);

    // Insert markdown image syntax into editor
    setValue((prev) => `${prev}\n\n![${file.name}](${url})`);
  };

  const handlePublish = () => {
    setPublished(value);
  };

  return (
    <div className="p-4" data-color-mode="light">
      <h2 className="text-xl font-bold mb-2">✍️ Create a Post</h2>

      {/* Markdown Editor */}
      <MDEditor value={value} onChange={setValue} />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-2"
      />

      {/* Publish Button */}
      <button
        onClick={handlePublish}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Publish 🚀
      </button>

      {/* Published Preview */}
      {published && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📢 Published Post:</h3>
          <MDEditor.Markdown source={published} style={{ whiteSpace: "pre-wrap" }} />
        </div>
      )}
    </div>
  );
}
