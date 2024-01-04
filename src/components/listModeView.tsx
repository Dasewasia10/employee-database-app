import React, { useState, useEffect, useContext, useMemo } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import EmployeeDetailModal from '../modal/EmployeeDetailModal';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../db/employeeService';

const ListModeView: React.FC = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [employees, setEmployees] = useState<any[]>([]);

  const initialSelectedMode = localStorage.getItem('selectedMode') || 'list';
  const [selectedMode, setSelectedMode] = useState<string>(initialSelectedMode);

  const [sortColumn, setSortColumn] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [gridSortOrder, setGridSortOrder] = useState<'asc' | 'desc'>('asc');

  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (person: any) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    // Menyimpan nilai selectedMode ke localStorage
    localStorage.setItem('selectedMode', mode);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Jika kolom sudah diurutkan sebelumnya, ubah urutan
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Jika kolom baru yang diurutkan, atur ke default ascending
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleGridSortToggle = () => {
    setGridSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedEmployees = useMemo(() => {
    return [...employees].slice().sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortOrder === 'asc' ? -1 : 1;
      if (aString > bString) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, sortColumn, sortOrder]);

  const sortedGridEmployees = useMemo(() => {
    return [...employees].slice().sort((a, b) => {
      const aValue = a['name'].toLowerCase();
      const bValue = b['name'].toLowerCase();

      if (gridSortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [employees, gridSortOrder]);

  const handleAddEmployee = async (employeeData: any) => {
    try {
      await addEmployee(employeeData);
      const updatedData = await getAllEmployees();
      setEmployees(updatedData);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (id: number, employeeData: any) => {
    try {
      await updateEmployee(id, employeeData);
      const updatedData = await getAllEmployees();
      setEmployees(updatedData);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await deleteEmployee(id);
      const updatedData = await getAllEmployees();
      setEmployees(updatedData);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const TableHeader: React.FC<{ column: string }> = ({ column }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        <span>{column}</span>
        {sortColumn === column && (
          <span className="ml-1">
            {sortOrder === 'asc' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4 inline"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4 inline"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );

  const CardView: React.FC<{ person: any; onCardClick: () => void }> = ({ person, onCardClick }) => (
    <div
      className={`cursor-pointer flex max-w-lg rounded-3xl overflow-hidden object-cover shadow-lg mb-4 ${
        darkMode ? 'bg-gray-800 hover:bg-gray-500 text-gray-100' : 'bg-white hover:bg-gray-400 text-gray-800'
      }`}
      onClick={onCardClick}
    >
      <img className="w-40 h-40 rounded-full object-cover -translate-x-12" src={person.image} alt={person.name} />
      <div className="px-3 py-4 flex flex-col items-center justify-center text-center text-wrap -translate-x-6">
        <div className="font-bold text-base mb-2">{person.name}</div>
        <p className="text-xs">{person.email}</p>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col justify-between">
      <div id="toggleModeView" className="flex flex-row-reverse mr-4 gap-4">
        <span
          className={`cursor-pointer p-2 rounded-xl duration-300 ${
            selectedMode === 'list'
              ? `${darkMode ? 'border-gray-200' : 'border-gray-800'} border-spacing-7 border-2`
              : ''
          }`}
          onClick={() => handleModeChange('list')}
        >
          {/* SVG for List Mode */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </span>
        <span
          className={`cursor-pointer p-2 rounded-xl ${
            selectedMode === 'grid'
              ? `${darkMode ? 'border-gray-200' : 'border-gray-800'} border-spacing-7 border-2`
              : ''
          }`}
          onClick={() => handleModeChange('grid')}
        >
          {/* SVG for Grid Mode */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </span>
      </div>
      {selectedMode === 'list' ? (
        <article id="listView">
          <div className="flex flex-col px-2 mt-8">
            <div className="-my-2 overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table
                    className={`min-w-full divide-y divide-gray-200 ${
                      darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
                    }`}
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        <TableHeader column="name" />
                        <TableHeader column="role" />
                        <TableHeader column="phone number" /> {/* Mengganti "phoneNumber" dengan "phone number" */}
                        <TableHeader column="status" />
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedEmployees.map((person, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={person.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-medium">{person.name}</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {person.id} - {person.gender === 1 ? 'Male' : 'Female'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base">{person.role}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {person.department}
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {person['phone number']} {/* Mengganti "phoneNumber" dengan "phone number" */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                person.retirementStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {person.retirementStatus ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openModal(person)}
                              className="border border-gray-300 bg-white hover:bg-gray-300 px-3 py-1 rounded text-indigo-600 hover:text-indigo-900"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <article id="gridView" className="relative w-full flex mt-4 flex-wrap gap-4 justify-center">
          <div className="absolute left-20 -translate-y-16 inline-flex gap-2 items-center shadow-lg px-4 py-2 rounded">
            <span className="font-bold text-sm mr-2">Sort by Name:</span>
            <button onClick={handleGridSortToggle} className="flex items-center p-2 rounded-full focus:outline-none">
              {gridSortOrder === 'asc' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sortedGridEmployees.map((person, index) => (
              <CardView key={index} person={person} onCardClick={() => openModal(person)} />
            ))}
          </div>
        </article>
      )}
      {isModalOpen && selectedPerson && <EmployeeDetailModal person={selectedPerson} onClose={closeModal} />}
    </section>
  );
};

export default ListModeView;
