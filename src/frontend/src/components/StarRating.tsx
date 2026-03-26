interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const sizeClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  const stars = ["one", "two", "three", "four", "five"].slice(0, max);
  return (
    <span className={`${sizeClass} leading-none`}>
      {stars.map((name, i) => (
        <span
          key={name}
          className={
            i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}
