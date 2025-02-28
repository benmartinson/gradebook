import { useNavigate } from "react-router";

const BackToScoresButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="text-gray-600 hover:text-gray-800 flex items-center gap-2" 
      onClick={() => navigate("/gradebook")}
    >
      ← Back to Scores
    </button>
  );
};

export default BackToScoresButton;