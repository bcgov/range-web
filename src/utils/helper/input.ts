export const allowAlphabetOnly = (e: KeyboardEvent): void => {
  const regex = new RegExp('^[a-zA-Z ]+$');
  const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    e.stopPropagation();
  }
};

export const handleWhenEnterPressed = (e: KeyboardEvent, callback: (e: KeyboardEvent) => void): void => {
  if (e.charCode === 13) {
    callback(e);
  }
};
