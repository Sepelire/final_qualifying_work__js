function exportToExcel(data, filename) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Данные деревьев");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveExcelFile(excelBuffer, filename);
  }
  
  function saveExcelFile(buffer, filename) {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
  
    link.click();
  
    document.body.removeChild(link);
  }
  