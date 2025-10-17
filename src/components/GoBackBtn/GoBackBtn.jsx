import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./GobackBtn.css";

const GoBackBtn = () => {
  const navigate = useNavigate();

  return (
    <div
      className="icon-container go-back"
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowLeftIcon />
    </div>
  );
};

export default GoBackBtn;
