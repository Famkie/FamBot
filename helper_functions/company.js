// Fungsi untuk menghitung jumlah karyawan dan nama direktur dari data perusahaan
export async function employees_info(company) {
  let count = 0;
  let director = '';

  for (const id of Object.keys(company.employees)) {
    count += 1;
    if (parseInt(id) === company.director) {
      director = company.employees[id].name;
    }
  }

  return {
    employees_count: count,
    director_name: director,
  };
}

// Kalau kamu ingin tetap punya ekspor terstruktur seperti sebelumnya:
export const Company_functions = {
  employees_info,
};
