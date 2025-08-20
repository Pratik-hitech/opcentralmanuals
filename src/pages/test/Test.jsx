import React, { useState, useRef, useEffect } from "react";

export default function MiniSystem() {
  const [pet, setPet] = useState({ name: "", age: "", breed: "" });
  const [waivers, setWaivers] = useState([]);
  const [signature, setSignature] = useState(null);
  const [published, setPublished] = useState(null);

  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // -------- Signature Pad ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setSignature(dataUrl);
  };

  // -------- Waiver Upload ----------
  const handleWaiverUpload = (e) => {
    const files = Array.from(e.target.files);
    setWaivers((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  // -------- Publish ----------
  const handlePublish = () => {
    setPublished({
      pet,
      waivers,
      signature,
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🐾 Client Intake Form</h2>
      <input
        placeholder="Pet Name"
        value={pet.name}
        onChange={(e) => setPet({ ...pet, name: e.target.value })}
      />
      <br />
      <input
        placeholder="Pet Age"
        value={pet.age}
        onChange={(e) => setPet({ ...pet, age: e.target.value })}
      />
      <br />
      <input
        placeholder="Pet Breed"
        value={pet.breed}
        onChange={(e) => setPet({ ...pet, breed: e.target.value })}
      />

      <h3 style={{ marginTop: "20px" }}>📄 Waivers</h3>
      <input type="file" multiple onChange={handleWaiverUpload} />

      <h3 style={{ marginTop: "20px" }}>✍️ Signature</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <br />
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature} style={{ marginLeft: "10px" }}>
        Save Signature
      </button>

      <h3 style={{ marginTop: "20px" }}>🚀 Publish</h3>
      <button onClick={handlePublish}>Publish</button>

      {published && (
        <div style={{ marginTop: "20px" }}>
          <h3>📢 Published Data</h3>
          <p><b>Pet Name:</b> {published.pet.name}</p>
          <p><b>Age:</b> {published.pet.age}</p>
          <p><b>Breed:</b> {published.pet.breed}</p>

          <p><b>Waivers:</b></p>
          <ul>
            {published.waivers.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>

          {published.signature && (
            <div>
              <p><b>Signature:</b></p>
              <img
                src={published.signature}
                alt="signature"
                style={{ border: "1px solid #ccc" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
