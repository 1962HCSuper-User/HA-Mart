// utils/codeGenerator.js
function generateCode() {
  const digits = () => Math.floor(1000 + Math.random() * 9000);  // 4 digits
  const letters = () => Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))     // A-Z
  ).join('');
  const suffix = () => Math.floor(10 + Math.random() * 90);      // 2 digits
  return `${digits()}${letters()}${suffix()}`;
}

module.exports = generateCode;   // ✅ export only the function
