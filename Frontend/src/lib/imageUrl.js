export const resolveImageUrl = (imageField) => {
  if (!imageField) return "";

  if (typeof imageField !== "string") {
    return URL.createObjectURL(imageField);
  }

  if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
    return imageField;
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseUrl}${imageField}`;
};
