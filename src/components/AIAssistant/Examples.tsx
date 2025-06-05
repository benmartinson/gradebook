import React from "react";

interface Example {
  cat: string;
  text: string;
}

interface ExamplesProps {
  examples: Example[];
}

const ExamplesTab: React.FC<ExamplesProps> = ({ examples }) => {
  return (
    <div className="flex-grow overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg messages-container">
      <div className="text-center text-gray-500 mt-8">
        <p>
          Ask me anything about grades, students, or assignments. I can also
          help you with bulk updates of grades. You will see a confirmation of
          any changes before I make them.
        </p>
        <div className="flex flex-col mt-4 space-y-1 max-md:hidden">
          {examples.map((example, idx) => (
            <div key={idx} className="p-3 rounded-lg transition-colors">
              <span className="text-xs font-medium text-gray-500">
                {example.cat}
              </span>
              <p className="text-sm text-gray-700">"{example.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplesTab;
