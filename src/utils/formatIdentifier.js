function formatIdentifier(str) {
  let formatted = str.replace(/[_-]/g, " ");

  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");

  formatted = formatted.toLowerCase();

  formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
}

export default formatIdentifier;