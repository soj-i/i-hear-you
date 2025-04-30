"use client";

import Image from "next/image";

import React, {useState} from "react";

export default function Home() {

  const [storyResponse, setStoryResponse] = useState('story here...');

  // form submission logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(event.currentTarget);
    const userInput = formData.get("userInput"); // Get the input value
  

    if (!userInput) {
      console.error("User input is required");
      return;
    }
    
    try { // posts/exposes to backend api logic
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),

      });
  
      if (!response.ok) {
        throw new Error("Failed to generate response");
      }
  
      const data = await response.json();
      console.log("Generated Response:", data.response); // Log the response from the backend

      setStoryResponse(data.response);
      
    } 
    
    catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  
  return (
    <div className="flex min-h-screen gap-x-4 p-4 pt-28">
    {}
    <div
      className="flex-1 p-4 rounded shadow-lg"
      style={{ backgroundColor: "var(--box-background-left)" }}
    >
      <h2 className="text-lg font-bold mb-4">Generated Response</h2>
      <div className="h-full overflow-auto">
        <p>{storyResponse}</p>
      </div>
    </div>

    {/* Right Box */}
    <div
      className="flex-1 p-4 rounded shadow-lg"
      style={{ backgroundColor: "var(--box-background-right)" }}
    >
      <h2 className="text-lg font-bold mb-4">Input</h2>
      <form onSubmit={handleSubmit}>
          <textarea
            className= "w-full h-64 border rounded p-2 mb-4 resize-none bg-gray-100"
            placeholder= "Write your input here..."
            name= "userInput" // Name attribute to identify the input
            required
          ></textarea>
          <button
            id="story_content"
            className="w-full text-white py-4 rounded"
            type= "submit"
            style={{
              backgroundColor: "var(--button-background)",
            }}
          >
            Generate Response
          </button>
        </form>
    </div>
  </div>
   
  );
}
