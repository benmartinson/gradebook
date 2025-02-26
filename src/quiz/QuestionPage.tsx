import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function QuestionPage() {
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Mock questions - replace with actual data from your API
  const questions = [
    { id: 1, text: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"] },
    { id: 2, text: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Mercury"] },
    // ... more questions
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log("Submitted answer:", answer);
    setAnswer("");
    
    // Move to next question if available
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold">Science Quiz</h1>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm font-medium">Time remaining: 15:00</span>
          </div>
          <div className="w-full bg-indigo-800 rounded-full h-2 mt-4">
            <div className="bg-indigo-300 h-2 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>
        </header>
        
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{questions[currentQuestion].text}</h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    answer === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setAnswer(option)}
                >
                  <span className="font-medium text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-gray-50 border-t border-gray-100"
        >
          <div className="flex items-center gap-4">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!answer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
