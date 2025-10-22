function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

export default formatDateToDDMMYYYY;