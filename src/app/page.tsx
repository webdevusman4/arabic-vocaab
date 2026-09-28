"use client";

import vocabularyData from "../data/vocabulary.json";
import { useState, useMemo, useEffect } from "react";

// The vocabulary.json is now an array of { page: number, words: array }
// Let's create a combined list for "All"
const allWordsMap = new Map();
vocabularyData.forEach((pageData) => {
  pageData.words.forEach((word) => {
    if (allWordsMap.has(word.root_word)) {
      // Merge variations if root word already exists
      const existing = allWordsMap.get(word.root_word);
      const newVariations = Array.from(new Set([...existing.variations, ...word.variations]));
      allWordsMap.set(word.root_word, { ...existing, variations: newVariations });
    } else {
      allWordsMap.set(word.root_word, { ...word });
    }
  });
});
const allWords = Array.from(allWordsMap.values());

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<number | "All" | "Learned" | "NotLearned">("All");
  const [progress, setProgress] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => setProgress(data))
      .catch(err => console.error("Failed to load progress:", err));
  }, []);

  const handleMark = async (root_word: string, status: string) => {
    // Optimistic update
    setProgress(prev => ({ ...prev, [root_word]: status }));
    
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word: root_word, status })
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const availablePages = vocabularyData.map(p => p.page).sort((a, b) => a - b);

  // Get the words for the currently selected filter
  const currentWords = useMemo(() => {
    if (selectedPage === "All") {
      return allWords;
    }
    if (selectedPage === "Learned") {
      return allWords.filter(w => progress[w.root_word] === "learned");
    }
    if (selectedPage === "NotLearned") {
      return allWords.filter(w => progress[w.root_word] !== "learned");
    }
    const pageData = vocabularyData.find(p => p.page === selectedPage);
    return pageData ? pageData.words : [];
  }, [selectedPage, progress]);

  // Filter based on search term
  const filteredWords = currentWords.filter(
    (item) =>
      item.root_word.includes(searchTerm) ||
      item.meaning_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning_ur.includes(searchTerm)
  );

  const notLearnedWords = filteredWords.filter(w => progress[w.root_word] !== 'learned');
  const learnedWords = filteredWords.filter(w => progress[w.root_word] === 'learned');

  const WordCard = ({ item }: { item: any }) => {
    const status = progress[item.root_word] || 'not_learned';
    
    return (
      <div
        className={`group bg-white border ${status === 'learned' ? 'border-green-200 shadow-green-50' : 'border-gray-100 shadow-sm'} rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="relative z-10 flex flex-col flex-1">
          <div className="mb-5 pb-5 border-b border-gray-50 flex justify-between items-start">
            <div className="w-full text-right">
              <h2 className="text-5xl font-[family-name:var(--font-amiri)] text-indigo-950 font-bold mb-1" dir="rtl">
                {item.root_word}
              </h2>
            </div>
          </div>
          
          <div className="mb-5 flex-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meaning</h3>
            <p className="text-2xl font-[family-name:var(--font-amiri)] text-indigo-900 mb-1" dir="rtl">{item.meaning_ur}</p>
            <p className="text-base font-medium text-gray-600">{item.meaning_en}</p>
          </div>

          <div className="mt-auto pt-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Variations in Text</h3>
            <div className="flex flex-wrap gap-2 justify-end mb-6" dir="rtl">
              {item.variations.map((variant: string, vIdx: number) => (
                <span
                  key={vIdx}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg font-[family-name:var(--font-amiri)] text-xl hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  {variant}
                </span>
              ))}
            </div>
            
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
              <button
                onClick={() => handleMark(item.root_word, 'not_learned')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  status !== 'learned'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                Not Learned
              </button>
              <button
                onClick={() => handleMark(item.root_word, 'learned')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  status === 'learned'
                    ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                Learned
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-[family-name:var(--font-inter)] text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 hidden md:flex shrink-0 h-full">
        <div className="p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-indigo-900 tracking-tight">Vocabulary</h2>
          <p className="text-sm text-gray-500 mt-1">Pages Explorer</p>
        </div>
        
        {/* Fixed Filters */}
        <div className="p-4 space-y-2 border-b border-gray-100 shrink-0">
          <button
            onClick={() => setSelectedPage("All")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              selectedPage === "All"
                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            All Words
          </button>
          <button
            onClick={() => setSelectedPage("Learned")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              selectedPage === "Learned"
                ? "bg-green-50 text-green-700 shadow-sm border border-green-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Learned
          </button>
          <button
            onClick={() => setSelectedPage("NotLearned")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              selectedPage === "NotLearned"
                ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Not Learned
          </button>
        </div>

        {/* Scrollable Pages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</p>
          </div>
          
          {availablePages.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setSelectedPage(pageNum)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                selectedPage === pageNum
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Page {pageNum}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
        
        {/* Mobile Sidebar Toggle (simple version just showing current page for now) */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <h2 className="text-lg font-bold text-indigo-900">Vocabulary</h2>
          <select 
            value={selectedPage} 
            onChange={(e) => {
              const val = e.target.value;
              setSelectedPage(val === "All" || val === "Learned" || val === "NotLearned" ? val : Number(val));
            }}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="All">All Words</option>
            <option value="Learned">Learned</option>
            <option value="NotLearned">Not Learned</option>
            <optgroup label="Pages">
              {availablePages.map(pageNum => (
                <option key={pageNum} value={pageNum}>Page {pageNum}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Sticky Header */}
          <header className="sticky top-0 z-30 bg-gradient-to-br from-indigo-50/95 via-white/95 to-purple-50/95 backdrop-blur-md px-6 py-8 border-b border-gray-200/50 shadow-sm mb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                  {selectedPage === "All" ? "All Vocabulary" : selectedPage === "Learned" ? "Learned Vocabulary" : selectedPage === "NotLearned" ? "Not Learned Vocabulary" : `Page ${selectedPage}`}
                </h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {filteredWords.length} words
                </span>
              </div>
              
              {/* Search Bar */}
              <div className="max-w-xl relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white/60 backdrop-blur-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm text-base"
                  placeholder="Search in Arabic, Urdu, or English..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-6 pb-12">

          {/* Vocabulary Grid */}
          {filteredWords.length > 0 ? (
            <div className="space-y-12">
              {notLearnedWords.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                      {notLearnedWords.length}
                    </span>
                    Not Learned
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {notLearnedWords.map((item, index) => (
                      <WordCard key={`not-learned-${index}`} item={item} />
                    ))}
                  </div>
                </section>
              )}

              {learnedWords.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                      {learnedWords.length}
                    </span>
                    Learned
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {learnedWords.map((item, index) => (
                      <WordCard key={`learned-${index}`} item={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No words found</h3>
              <p className="text-gray-500">Try adjusting your search term.</p>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}
