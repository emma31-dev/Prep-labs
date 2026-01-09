import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuizContent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [quizSettings, setQuizSettings] = useState({
    title: "",
    questionCount: 10,
    difficulty: "medium",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate quiz generation with progress
    const steps = [
      { progress: 20, delay: 500 },
      { progress: 40, delay: 800 },
      { progress: 60, delay: 600 },
      { progress: 80, delay: 700 },
      { progress: 100, delay: 500 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setGenerationProgress(step.progress);
    }

    // Navigate to quiz page with generated ID
    navigate(`/quiz/1`); // Using "1" for mock data
  };

  const getFileIcon = () => {
    if (!uploadedFile) return null;
    const ext = uploadedFile.name.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) {
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15h6M9 11h6" />
        </svg>
      );
    }
    if (["doc", "docx"].includes(ext || "")) {
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15h6M9 11h6" />
        </svg>
      );
    }
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-8 shadow-sm text-center" style={{ backgroundColor: "#ffffff" }}>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: "#faf5ff" }}
          >
            <svg
              className="animate-spin"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#581c87"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "#171717" }}>
            Generating Your Quiz
          </h2>
          <p className="mb-6" style={{ color: "#737373" }}>
            Our AI is analyzing your document and creating questions...
          </p>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full mb-4" style={{ backgroundColor: "#e5e5e5" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ backgroundColor: "#581c87", width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm" style={{ color: "#737373" }}>
            {generationProgress}% complete
          </p>

          {/* Progress Steps */}
          <div className="mt-8 space-y-3 text-left">
            {[
              { label: "Extracting text from document", threshold: 20 },
              { label: "Analyzing content structure", threshold: 40 },
              { label: "Identifying key concepts", threshold: 60 },
              { label: "Generating questions", threshold: 80 },
              { label: "Finalizing quiz", threshold: 100 },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: generationProgress >= step.threshold ? "#581c87" : "#e5e5e5",
                  }}
                >
                  {generationProgress >= step.threshold && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    color: generationProgress >= step.threshold ? "#171717" : "#737373",
                  }}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
          Create Quiz
        </h1>
        <p className="text-lg mt-2" style={{ color: "#737373" }}>
          Upload a document or snap a picture to generate AI-powered quizzes
        </p>
      </div>

      {/* Upload Method Selection */}
      {!uploadedFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Upload */}
          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="rounded-2xl p-8 border-2 border-dashed transition-all hover:border-purple-400 hover:bg-purple-50"
            style={{ borderColor: "#e5e5e5", backgroundColor: "#ffffff" }}
          >
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#faf5ff" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#171717" }}>
                Upload Document
              </h3>
              <p className="text-sm text-center" style={{ color: "#737373" }}>
                PDF, DOCX, or TXT files
              </p>
            </div>
          </button>

          {/* Camera Capture */}
          <button
            onClick={() => {
              cameraInputRef.current?.click();
            }}
            className="rounded-2xl p-8 border-2 border-dashed transition-all hover:border-orange-400 hover:bg-orange-50"
            style={{ borderColor: "#e5e5e5", backgroundColor: "#ffffff" }}
          >
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#fff7ed" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#171717" }}>
                Snap a Picture
              </h3>
              <p className="text-sm text-center" style={{ color: "#737373" }}>
                Take a photo of your notes or textbook
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Uploaded File Preview */}
      {uploadedFile && (
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#171717" }}>
              Uploaded File
            </h2>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#737373" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            className="flex items-center gap-4 p-4 rounded-xl border"
            style={{ borderColor: "#e5e5e5" }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              getFileIcon()
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: "#171717" }}>
                {uploadedFile.name}
              </p>
              <p className="text-sm" style={{ color: "#737373" }}>
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
            >
              Ready
            </div>
          </div>
        </div>
      )}

      {/* Quiz Settings */}
      {uploadedFile && (
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#171717" }}>
            Quiz Settings
          </h2>

          <div className="space-y-6">
            {/* Quiz Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#171717" }}>
                Quiz Title (Optional)
              </label>
              <input
                type="text"
                value={quizSettings.title}
                onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                placeholder="Auto-generated from document..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{ borderColor: "#e5e5e5" }}
              />
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#171717" }}>
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuizSettings({ ...quizSettings, questionCount: num })}
                    className="px-4 py-2 rounded-lg border transition-colors"
                    style={{
                      borderColor: quizSettings.questionCount === num ? "#581c87" : "#e5e5e5",
                      backgroundColor: quizSettings.questionCount === num ? "#faf5ff" : "transparent",
                      color: quizSettings.questionCount === num ? "#581c87" : "#737373",
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#171717" }}>
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {[
                  { value: "easy", label: "Easy", color: "#16a34a" },
                  { value: "medium", label: "Medium", color: "#ea580c" },
                  { value: "hard", label: "Hard", color: "#dc2626" },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setQuizSettings({ ...quizSettings, difficulty: level.value })}
                    className="px-4 py-2 rounded-lg border transition-colors"
                    style={{
                      borderColor: quizSettings.difficulty === level.value ? level.color : "#e5e5e5",
                      backgroundColor:
                        quizSettings.difficulty === level.value ? `${level.color}15` : "transparent",
                      color: quizSettings.difficulty === level.value ? level.color : "#737373",
                    }}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuiz}
              className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: "#581c87" }}
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone (when no file) */}
      {!uploadedFile && (
        <div
          className="rounded-2xl p-8 border-2 border-dashed text-center"
          style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p style={{ color: "#737373" }}>Or drag and drop your file here</p>
        </div>
      )}
    </div>
  );
};

export default CreateQuizContent;
