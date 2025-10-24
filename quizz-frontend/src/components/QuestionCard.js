import React from "react";

export default function QuestionCard({ index, total, question, selected, onSelect }) {
  const options = [
    { key: "option1", label: question.option1 },
    { key: "option2", label: question.option2 },
    { key: "option3", label: question.option3 },
    { key: "option4", label: question.option4 },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1520] p-5 shadow-lg">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-300/80">
        <span>
          Question <span className="font-semibold text-teal-300">{index + 1}</span> / {total}
        </span>
      </div>
      <h2 className="mb-4 text-lg font-medium text-white">{question.question}</h2>
      <div className="grid gap-3">
        {options.map((opt, i) => {
          const isActive = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              className={
                "w-full rounded-lg border px-4 py-3 text-left transition " +
                (isActive
                  ? "border-teal-400 bg-teal-500/20 text-teal-200"
                  : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10")
              }
            >
              <span className="mr-2 inline-block rounded-full border border-teal-400/50 px-2 py-0.5 text-xs text-teal-300">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
