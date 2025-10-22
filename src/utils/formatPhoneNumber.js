function formatPhoneNumber(phoneNumber) {
  const phoneNumberAsString = String(phoneNumber);
  if (phoneNumberAsString.length === 10) {
    return phoneNumberAsString.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else {
    return phoneNumber;
  }
}

export default formatPhoneNumber;
