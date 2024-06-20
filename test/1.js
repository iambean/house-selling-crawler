import XLSX from 'xlsx';
const file = 'output/_test/data.xlsx';
// 原始数据集
const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 }
];

// 中文名映射关系
const headerMapping = {
    id: '编号',
    name: '姓名',
    age: '年龄'
};

// 生成 Excel 表格
// const ws = XLSX.utils.json_to_sheet(data, {header: Object.keys(data[0])});
const ws = XLSX.utils.json_to_sheet(data);
ws['!cols'] = [];
Object.keys(data[0]).forEach((key, colIndex) => {
    ws['!cols'][colIndex] = { wch: 30 };
    // ws[XLSX.utils.encode_cell({ r: 0, c: colIndex })] = { t: 's', v: headerMapping[key] };
});


const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, file);
