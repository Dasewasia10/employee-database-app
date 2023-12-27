import { DarkModeContext } from './context/DarkModeContext';

import React, { useContext } from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import BarChart from './components/employeeDistributionChart';
import PieChart from './components/genderEmployeeChart';

const Dashboard: React.FC<{ username: string }> = ({ username }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`flex pt-10 h-screen overflow-hidden ${
        darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
      }`}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header username={username} />
        <article className="flex-1 p-4 overflow-auto">
          <h2 className="font-extrabold text-3xl mt-2 mb-6 px-4">Hello, {username}</h2>
          <div className="grid grid-cols-2 gap-4 mb-8 px-4">
            <section
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-900 text-gray-200 shadow-white' : 'bg-white text-gray-800'
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Total Employees</h2>
              <p className="text-2xl font-bold">123</p>
              <h3 className="text-sm">Employee(s)</h3>
            </section>
            <section
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-900 text-gray-200 shadow-white' : 'bg-white text-gray-800'
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Total Departments</h2>
              <p className="text-2xl font-bold">5</p>
              <h3 className="text-sm">Department(s)</h3>
            </section>
          </div>
          <div className="flex gap-4 h-fit justify-around">
            <BarChart />
            <PieChart />
          </div>
        </article>
      </main>
    </div>
  );
};

export default Dashboard;
