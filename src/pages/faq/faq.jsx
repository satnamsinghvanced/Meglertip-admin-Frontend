import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function FAQForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    category: ""
  });
  const [categories, setCategories] = useState([]);

  const isEdit = Boolean(id);

  const loadCategories = async () => {
    const res = await fetch(`${API}/api/categories`);
    const json = await res.json();
    setCategories(json.data || []);
  };

  const loadFAQ = async () => {
    const res = await fetch(`${API}/api/faqs/${id}`);
    const json = await res.json();

    setFaq({
      question: json.data.question,
      answer: json.data.answer,
      category: json.data.category?._id || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API}/api/faqs/${id}`
      : `${API}/api/faqs`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });

    navigate("/admin/faq");
  };

  useEffect(() => {
    loadCategories();
    if (isEdit) loadFAQ();
  }, [id]);

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <h2 className="text-xl font-semibold">
        {isEdit ? "Update FAQ" : "Create FAQ"}
      </h2>

      <input
        className="form-control"
        placeholder="Question"
        value={faq.question}
        onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        required
      />

      <textarea
        className="form-control"
        placeholder="Answer"
        rows={4}
        value={faq.answer}
        onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        required
      />

      <select
        className="form-control"
        value={faq.category}
        onChange={(e) => setFaq({ ...faq, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.categoryName}
          </option>
        ))}
      </select>

      <button className={`btn ${isEdit ? "btn-warning" : "btn-success"}`}>
        {isEdit ? "Update" : "Save"}
      </button>
    </form>
  );
}
