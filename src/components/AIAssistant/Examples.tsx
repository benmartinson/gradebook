import React from "react";

interface Example {
  cat: string;
  text: string[];
}

const Examples: React.FC<{
  permissions: {
    allowAssignmentUpdate: boolean;
    allowAssignmentCreation: boolean;
    allowAssignmentDeletion: boolean;
    allowGradeUpdate: boolean;
  };
}> = ({ permissions }) => {
  const examples: Example[] = [
    {
      cat: "Bulk Updates",
      text: [
        "Set all quiz 1 grades to 85",
        "Change all grades for 'test 2' to 100",
      ],
    },
    {
      cat: "Multiple Updates",
      text: [
        "Change 'project 1' weight to 90, Leah grade on 'test 1' to 67, and due date for hw 2 to Mar 30",
      ],
    },
    {
      cat: "Grade Analysis",
      text: [
        "What's the average grade for Math Quiz 1?",
        "Who scored the highest on the recent test?",
      ],
    },
    {
      cat: "Student Performance",
      text: [
        "How is Sarah doing in the class?",
        "Show me students with grades below 70%",
      ],
    },
  ];

  const buildMessage = () => {
    const hasOneOrMore =
      permissions.allowAssignmentCreation ||
      permissions.allowAssignmentUpdate ||
      permissions.allowAssignmentDeletion ||
      permissions.allowGradeUpdate;
    return `Ask me anything about grades or assignments${
      hasOneOrMore
        ? ", or request changes. You will see a confirmation of any changes before I make them."
        : "."
    }`;
  };

  return (
    <div className="flex-grow overflow-y-auto space-y-3 mb-4 p-4 bg-white rounded-lg messages-container">
      <div className="text-center text-gray-500 mt-8">
        <p>{buildMessage()}</p>
        <div className="flex flex-col mt-4 space-y-3 max-md:hidden">
          {examples.map((example, idx) => (
            <div key={idx} className="space-y-1 mb-6">
              <span className="text-xs font-medium text-gray-500 block">
                {example.cat}
              </span>
              {example.text.map((text, textIdx) => (
                <div key={textIdx} className=" rounded-lg transition-colors">
                  <p className="text-sm text-gray-700">"{text}"</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Examples;
