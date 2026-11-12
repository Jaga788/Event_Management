export const money = value => '₹' + Number(value).toLocaleString('en-IN');

export const prettyDate = date => new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const readLocalStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
