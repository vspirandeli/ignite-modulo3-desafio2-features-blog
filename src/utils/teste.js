const captalize = (name) => {
  const splited = name.split(' ');

  if (splited.length >= 2) {
    const firstName = splited[0];
    const lastName = splited[1];

    const firstNameCapitalized =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);

    const lastNameCapitalized =
      lastName.charAt(0).toUpperCase() + lastName.slice(1);

    return `${firstNameCapitalized} ${lastNameCapitalized}`;

  } else {
    const firstNameCapitalized =
      name.charAt(0).toUpperCase() + name.slice(1);

      return firstNameCapitalized;
  }
};

const myname = 'victor hugo manzato spirandeli';
const singleName = 'victor'

// console.log(captalize(myname))

function optimizedCapitalize(name) {
  const splitedName = name.split(' ');
  let fullNameCapitalized = '';

  if (splitedName.length >= 2) {
    for (let i = 0; i in splitedName; i++) {
      const thisName = splitedName[i];
      const capitalizedName =
        thisName.charAt(0).toUpperCase() + thisName.slice(1);

      fullNameCapitalized = `${fullNameCapitalized} ${capitalizedName}`;
    }

    return fullNameCapitalized;

  } else {
    const firstNameCapitalized =
      name.charAt(0).toUpperCase() + name.slice(1);

    return firstNameCapitalized;
  }
}

console.log(optimizedCapitalize(myname))
