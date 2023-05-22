export function generateRandomPassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = lowercase.toUpperCase();
  const numbers = "0123456789";

  const getRandomChar = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };

  const getRandomCharOfType = (type) => {
    switch (type) {
      case "lowercase":
        return getRandomChar(lowercase);
      case "uppercase":
        return getRandomChar(uppercase);
      case "number":
        return getRandomChar(numbers);
      default:
        return "";
    }
  };

  let password = "";

  // Generar al menos un número, una letra mayúscula y una minúscula
  password += getRandomCharOfType("number");
  password += getRandomCharOfType("lowercase");
  password += getRandomCharOfType("uppercase");

  // Generar el resto de caracteres de forma aleatoria
  const remainingLength = 8 - password.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomType = Math.floor(Math.random() * 3);
    password += getRandomCharOfType(
      ["lowercase", "uppercase", "number"][randomType]
    );
  }

  return password;
}
