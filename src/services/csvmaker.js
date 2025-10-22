const downloadCSV = async (data, name = 'file') => {
    const csvContent = data.map(e => e.join(",")).join("\n");
    const url = window.URL.createObjectURL(new Blob([csvContent]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove()
}

export default downloadCSV;