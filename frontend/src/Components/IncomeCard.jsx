export default function IncomeCard({ toggleIncomeCard }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleIncomeCard}
      ></div>
      <div className="relative w-96 p-6 bg-white shadow-lg rounded">
        <h2 className="text-xl font-bold mb-4">Add Income</h2>
        <form onSubmit={(e) => handleSubmit(e, "income")}>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={toggleIncomeCard}
          >
            Close
          </button>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
