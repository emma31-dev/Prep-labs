import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { authAtom } from "../../store/authAtoms";
import { getResources } from "../../services/resourceService";
import { generateQuiz } from "../../services/quizService";
import type { Resource } from "../../types/resource";
import type { QuizDifficulty } from "../../types/quiz";

interface QuizSettings {
  title: string;
  questionCount: number;
  difficulty: QuizDifficulty;
}

const CreateQuizContent = () => {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);

  // Resource selection state
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [resourceError, setResourceError] = useState<string | null>(null);

  // Quiz generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Quiz settings
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    title: "",
    questionCount: 10,
    difficulty: "medium",
  });

  // Fetch user's resources on mount
  useEffect(() => {
    const fetchResources = async () => {
      if (!auth.user?.id) {
        setIsLoadingResources(false);
        return;
      }

      try {
        setIsLoadingResources(true);
        setResourceError(null);
        const userResources = await getResources(auth.user.id, undefined, auth.accessToken || undefined);
        setResources(userResources);
      } catch (err) {
        setResourceError(err instanceof Error ? err.message : "Failed to load resources");
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, [auth.user?.id, auth.accessToken]);

  // Update quiz title when resource is selected
  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource);
    setQuizSettings((prev) => ({
      ...prev,
      title: `${resource.title} Quiz`,
    }));
    setGenerationError(null);
  };

  const handleDeselectResource = () => {
    setSelectedResource(null);
    setQuizSettings({
      title: "",
      questionCount: 10,
      difficulty: "medium",
    });
    setGenerationError(null);
  };

  const handleGenerateQuiz = async () => {
    if (!selectedResource) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationError(null);

    // Simulate progress steps while waiting for API
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 80) return prev;
        return prev + 10;
      });
    }, 1500);

    try {
      const quiz = await generateQuiz({
        resourceId: selectedResource.id,
        title: quizSettings.title || `${selectedResource.title} Quiz`,
        questionCount: quizSettings.questionCount,
        difficulty: quizSettings.difficulty,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Brief delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
      // Parse error message for user-friendly display
      const errorMsg = err instanceof Error ? err.message : "Failed to generate quiz";
      let friendlyError = errorMsg;
      
      if (errorMsg.includes("429") || errorMsg.includes("Too Many Requests") || errorMsg.includes("quota")) {
        friendlyError = "AI service quota exceeded. Please try again later or contact support.";
      } else if (errorMsg.includes("API key") || errorMsg.includes("expired") || errorMsg.includes("invalid")) {
        friendlyError = "AI service configuration error. Please contact support.";
      } else if (errorMsg.includes("timeout") || errorMsg.includes("Timeout")) {
        friendlyError = "Request timed out. Please try again with fewer questions.";
      } else if (errorMsg.includes("Failed to load") || errorMsg.includes("images")) {
        friendlyError = "Failed to process resource images. Please try a different resource.";
      }
      
      setGenerationError(friendlyError);
    }
  };

  // Loading state
  if (isLoadingResources) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <svg
              className="animate-spin w-10 h-10 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#581c87"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p style={{ color: "#737373" }}>Loading your resources...</p>
          </div>
        </div>
      </div>
    );
  }

  // Generation in progress
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
            Our AI is analyzing your resource and creating questions...
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
              { label: "Extracting content from images", threshold: 20 },
              { label: "Analyzing study material", threshold: 40 },
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

  // Empty state - no resources
  if (resources.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
            Create Quiz
          </h1>
          <p className="text-lg mt-2" style={{ color: "#737373" }}>
            Generate AI-powered quizzes from your study resources
          </p>
        </div>

        <div
          className="rounded-2xl p-12 mt-6 text-center"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: "#faf5ff" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#171717" }}>
            No Resources Yet
          </h2>
          <p className="mb-6" style={{ color: "#737373" }}>
            Upload some study materials first to generate quizzes from them.
          </p>
          <p className="text-sm" style={{ color: "#a3a3a3" }}>
            Click <span className="font-semibold" style={{ color: "#581c87" }}>Resources</span> in the sidebar to upload your study materials.
          </p>
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
          Select a resource to generate AI-powered quiz questions
        </p>
      </div>

      {/* Error display */}
      {(resourceError || generationError) && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ color: "#dc2626" }}>{resourceError || generationError}</span>
          {generationError && (
            <button
              onClick={handleGenerateQuiz}
              className="ml-auto px-4 py-1 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Selected resource preview */}
      {selectedResource ? (
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#171717" }}>
              Selected Resource
            </h2>
            <button
              onClick={handleDeselectResource}
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
            style={{ borderColor: "#581c87", backgroundColor: "#faf5ff" }}
          >
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#581c87" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: "#171717" }}>
                {selectedResource.title}
              </p>
              <p className="text-sm" style={{ color: "#737373" }}>
                {selectedResource.category} • {selectedResource.topic}
              </p>
              <p className="text-sm" style={{ color: "#737373" }}>
                {selectedResource.images.length} image{selectedResource.images.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
            >
              Selected
            </div>
          </div>
        </div>
      ) : (
        /* Resource selection grid */
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#171717" }}>
            Select a Resource
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => handleResourceSelect(resource)}
                className="p-4 rounded-xl border-2 text-left transition-all hover:border-purple-400 hover:bg-purple-50"
                style={{ borderColor: "#e5e5e5", backgroundColor: "#ffffff" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#faf5ff" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: "#171717" }}>
                      {resource.title}
                    </p>
                    <p className="text-sm capitalize" style={{ color: "#737373" }}>
                      {resource.category} • {resource.topic}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#a3a3a3" }}>
                      {resource.images.length} image{resource.images.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Settings - only show when resource is selected */}
      {selectedResource && (
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#171717" }}>
            Quiz Settings
          </h2>

          <div className="space-y-6">
            {/* Quiz Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#171717" }}>
                Quiz Title
              </label>
              <input
                type="text"
                value={quizSettings.title}
                onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                placeholder={`${selectedResource.title} Quiz`}
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
                  { value: "easy" as QuizDifficulty, label: "Easy", color: "#16a34a" },
                  { value: "medium" as QuizDifficulty, label: "Medium", color: "#ea580c" },
                  { value: "hard" as QuizDifficulty, label: "Hard", color: "#dc2626" },
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
              onClick={handleGenerateQuiz}
              className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: "#581c87" }}
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizContent;
