// helper_functions/company.js

export async function employees_info(company) {
  let count = 0;
  let director = '';

  for (const id of Object.keys(company.employees)) {
    count++;
    const employee = company.employees[id];

    if (parseInt(id) === company.director) {
      director = employee.name;
    }
  }

  return {
    employees_count: count,
    director_name: director,
  };
}

export const Company_functions = {
  employees_info
};
