/* eslint-disable react/prop-types */
import { useState } from "react";
import { AiTwotoneEdit, AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const ArticlePage = () => {
  const [articles, setArticles] = useState([
    { _id: 1, title: "The Future of AI in Healthcare", category: "Technology", author: "Dr. John Doe", createdAt: "2025-10-31", image: "https://via.placeholder.com/300x150", description: "Full description of AI in Healthcare." },
    { _id: 2, title: "Top 10 Travel Destinations 2025", category: "Travel", author: "Emily Smith", createdAt: "2025-10-28", image: "https://via.placeholder.com/300x150", description: "Full description of Travel Destinations." },
    { _id: 3, title: "Healthy Habits for Modern Professionals", category: "Health", author: "Dr. Maria Chen", createdAt: "2025-10-20", image: "https://via.placeholder.com/300x150", description: "Full description of Healthy Habits." },
    { _id: 4, title: "How Blockchain Will Transform Banking", category: "Finance", author: "Robert King", createdAt: "2025-09-15", image: "https://via.placeholder.com/300x150", description: "Full description of Blockchain in Banking." },
    { _id: 5, title: "Best UI Design Trends in 2025", category: "Design", author: "Anna White", createdAt: "2025-09-05", image: "https://via.placeholder.com/300x150", description: "Full description of UI Design Trends." },
    { _id: 6, title: "Mastering React 19: Tips & Tricks", category: "Development", author: "Kevin Brooks", createdAt: "2025-08-30", image: "https://via.placeholder.com/300x150", description: "Full description of React 19 Tips." },
    { _id: 7, title: "How to Grow a Remote Team Effectively", category: "Business", author: "Sarah Lopez", createdAt: "2025-08-15", image: "https://via.placeholder.com/300x150", description: "Full description of Remote Team Management." },
    { _id: 8, title: "Electric Cars: The Next Big Leap", category: "Automobile", author: "Michael Green", createdAt: "2025-08-01", image: "https://via.placeholder.com/300x150", description: "Full description of Electric Cars." },
    { _id: 9, title: "Building Mental Resilience in 2025", category: "Wellness", author: "Dr. Aisha Patel", createdAt: "2025-07-20", image: "https://via.placeholder.com/300x150", description: "Full description of Mental Resilience." },
    { _id: 10, title: "5G Networks Explained Simply", category: "Technology", author: "Tom Lee", createdAt: "2025-07-10", image: "https://via.placeholder.com/300x150", description: "Full description of 5G Networks." },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((a) => a._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Articles</h1>
        <button className="px-5 py-2 bg-[#161925] text-white rounded-lg hover:bg-[#161925]/85 transition">
          + Add New Article
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article, index) => (
              <tr key={article._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-semibold">{article.title}</td>
                <td className="px-6 py-4">{article.category}</td>
                <td className="px-6 py-4">{article.author}</td>
                <td className="px-6 py-4">{article.createdAt}</td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => {
                      setSelectedArticle(article);
                      setShowModal(true);
                    }}
                  >
                    <AiOutlineEye size={20} />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => alert(`Edit Article: ${article._id}`)}
                  >
                    <AiTwotoneEdit size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(article._id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p><strong>Category:</strong> {selectedArticle.category}</p>
              <p><strong>Author:</strong> {selectedArticle.author}</p>
              <p><strong>Created At:</strong> {selectedArticle.createdAt}</p>
              <p><strong>Description:</strong> {selectedArticle.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
