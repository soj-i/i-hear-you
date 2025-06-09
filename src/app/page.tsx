"use client";

import React, { useState } from "react";

interface Paragraph {
  text: string;
  response?: string;
  isLoading?: boolean;
}

interface ParagraphPayloads {
  paragraphs: Paragraph[];
  currentParagraph: number;
}

export default function Home() {
  const [paragraphPayloads, setParagraphPayloads] = useState<ParagraphPayloads>({
    paragraphs: [],
    currentParagraph: 0,
  });
  const [handleText, setHandleText] = useState("");
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null); // Track the selected paragraph

  const empathyHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    if (newText.endsWith("\n\n")) {
      setParagraphPayloads((prev) => {
        const updatedParagraphs = [
          ...prev.paragraphs,
          { text: handleText.trim(), isLoading: false },
        ];
        console.log("Updated Paragraphs Array:", updatedParagraphs);
        return {
          paragraphs: updatedParagraphs,
          currentParagraph: prev.currentParagraph + 1,
        };
      });

      setHandleText("");
    } else {
      setHandleText(newText);
    }
  };

  const handleGenerateResponse = async (index: number) => {
    // Set the loading state for the paragraph
    setParagraphPayloads((prev) => {
      const updatedParagraphs = [...prev.paragraphs];
      updatedParagraphs[index].isLoading = true;
      return { ...prev, paragraphs: updatedParagraphs };
    });

    try {
      // Prepare context by combining all previous paragraphs
      const context = paragraphPayloads.paragraphs
        .slice(0, index)
        .map((p) => p.text)
        .join("\n\n");

      // Make a POST request to the backend API
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: paragraphPayloads.paragraphs[index].text,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();

      // Update the paragraph with the generated response
      setParagraphPayloads((prev) => {
        const updatedParagraphs = [...prev.paragraphs];
        updatedParagraphs[index].response = data.response;
        updatedParagraphs[index].isLoading = false;
        return { ...prev, paragraphs: updatedParagraphs };
      });
    } catch (error) {
      console.error("Error generating response:", error);

      // Reset the loading state in case of an error
      setParagraphPayloads((prev) => {
        const updatedParagraphs = [...prev.paragraphs];
        updatedParagraphs[index].isLoading = false;
        return { ...prev, paragraphs: updatedParagraphs };
      });
    }
  };

  const toggleRightPanel = (index: number) => {
    // If the panel is being opened and the response is not already generated, start generating the response
    if (selectedParagraphIndex !== index && !paragraphPayloads.paragraphs[index].response) {
      handleGenerateResponse(index); // Start generating the response
    }

    // Toggle the selected paragraph index
    setSelectedParagraphIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 text-black p-6 space-y-4 shadow-md border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-lime-600">Your Notes</h2>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 p-8 gap-8">
        <section className="flex-1 max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 border-b-4 border-lime-500 pb-2">I Hear You</h1>

          <div className="mb-6">
            {paragraphPayloads.paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4 leading-relaxed"
              >
                <p className="flex-1 break-words overflow-wrap">{paragraph.text}</p>
                <button
                  className={`ml-4 p-2 rounded-full ${
                    paragraph.isLoading
                      ? "bg-gray-200 text-gray-600"
                      : paragraph.response
                      ? "bg-green-200 text-green-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  onClick={() => toggleRightPanel(index)}
                  disabled={paragraph.isLoading}
                  title="Generate Response"
                >
                  {paragraph.isLoading ? "..." : "⋮"}
                </button>
              </div>
            ))}
          </div>

          <textarea
            className="w-full h-[8rem] p-4 text-lg bg-white border border-gray-300 rounded-lg shadow-inner font-serif focus:outline-none leading-relaxed"
            placeholder="Start typing your next paragraph..."
            value={handleText}
            onChange={(e) => empathyHandler(e)}
          />
        </section>

        {/* Right-Side Panel */}
        {selectedParagraphIndex !== null && (
          <section className="w-1/3 bg-gray-50 p-6 shadow-md border-l border-gray-300">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            {paragraphPayloads.paragraphs[selectedParagraphIndex].response ? (
              <p>
                <strong>Response:</strong> {paragraphPayloads.paragraphs[selectedParagraphIndex].response}
              </p>
            ) : (
              <p className="text-gray-500">No response generated yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}