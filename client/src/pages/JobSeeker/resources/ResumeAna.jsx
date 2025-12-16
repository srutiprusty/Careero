import React, { useState } from "react";
import axios from "axios";
import Footer from "@/components/Footer/Footer";
import JobHeader from "@/components/JobHeader/JobHeader";
import { RESUME_API_END_POINT } from "@/utils/constant";

const ResumeAna = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(RESUME_API_END_POINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <JobHeader />
      <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Resume <span className="text-purple-600">ATS Analyzer</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Upload your resume and get an ATS-based evaluation
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white
              hover:file:bg-purple-700"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60
              transition rounded-lg py-2 font-semibold text-white"
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Result Section */}
          {result && (
            <div className="space-y-6">
              {/* ATS Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <p className="text-gray-500">ATS Score</p>
                <p className="text-5xl font-bold text-purple-600 mt-2">
                  {result.atsScore}
                </p>
              </div>

              <ResultCard
                title="Strengths"
                items={result.strengths}
                color="green"
              />
              <ResultCard
                title="Weaknesses"
                items={result.weaknesses}
                color="red"
              />
              <ResultCard
                title="Recommended Improvements"
                items={result.improvements}
                color="yellow"
              />

              {/* Missing Keywords */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-purple-600">
                  Missing Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-800"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

/* Reusable Result Card */
const ResultCard = ({ title, items, color }) => {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className={`text-xl font-semibold mb-4 ${colorMap[color]}`}>
        {title}
      </h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeAna;
