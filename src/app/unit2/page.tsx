"use client";

import { useState } from "react";
import exercisesData from "../../data/unit2_exercises.json";
import Link from "next/link";

export default function Unit2Exercises() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleInputChange = (sectionIndex: number, exerciseIndex: number, value: string) => {
    const key = `${sectionIndex}-${exerciseIndex}`;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col items-center">
          <Link href="/" className="self-start mb-6 text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-800 tracking-tight mb-4 text-center">
            Unit 2 Exercises
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center">
            Translate the following Quranic phrases. Fill in the blanks just like in your workbook.
          </p>
        </header>

        <div className="space-y-12">
          {exercisesData.map((section, sIndex) => (
            <section key={sIndex} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
                <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-amiri)] text-right relative z-10" dir="rtl">
                  {section.section}
                </h2>
                <p className="text-indigo-200 mt-2 text-right relative z-10 font-medium">{section.description}</p>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 bg-slate-50/30">
                {section.exercises.map((exercise, eIndex) => {
                  const key = `${sIndex}-${eIndex}`;
                  return (
                    <div key={eIndex} className="flex flex-col space-y-5 group">
                      <div className="flex justify-end">
                        <span 
                          className="text-4xl md:text-5xl font-[family-name:var(--font-amiri)] text-slate-800 group-hover:text-indigo-700 transition-colors duration-300 leading-tight drop-shadow-sm"
                          dir="rtl"
                        >
                          {exercise.arabic}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          dir="rtl"
                          value={answers[key] || ""}
                          onChange={(e) => handleInputChange(sIndex, eIndex, e.target.value)}
                          placeholder="ترجمہ لکھیں..."
                          className="w-full bg-transparent border-b-2 border-slate-300 px-2 py-3 text-2xl text-right font-[family-name:var(--font-amiri)] text-indigo-900 focus:outline-none focus:border-indigo-600 transition-all duration-300 placeholder-slate-300 focus:bg-indigo-50/50 rounded-t-lg"
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 group-focus-within:w-full transition-all duration-500 ease-out"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
