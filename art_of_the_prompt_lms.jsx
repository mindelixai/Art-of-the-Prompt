import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, ListChecks, Sparkles, Youtube, ArrowRight, NotebookPen, MessageSquareText, CheckCircle, Award, Download, Lightbulb, BrainCircuit, Linkedin } from "lucide-react";

// Make sure to add this script tag in your public/index.html or equivalent for html2canvas to work in React if not using npm install
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>


// Defined colors and gradients globally for accessibility across all components
const colors = {
  navy: "#0E0E1A",
  blue: "#1d63ff", // Primary blue from your theme
  purple: "#7a3eff",
  orange: "#ff884d",
  white: "#ffffff",
  textSecondary: "rgba(245, 245, 245, 0.7)", // Adjusted for dark background text readability
  green: "#28a745", // Added a green color for completion
  textDark: "#13343B", // Dark text for the certificate body
  lightBackground: "#F5F7FA", // Light background for the main certificate area
  accentOrange: "#FF6B35", // A slightly different orange for accents, similar to image
  darkBlue: "#0B1D2A", // Dark blue from the image (not used in this version)
};

const gradientFlame = "linear-gradient(135deg, #1d63ff 0%, #7a3eff 50%, #ff884d 100%)";
const gradientBackground = "linear-gradient(135deg, #0e0e1a 0%, #1a1a2e 100%)";
const cardBackground = "rgba(255, 255, 255, 0.05)";
const cardBorder = "rgba(122, 62, 255, 0.2)";
const inputBackground = "rgba(255, 255, 255, 0.1)";
const inputBorder = "rgba(255, 255, 255, 0.2)";
const inputPlaceholder = "rgba(255, 255, 255, 0.5)";
const focusRingColor = "rgba(255, 136, 77, 0.2)"; // Adjusted for orange focus


// Reusable animated card component
const SectionCard = ({ title, icon, children }) => (
  <motion.div
    initial={{ y: 12, opacity: 0, scale: 0.98 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    whileHover={{ translateY: -3 }}
    className="rounded-lg p-6 border" // Increased padding and slightly adjusted border-radius
    style={{ backgroundColor: cardBackground, borderColor: cardBorder }}
  >
    <div className="flex items-center gap-3 mb-4"> {/* Increased gap and margin */}
      <div className="shrink-0 p-3 rounded-lg" style={{ background: gradientFlame }}> {/* Applied gradient */}
        {icon && React.cloneElement(icon, { className: "w-5 h-5 text-white" })} {/* Ensure icons are white and larger */}
      </div>
      <h3 className="text-xl font-semibold" style={{ color: colors.white }}>{title}</h3> {/* Adjusted font size and color */}
    </div>
    <div className="text-base" style={{ color: colors.white, opacity: 0.9 }}>{children}</div> {/* Adjusted font size and opacity */}
  </motion.div>
);

// Prompt chip (flat, tappable) component
const PromptChip = ({ text, onClick, icon: IconComponent }) => ( // Added icon prop
  <motion.button
    whileTap={{ scale: 0.98 }}
    whileHover={{ background: gradientFlame, color: colors.navy }} // Hover effect from style.css
    onClick={() => onClick(text)}
    className="w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all duration-200" // Adjusted padding and border-radius
    style={{ background: colors.blue, color: colors.white, fontWeight: 500 }} // Default style from .btn--primary
  >
    {IconComponent ? <IconComponent className="w-4 h-4 mt-0.5 shrink-0"/> : <Sparkles className="w-4 h-4 mt-0.5 shrink-0"/>}
    <span className="text-sm flex-grow">{text}</span>
  </motion.button>
);

// CertificateGenerator Component (Moved directly into this file to resolve import error)
const CertificateGenerator = ({ userName, courseTitle, completionDate }) => {
  const certificateRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to download the certificate as a PNG image
  const handleDownloadCertificate = async () => {
    // Check if html2canvas is available globally
    if (typeof window.html2canvas === 'undefined') {
      alert("html2canvas library is not loaded. Please ensure the CDN script is included in your HTML.");
      return;
    }

    if (!certificateRef.current) return;

    setIsDownloading(true);
    try {
      // Use html2canvas to capture the certificate content
      const canvas = await window.html2canvas(certificateRef.current, {
        scale: 2, // Increase scale for higher resolution
        useCORS: true, // Enable cross-origin for images if any
        backgroundColor: null, // Allow transparent background
      });

      // Create an image URL from the canvas
      const image = canvas.toDataURL('image/png', 1.0); // 1.0 for maximum quality

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = image;
      link.download = `Certificate_${userName.replace(/\s/g, '_')}_${courseTitle.replace(/\s/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error generating or downloading certificate:", error);
      alert("Failed to download certificate. Please try again."); // Using alert for simplicity, could use a custom modal
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        ref={certificateRef}
        className="w-full max-w-2xl bg-white p-8 md:p-12 shadow-2xl rounded-xl relative overflow-hidden"
        style={{
          border: `8px solid ${colors.blue}`,
          background: `linear-gradient(145deg, ${colors.white} 80%, ${colors.orange} 100%)`, // Subtle gradient
          minHeight: '400px', // Ensure enough height for content
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-20" style={{ background: colors.purple }}></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-20" style={{ background: colors.blue }}></div>

        <div className="text-center" style={{ color: colors.navy }}>
          <h2 className="text-4xl font-bold mb-4" style={{ background: gradientFlame, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Certificate of Completion
          </h2>
          <p className="text-lg mb-6 font-medium">This certifies that</p>
          <h1 className="text-5xl font-extrabold mb-8 capitalize" style={{ color: colors.orange }}>
            {userName || "[Your Name]"}
          </h1>
          <p className="text-lg mb-6 font-medium">has successfully completed the course</p>
          <p className="text-3xl font-bold mb-10" style={{ color: colors.blue }}>
            "{courseTitle || "[Course Title]"}"
          </p>
          <div className="flex justify-around items-center mt-10 text-sm md:text-base">
            <div className="text-center flex flex-col items-center">
              {/* Removed the Golden Seal SVG, keeping only Mindelix AI text */}
              <div className="pt-2" style={{ color: colors.navy, fontWeight: 'bold' }}>
                Mindelix AI
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold" style={{ color: colors.navy }}>Date: {completionDate}</p>
              <div className="border-t-2 border-gray-400 pt-2" style={{ color: colors.navy }}>
                Completion Date
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ boxShadow: `0 10px 25px rgba(29, 99, 255, 0.3)`, translateY: -2 }}
        onClick={handleDownloadCertificate}
        className="mt-6 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
        style={{ background: gradientFlame, color: colors.navy, fontWeight: 600 }}
        disabled={isDownloading || !userName || !courseTitle}
      >
        <Download className="w-5 h-5"/>
        {isDownloading ? "Downloading..." : "Download Certificate"}
      </motion.button>
    </div>
  );
};


// Main Application Component
export default function ArtOfThePromptLMS() {
  const [lessons] = useState([
    { id: "vTW2cmN1kkk", title: "The Most Expensive Skill in 2025" },
    { id: "HRFLHl58g5M", title: "Why Prompt Engineering Matters ?" },
    { id: "1IAHBK3nuKs", title: "The Fundamentals of Good Prompting: Core Principles, Common Mistakes, and How to Avoid Them" },
    { id: "aASZkLfGk5Q", title: "Most Effective Prompt Engineering Techniques 2025" },
    { id: "6kW0VbJe6ic", title: "Prompt Engineering That Works Real Use Cases Across Business, Content & More" },
  ]);
  const [activeId, setActiveId] = useState(lessons[0].id);
  const activeLesson = useMemo(() => lessons.find(l => l.id === activeId), [lessons, activeId]);

  const [userName, setUserName] = useState(''); // New state for user's name
  const [userNotes, setUserNotes] = useState("");
  const [aiResponse, setAiResponse] = useState("Tip: Ask the AI to extract key patterns from this lesson and create a mini quiz.");
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [completedLessons, setCompletedLessons] = useState(new Set()); // New state for completed lessons
  const [showCertificate, setShowCertificate] = useState(false); // State to control certificate display

  // Define social media links
  const linkedinPageUrl = "https://www.linkedin.com/company/mindelixai"; // Placeholder LinkedIn URL
  const youtubeChannelUrl = "https://www.youtube.com/@MindelixAI";

  // Load completed lessons from localStorage on component mount
  useEffect(() => {
    try {
      const storedCompleted = localStorage.getItem('completedLessons');
      if (storedCompleted) {
        setCompletedLessons(new Set(JSON.parse(storedCompleted)));
      }
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  // Save completed lessons and user name to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('completedLessons', JSON.stringify(Array.from(completedLessons)));
    }
    catch (error) {
      console.error("Failed to save completed lessons to localStorage:", error);
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('userName', userName);
    }
    catch (error) {
      console.error("Failed to save user name to localStorage:", error);
    }
  }, [userName]);


  /**
   * Function to call the Gemini API.
   * Includes exponential backoff for retries.
   * @param {string} promptText - The text prompt to send to the AI.
   * @returns {Promise<string>} - The AI's response text.
   */
  const callGeminiApi = async (promptText) => {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: promptText }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide the API key here at runtime

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    while (retries < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 429 && retries < maxRetries - 1) { // Too Many Requests
            const delay = baseDelay * Math.pow(2, retries) + Math.random() * 1000; // Add jitter
            await new Promise(res => setTimeout(res, delay));
            retries++;
            continue; // Retry the request
          }
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          return result.candidates[0].content.parts[0].text;
        } else {
          return "No clear response from AI.";
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (retries < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, retries) + Math.random() * 1000;
          await new Promise(res => setTimeout(res, delay));
          retries++;
        } else {
          throw error; // Re-throw if max retries reached
        }
      }
    }
    return "Failed to get a response after multiple retries.";
  };

  /**
   * Handles sending a prompt to the AI Assistant.
   * @param {string} promptTemplate - The template for the prompt.
   * @param {boolean} includeNotes - Whether to include user's notes in the prompt.
   */
  const handleSendPrompt = async (promptTemplate, includeNotes = false) => {
    setIsLoading(true);
    setAiResponse("Thinking..."); // Show loading state to user
    try {
      let finalPrompt = promptTemplate;
      if (includeNotes && userNotes.trim() !== "") {
        finalPrompt = `${promptTemplate}\n\nHere are my notes:\n${userNotes}`;
      } else if (includeNotes && userNotes.trim() === "") {
        setAiResponse("Please write some notes first before asking the AI to process them!");
        setIsLoading(false);
        return;
      }

      const response = await callGeminiApi(finalPrompt);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Oops! Something went wrong. Please try again later.");
      console.error("Error processing prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Marks the currently active lesson as complete.
   */
  const handleMarkComplete = () => {
    if (activeLesson) {
      setCompletedLessons(prev => new Set(prev).add(activeLesson.id));
      setShowCertificate(true); // Show certificate generator after marking complete
    }
  };

  const getCompletionDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  // Effect to clear AI response when active lesson changes, unless it's a "thinking..." state
  useEffect(() => {
    if (!isLoading) {
      setAiResponse("Tip: Ask the AI to extract key patterns from this lesson and create a mini quiz.");
    }
    setShowCertificate(false); // Hide certificate when lesson changes
  }, [activeLesson, isLoading]);

  return (
    <div className="min-h-screen relative overflow-hidden font-['Inter']" style={{ background: gradientBackground, color: colors.white }}>
      {/* Animated flat blobs background (2D) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20"
        style={{ background: `radial-gradient(closest-side, ${colors.orange}, transparent)` }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: `radial-gradient(closest-side, ${colors.purple}, transparent)` }}
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between rounded-b-xl"
             style={{ backgroundColor: `${colors.navy}CC`, borderBottom: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -8, scale: 0.9, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }}>
              <div className="p-2 rounded-xl" style={{ background: gradientFlame }}>
                <Sparkles className="w-5 h-5 text-white"/>
              </div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.white }}>Art of the Prompt</h1>
              <p className="text-xs" style={{ color: colors.orange }}>Microlearning with an AI study buddy</p>
            </div>
          </div>
          {/* LinkedIn Page link in header */}
          <a
            href={linkedinPageUrl}
            target="_blank" rel="noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
            style={{ background: inputBackground, border: `1px solid ${inputBorder}`, color: colors.white }}
          >
            <Linkedin className="w-4 h-4"/> LinkedIn Page
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Introduction Section */}
        <SectionCard title="Welcome to The Art of the Prompt: Advanced Prompt Engineering Course" icon={<Award />}>
          <p className="mb-4">
            This course is designed to help you master one of the most valuable skills of 2025 — **Prompt Engineering**.
            It’s structured into key modules, each focusing on a specific aspect of crafting powerful AI prompts:
            from understanding core principles to applying advanced techniques in real-world scenarios.
          </p>
          <h4 className="text-lg font-semibold mb-2" style={{ color: colors.orange }}>How to Navigate the Course:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Start with the first module and progress at your own pace.</li>
            <li>Each module includes practical examples, exercises, and insights you can immediately apply.</li>
            <li>Complete a module to unlock your **Certificate of Completion** — a credential to showcase your expertise.</li>
            <li>Once you finish all modules, you’ll earn a **Final Course Certificate** recognizing your mastery of advanced prompt engineering.</li>
          </ul>
          <p>
            Dive in, explore, and let’s turn you into a prompt engineering expert.
          </p>
        </SectionCard>

        {/* Main grid for lessons, player, and AI assistant */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lessons Aside */}
          <aside className="lg:col-span-3 space-y-4">
            <SectionCard title="Lessons" icon={<ListChecks />}>
              {/* User Name Input */}
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-medium mb-2" style={{ color: colors.white }}>
                  Your Name for Certificates:
                </label>
                <input
                  id="userName"
                  type="text"
                  className="w-full rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-offset-2"
                  placeholder="Enter your full name"
                  style={{
                    backgroundColor: inputBackground,
                    color: colors.white,
                    border: `1px solid ${inputBorder}`,
                    '--tw-ring-color': colors.orange,
                    '--tw-ring-offset-color': cardBackground,
                  }}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <ul className="space-y-2">
                {lessons.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ x: -6, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ translateX: 4 }}
                      onClick={() => setActiveId(l.id)}
                      className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200"
                      style={{
                        background: activeId === l.id ? gradientFlame : inputBackground,
                        color: activeId === l.id ? colors.navy : colors.white,
                        fontWeight: activeId === l.id ? 600 : 500, // Make active lesson bolder
                        border: activeId === l.id ? 'none' : `1px solid ${inputBorder}`,
                      }}
                    >
                      <span className="text-base font-medium flex items-center gap-2">
                        {l.title}
                        {completedLessons.has(l.id) && (
                          <CheckCircle className="w-4 h-4 text-green-400" /> // Green tick for completion
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-80"/>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </SectionCard>
          </aside>

          {/* Player and Notes Section */}
          <section className="lg:col-span-6 space-y-4">
            <SectionCard title={activeLesson?.title || "Select a lesson"} icon={<Play />}>
              {activeLesson ? (
                <motion.div
                  key={activeLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-xl overflow-hidden shadow-lg"
                  style={{ border: `2px solid ${colors.blue}` }}
                >
                  <div className="aspect-video w-full bg-black/70">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${activeLesson.id}?rel=0`}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              ) : (
                <p>Select a lesson to start.</p>
              )}
              {activeLesson && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ boxShadow: `0 10px 25px rgba(29, 99, 255, 0.3)`, translateY: -2 }}
                  onClick={handleMarkComplete}
                  className="w-full mt-4 px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: completedLessons.has(activeLesson.id) ? colors.green : gradientFlame, // Change color if completed
                    color: colors.navy,
                    fontWeight: 600,
                    opacity: completedLessons.has(activeLesson.id) ? 0.7 : 1, // Slightly less opaque if completed
                  }}
                  disabled={completedLessons.has(activeLesson.id) || !userName.trim()} // Disable if already complete or no name
                >
                  {completedLessons.has(activeLesson.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4"/> Lesson Complete!
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4"/> Mark as Complete
                    </>
                  )}
                </motion.button>
              )}

              {/* Certificate Display Section */}
              {activeLesson && completedLessons.has(activeLesson.id) && showCertificate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-4 rounded-lg"
                  style={{backgroundColor: cardBackground, border: `1px solid ${cardBorder}`}}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: colors.white}}>
                    <Award className="w-5 h-5 text-orange"/> Your Certificate!
                  </h3>
                  <CertificateGenerator
                    userName={userName}
                    courseTitle={activeLesson.title}
                    completionDate={getCompletionDate()}
                  />
                </motion.div>
              )}
            </SectionCard>

            {/* Notes (flat) */}
            <SectionCard title="Notes" icon={<NotebookPen />}>
              <textarea
                className="w-full min-h-[160px] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-offset-2"
                placeholder="Write your takeaways, timestamps, and examples here..."
                style={{
                  backgroundColor: inputBackground,
                  color: colors.white,
                  border: `1px solid ${inputBorder}`,
                  '--tw-ring-color': colors.orange, // Tailwind focus ring color
                  '--tw-ring-offset-color': cardBackground, // Tailwind focus ring offset color
                  // The '::placeholder' pseudo-element cannot be directly styled in inline style objects in React.
                  // For demonstration, leaving it as a comment here.
                  // '::placeholder': { color: inputPlaceholder }
                }}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
              />
            </SectionCard>
          </section>

          {/* AI Assistant Aside */}
          <aside className="lg:col-span-3 space-y-4">
            <SectionCard title="AI Assistant (Gemini)" icon={<Sparkles />}>
              <div className="grid grid-cols-1 gap-3 mb-4"> {/* Increased gap and margin */}
                <PromptChip text="Explain system vs user prompts with simple examples." onClick={(text) => handleSendPrompt(text)}/>
                <PromptChip text="Turn my notes into bullet points and action items." onClick={(text) => handleSendPrompt(text, true)}/>
                <PromptChip text="Suggest 3 practice prompts for few-shot email rewriting." onClick={(text) => handleSendPrompt(text)}/>
                <PromptChip text="Summarize the current video's topic in 3 key points." onClick={(text) => handleSendPrompt(`${text} based on the video titled \"${activeLesson?.title}\".`)}/>
                <PromptChip text="Create a mini quiz (3 questions) based on my notes." onClick={(text) => handleSendPrompt(text, true)}/>
                {/* New Gemini API features */}
                <PromptChip text="✨ Explain a complex concept from my notes." onClick={(text) => handleSendPrompt(`Explain the following concept from my notes in simple terms:\n\n${userNotes}`, true)} icon={Lightbulb}/>
                <PromptChip text="✨ Generate a practice prompt based on this lesson." onClick={(text) => handleSendPrompt(`Generate a practice prompt for a large language model based on the lesson titled \"${activeLesson?.title}\". Focus on a key concept from the lesson.`, false)} icon={BrainCircuit}/>
              </div>

              {/* AI Response Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg p-4 text-sm min-h-[120px] flex items-center justify-center relative" // Adjusted padding, font size, min-height
                style={{ backgroundColor: inputBackground, color: colors.white, border: `1px solid ${inputBorder}` }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.orange }}></div>
                    <span className="text-sm" style={{ color: colors.white }}>Thinking...</span>
                  </div>
                ) : (
                  <p className="opacity-80 whitespace-pre-wrap">{aiResponse}</p>
                )}
              </motion.div>

              {/* Custom Prompt Input */}
              <div className="mt-5"> {/* Increased margin-top */}
                <label htmlFor="custom-prompt" className="block text-base font-medium mb-2" style={{ color: colors.white }}>
                  Or ask your own question:
                </label>
                <textarea
                  id="custom-prompt"
                  className="w-full min-h-[100px] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-offset-2" // Adjusted padding, min-height, border-radius
                  placeholder="E.g., What are the key takeaways from this lesson?"
                  style={{
                    backgroundColor: inputBackground,
                    color: colors.white,
                    border: `1px solid ${inputBorder}`,
                    '--tw-ring-color': colors.orange,
                    '--tw-ring-offset-color': cardBackground,
                    // The '::placeholder' pseudo-element cannot be directly styled in inline style objects in React.
                    // For demonstration, leaving it as a comment here.
                    // '::placeholder': { color: inputPlaceholder }
                  }}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ boxShadow: `0 10px 25px rgba(29, 99, 255, 0.3)`, translateY: -2 }} // Hover effect from style.css
                  onClick={() => handleSendPrompt(customPrompt, true)}
                  className="w-full mt-3 px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200" // Adjusted padding, border-radius
                  style={{ background: gradientFlame, color: colors.navy, fontWeight: 600 }} // Primary button style
                  disabled={isLoading || customPrompt.trim() === ""}
                >
                  <MessageSquareText className="w-4 h-4"/>
                  {isLoading ? "Sending..." : "Ask Gemini"}
                </motion.button>
              </div>
            </SectionCard>
          </aside>
        </div>
      </main>

      <footer className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>
        © Art of the Prompt — Mindelixai 2025
        <div className="flex justify-center gap-4 mt-4">
          <a href={linkedinPageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1" style={{ color: colors.white }}>
            <Linkedin className="w-4 h-4"/> LinkedIn
          </a>
          <a href={youtubeChannelUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1" style={{ color: colors.white }}>
            <Youtube className="w-4 h-4"/> YouTube
          </a>
        </div>
      </footer>
    </div>
  );
}
