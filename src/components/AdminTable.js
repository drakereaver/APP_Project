import React from "react";

export default function AdminTable({ questions, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-300">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Question</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Answer</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-sm text-gray-300">{q.id}</td>
              <td className="px-4 py-3 text-sm text-white">{q.question}</td>
              <td className="px-4 py-3 text-sm text-teal-300">{q.answer}</td>
              <td className="px-4 py-3 text-right text-sm">
                <button
                  onClick={() => onEdit(q)}
                  className="mr-2 rounded-md border border-teal-500/40 px-3 py-1.5 text-teal-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(q)}
                  className="rounded-md bg-red-600/80 px-3 py-1.5 text-white transition hover:bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
