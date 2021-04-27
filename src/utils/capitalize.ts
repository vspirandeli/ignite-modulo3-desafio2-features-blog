export function capitalize(name: string): string {
  const splitedName = name.split(' ');
  let fullNameCapitalized = '';

  if (splitedName.length >= 2) {
    for (let i = 0; i in splitedName; i += 1) {
      const thisName = splitedName[i];
      const capitalizedName =
        thisName.charAt(0).toUpperCase() + thisName.slice(1);

      fullNameCapitalized = `${fullNameCapitalized} ${capitalizedName}`;
    }

    return fullNameCapitalized.trim();
  }

  return (name.charAt(0).toUpperCase() + name.slice(1)).trim();
}
