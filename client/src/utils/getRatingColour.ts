
export const getRatingColour = (rating: number) => {
  if (rating === 0) {
    return "bg-no-reviews-bg";
  } else if (rating < 3) {
    return "bg-main-red";
  } else if (rating < 4) {
    return "bg-orange";
  } else {
    return "bg-rating-green";
  }
}