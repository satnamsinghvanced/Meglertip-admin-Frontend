const Section = ({ title, children, onSave, loading }) => (
  <div className="min-h-screen bg-gray-100 space-y-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
      <button
        onClick={onSave}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#161925] hover:bg-[#1f2230]"
        }`}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-6">{children}</div>
  </div>
);

export default Section;