import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container flex justify-center items-center h-5/6 m-auto bg-gray-800 rounded-lg shadow-md">
      <div className="faq-section w-full max-w-xl p-5 bg-gray-700 rounded-lg shadow-lg">
        <h4 className="text-center text-2xl font-semibold text-red-400 mb-5">
          Frequently Asked Questions
        </h4>
        <div className="faq">
          {faqData.map((item, index) => (
            <div key={index} className="mb-5">
              <div
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-600 rounded-md shadow-sm"
                onClick={() => toggleAnswer(index)}
              >
                <p className="text-lg font-medium text-white">
                  {item.question}
                </p>
                {activeIndex === index ? (
                  <span className="text-red-400 font-bold">-</span>
                ) : (
                  <span className="text-red-400 font-bold">+</span>
                )}
              </div>
              {activeIndex === index && (
                <div className="answer mt-2 p-3 bg-gray-700 border-l-4 border-red-400 rounded-md">
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const faqData = [
  {
    question: "How do I submit a complaint?",
    answer:
      "To submit a complaint, click on the 'Add Complaint' button and fill in the details.",
  },
  {
    question: "How long does it take to resolve a complaint?",
    answer: "Complaints are usually resolved within 5-7 business days.",
  },
  {
    question: "Can I track the status of my complaint?",
    answer: "Yes, you can track the status in the 'My Complaints' section.",
  },
  {
    question: "What should I do if I don't get a response?",
    answer:
      "If you don't receive a response within the expected time, please contact our support team.",
  },
];

export default FAQ;
