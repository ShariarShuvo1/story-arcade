import React, { useState } from "react";
import axios from "axios";

export default function Create() {
  const [prob, setProb] = useState("");

  const handleAdd = () => {
    axios
      .post("http://localhost:3500/addComplain", { prob: prob })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex">
      <input
        className="flex-grow p-3 border border-gray-600 bg-gray-700 text-white rounded-l-lg focus:outline-none"
        type="text"
        placeholder="Enter a Complaint"
        onChange={(e) => setProb(e.target.value)}
      />
      <button
        className="bg-red-500 text-white p-3 rounded-r-lg hover:bg-red-400"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}
