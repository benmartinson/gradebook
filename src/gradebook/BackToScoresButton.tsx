import { useNavigate, useParams } from "react-router";

const BackToScoresButton = () => {
  const navigate = useNavigate();
  const { class_id } = useParams();

  return (
    <button
      className="text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer"
      onClick={() => navigate(`/class/${class_id}/gradebook`)}
    >
      ← Back to Scores
    </button>
  );
};

export default BackToScoresButton;
