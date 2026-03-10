import { useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import "../assets/accordian.css";


export const AccordionItem = ({ question, answer, isOpen, onClick }:any) => {
  const contentHeight = useRef<number>(0);
  return (
    <div className="wrapper">
      <button
        className={`question-container ${isOpen ? "active" : ""}`}
        onClick={onClick}
      >
        <p className="question-content">{question}</p>
        <RiArrowDropDownLine className={`arrow ${isOpen ? "active" : ""}`} />
      </button>

      <div
        ref={contentHeight}
        className="answer-container"
        style={
          isOpen
            ? { height: contentHeight.current.scrollHeight }
            : { height: "0px" }
        }
      >
        <p className="answer-content">{answer}</p>
      </div>
    </div>
  );
};