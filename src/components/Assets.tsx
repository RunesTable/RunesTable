import React from 'react';

export default function Assets() {
  return (
    <div className="bg-black block w-full h-[calc((100vh-8.25rem)*0.94)] overflow-auto rounded-lg m-1 border border-gray-400 relative z-10">
      <table className="block">
        <thead className="z-20 block h-20 bg-black border border-gray-400 pt-6 sticky top-0 min-w-max">
          <tr className="grid grid-rows-1 grid-cols-8 text-center items-center h-16 cursor-pointer">
            <th className="row-start-1 col-start-1 min-w-32" scope="col">Name</th>
            <th className="row-start-1 col-start-2 min-w-32" scope="col">Price</th>
            <th className="row-start-1 col-start-3 min-w-32 text-green-500" scope="col">1D Change</th>
            <th className="row-start-1 col-start-4 min-w-32" scope="col">1D Volume</th>
            <th className="row-start-1 col-start-5 min-w-32" scope="col">Quantity</th>
            <th className="row-start-1 col-start-6 min-w-32" scope="col">Transferable</th>
            <th className="row-start-1 col-start-7 min-w-32" scope="col">
              <button className="flex flex-row justify-center items-center rounded-lg border border-gray-400 h-12 w-full m-[0.2px]" onClick={()=>{console.log("transfer")}}>Transfer</button>
            </th>
            <th className="row-start-1 col-start-8 min-w-32" scope="col">
              <button className="flex flex-row justify-center items-center rounded-lg border border-gray-400 h-12 w-full m-[0.2px]" onClick={()=>{console.log("list")}}>List</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="grid grid-rows-1 grid-cols-8 text-center items-center h-16 cursor-pointer">
            <td className="row-start-1 col-start-1 min-w-32">name</td>
            <td className="row-start-1 col-start-2 min-w-32">Price</td>
            <td className="row-start-1 col-start-3 min-w-32 text-green-500">+3.56%</td>
            <td className="row-start-1 col-start-4 min-w-32">1D Vol</td>
            <td className="row-start-1 col-start-5 min-w-32">Quantity</td>
            <td className="row-start-1 col-start-6 min-w-32">Transferable</td>
            <td className="row-start-1 col-start-7 min-w-32">
              <button className="flex flex-row justify-center items-center rounded-lg border border-gray-400 h-12 w-full m-[0.2px]" onClick={()=>{console.log("transfer")}}>Transfer</button>
            </td>
            <td className="row-start-1 col-start-8 min-w-32">
              <button className="flex flex-row justify-center items-center rounded-lg border border-gray-400 h-12 w-full m-[0.2px]" onClick={()=>{console.log("list")}}>List</button>
            </td>
          </tr>
          {/* ... additional rows as needed ... */}
        </tbody>
      </table>
    </div>
  );
}
