"use client";
import { useState } from "react";
import axios from "axios";

export default function SentimentPage() {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  try {
  const res = await axios.post(
    "http://127.0.0.1:5000/predict",
    { text: sentence },
    { headers: { "Content-Type": "application/json" } }
);    setResult(res.data.result || res.data.error);
  } catch (err: any) {
    console.error("Error:", err);
    setResult(err.response?.data?.error || "Error contacting API");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-4xl max-w p-8">
        <h2 className="text-center text-xl font-light text-gray-800 mb-6">
          Sentiment Analysis
        </h2>

          
          <form onSubmit={handleSubmit} className="flex-1 space-x-2">
            <label className="block text-md font-medium text-gray-600 mb-2.5">
              Enter a Sentence in Roman Urdu:
            </label>
          <div >
            
            <input 
              type="text"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="flex-1 w-2xl border rounded-xl px-5 py-2  "
            />
            <button
            type="submit"
            className="ml-2 w-15 bg-green-500 hover:bg-green-700 text-white py-2 rounded-xl shadow-md transition duration-100">
            Go!
            </button>
          </div>
          </form>
          
            {result && (
          <p className="mt-4 text-center text-lg font-medium text-gray-700">
            Result:{" "}
            <span
              className={result.toLowerCase().startsWith("pos") ? "text-green-600" : "text-red-600"}
            >
              {result}
            </span>
          </p>
        )}

      </div>
    </div>
  );
}

