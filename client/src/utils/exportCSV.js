export const downloadCSV = (data) => {
  const headers = ["Date,Title,Type,Category,Amount\n"];
  const rows = data.map(t => 
    `${new Date(t.date).toLocaleDateString()},${t.title},${t.type},${t.category},${t.amount}`
  );
  const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `transactions_${new Date().toLocaleDateString()}.csv`);
  a.click();
};