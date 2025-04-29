// LinkFinder.tsx
import React, { useState } from "react";
import LinkifyText from "../components/LinkifyText";

const LinkFinder: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        🔎 Link Finder
      </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8">
        <label htmlFor="text-input" className="block text-lg font-semibold mb-3 text-gray-300">
          Paste your text below:
        </label>
        <textarea
          id="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={8}
          className="w-full p-4 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-900 text-gray-100 placeholder-gray-500"
          placeholder="Type or paste your text here..."
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">Result:</h2>
        <div className="border-2 border-gray-700 p-4 rounded-xl bg-gray-900 min-h-[120px] text-gray-100 break-words">
          {inputText.trim() === "" ? (
            <p className="text-gray-500 italic">Your linkified text will appear here...</p>
          ) : (
            <LinkifyText text={inputText} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkFinder;
