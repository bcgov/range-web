export const allowNumberOnly = (e) => {
  if (!(e.charCode >= 48 && e.charCode <= 57)) {
    e.preventDefault();
    e.stopPropagation();
  }
};

export const allowAlphabetOnly = (e) => {
  const regex = new RegExp('^[a-zA-Z ]+$');
  const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    e.stopPropagation();
  }
};

export const handleWhenEnterPressed = (e, callback) => {
  if (e.charCode === 13) {
    callback(e);
  }
};
