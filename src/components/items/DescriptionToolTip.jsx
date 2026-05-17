export default function DescriptionTooltip({
  text = "",
  maxLength = 30,
}) {
  // If text is short, show normally
  if (!text || text.length <= maxLength) {
    return (
      <span className="text-gray-700">
        {text}
      </span>
    );
  }

  // Truncated text
  const truncated = `${text.slice(0, maxLength)}...`;

  return (
    <div className="relative group inline-block max-w-full">
      {/* Short text in table */}
      <span className="cursor-pointer text-gray-700">
        {truncated}
      </span>

      {/* Tooltip shown on hover */}
      <div
        className="
          absolute left-0 top-full mt-2
          hidden group-hover:block
          z-[9999]
          w-96 max-w-[32rem]
          bg-gray-300 text-black
          text-sm leading-relaxed
          p-3 rounded-lg shadow-2xl
          break-words whitespace-normal
        "
      >
        {text}
      </div>
    </div>
  );
}