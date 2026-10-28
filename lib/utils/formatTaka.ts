// Formats an amount as Bangladeshi Taka, e.g. 1500 → "৳1,500", -5350 → "-৳5,350".
// Same "৳ + en-BD grouping" style TransactionTable already uses for individual transactions.
export const formatTaka = (amount: number) =>
  `${amount < 0 ? "-" : ""}৳${Math.abs(amount).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
