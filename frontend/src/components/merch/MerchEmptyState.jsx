/* eslint-disable react/prop-types */
export default function MerchEmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
      <p className="text-gray-400 text-sm md:text-lg max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#CA249C] text-white hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
