"use client";

import React, { useState } from "react";

export default function Home() {
  const [journalEntry, setJournalEntry] = useState("");
  const [storyResponse, setStoryResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mockNotes = [
    { id: 1, title: "Study Stress - April 2" },
    { id: 2, title: "Family Conflict - March 27" },
    { id: 3, title: "Feeling Lost - March 20" },
  ];

  const handleGenerateStory = async () => {
    if (!journalEntry.trim()) return;
    setIsLoading(true);
    try {
      const mockStory = "There was a student once who transferred midyear and felt like she was in a different world. She studied every night alone in the library, convinced she was falling behind. But one afternoon, she asked a stranger in her CS class a small question—and that moment cracked open a door. You never know who’s waiting to help if you let them in."
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStoryResponse(mockStory);
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 text-black p-6 space-y-4 shadow-md border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-lime-600">Your Notes</h2>
        <ul className="space-y-3">
          {mockNotes.map(note => (
            <li key={note.id}>
              <button
                className="w-full h-16 text-left bg-gray-50 hover:bg-gray-200 text-black px-3 py-2 rounded shadow-sm border border-gray-300 truncate"
                title={note.title}
              >
                {note.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 p-8 gap-8">
        <section className="flex-1 max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 border-b-4 border-lime-500 pb-2">I Hear You</h1>

          <textarea
            className="w-full h-[32rem] p-6 text-lg bg-white border border-gray-300 rounded-lg shadow-inner font-serif leading-relaxed focus:outline-lime-500 mb-6"
            placeholder="Start writing here..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          />

          {/* <button
            onClick={handleGenerateStory}
            className="w-1/3 bg-lime-500 hover:bg-lime-600 text-black font-semibold py-3 rounded text-xl shadow-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Reflect"}
          </button> */}
        </section>

        <section className="w-1/3">
          {storyResponse && (
            <div className="bg-gray-100 p-6 rounded shadow text-lg">
              <h2 className="font-semibold mb-3 text-lime-700">Reflection</h2>
              <p className="whitespace-pre-line leading-relaxed">{storyResponse}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
