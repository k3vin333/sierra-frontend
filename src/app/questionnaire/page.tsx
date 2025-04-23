'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionnairePage() {
  const router = useRouter();
  
  const questions = [
    { 
      qId: '1',
      question: 'What is your primary investment goal when using SIERRA-Impact?',
      answers: [
          { aId: '1', text: 'Risk and Sustainability Assessment' },
          { aId: '2', text: 'Evaluating growth between ESG and the financial market' },
          { aId: '3', text: 'Viewing news on relevant ESG data' }
      ]
    },
    {
      qId: '2',
      question: 'Which metric of ESG data are you most concerned about?',
      answers: [
          { aId: '1', text: 'Environmental' },
          { aId: '2', text: 'Social' },
          { aId: '3', text: 'Governance' },
          { aId: '4', text: 'All of the above' }
      ]
    },
    {
      qId: '3',
      question: 'What type of companies are you most interested in?',
      answers: [
          { aId: '1', text: 'Technology' },
          { aId: '2', text: 'News' },
          { aId: '3', text: 'Finance' },
          { aId: '4', text: 'Food and Hospitality' }
      ]
    }
  ];

  const [selected, setSelected] = useState<{ [questionId: string]: string | null }>({});

  const handleAnswer = (qId: string, aId: string) => {
    setSelected((prev) => ({...prev, [qId]: prev[qId] === aId ? null : aId,}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAnswers = Object.entries(selected).filter(([aId]) => aId);

    if (selectedAnswers.length < questions.length) {
      alert("All questions must be answered.");
      return;
    }
    
    const queryParams = new URLSearchParams();
    selectedAnswers.forEach(([qId, aId]) => {
      queryParams.append(qId, aId as string);
    });

    router.push(`/complete?${queryParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[#F7EFE6] text-[#17521e] flex p-8 overflow-y-scroll"
    >
      <div className="max-w-3xl mx-auto text-center"> 
        <h1 className="text-4xl font-bold mb-6 ">Before you land in your homepage...</h1>
        <h2 className="text-2xl font-medium mb-6">Take a quick questionnaire to personalise your experience!</h2>
          {questions.map((question) => (
          <div
            key={question.qId}
            className="w-full p-4 mb-6 bg-white border border-gray-300 rounded-xl shadow-md"
          >
            <h3 className="text-2xl font-medium mb-4">{question.question}</h3>
            <div className="space-y-4">
              {question.answers.map((answer) => (
                <button
                  key={answer.aId}
                  type="button"
                  onClick={() => handleAnswer(question.qId, answer.aId)}
                  className={`w-full p-4 border rounded cursor-pointer transition-colors
                    ${
                      selected[question.qId] === answer.aId
                        ? "bg-[#17521e] text-white border-[#17521e]"
                        : "bg-white text-black border-gray-300 hover:bg-[#1D4023] hover:text-white"
                    }`}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="mt-8 px-6 py-3 bg-[#17521e] text-white font-semibold rounded-lg cursor-pointer hover:bg-[#1D4023] transition"
        >
          Complete Questionnaire
        </button>
      </div>
    </form>
  );  
} 