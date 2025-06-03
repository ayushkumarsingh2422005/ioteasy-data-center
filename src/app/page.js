// src/app/page.js
"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sensor-data")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>EMS Sensor Table</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6">📊 EMS Sensor Data</h1>
        {/* Export Buttons */}
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => {
              if (!data.length) return;
              const replacer = (key, value) => (value === null ? '' : value);
              const header = Object.keys(data[0]);
              const csv = [
                header.join(','),
                ...data.map(row =>
                  header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
                ),
              ].join('\r\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sensor-data.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              if (!data.length) return;
              const json = JSON.stringify(data, null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sensor-data.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Export JSON
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
            <span className="ml-4 text-lg">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300 border border-gray-700">
              <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-4 py-3 border border-gray-700">Timestamp</th>
                  <th className="px-4 py-3 border border-gray-700">Device ID</th>
                  <th className="px-4 py-3 border border-gray-700">Pressure (Pa)</th>
                  <th className="px-4 py-3 border border-gray-700">Temperature (°C)</th>
                  <th className="px-4 py-3 border border-gray-700">Humidity (%)</th>
                  <th className="px-4 py-3 border border-gray-700">Oxygen (%)</th>
                  <th className="px-4 py-3 border border-gray-700">Sprinkler</th>
                  <th className="px-4 py-3 border border-gray-700">Exhaust Fan</th>
                  <th className="px-4 py-3 border border-gray-700">Cooler</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-gray-800 hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-2 border border-gray-700">{item.Timestamp}</td>
                    <td className="px-4 py-2 border border-gray-700">{item["Device ID"]}</td>
                    <td className="px-4 py-2 border border-gray-700">{item.Pressure}</td>
                    <td className="px-4 py-2 border border-gray-700">{item.Temperature}</td>
                    <td className="px-4 py-2 border border-gray-700">{item.Humidity}</td>
                    <td className="px-4 py-2 border border-gray-700">{item.Oxygen.toFixed(2)}</td>
                    <td className={`px-4 py-2 border border-gray-700 ${item.Sprinkler === "ON" ? "text-green-400" : "text-red-400"}`}>
                      {item.Sprinkler}
                    </td>
                    <td className={`px-4 py-2 border border-gray-700 ${item["Exhaust Fan"] === "ON" ? "text-green-400" : "text-red-400"}`}>
                      {item["Exhaust Fan"]}
                    </td>
                    <td className={`px-4 py-2 border border-gray-700 ${item.Cooler === "ON" ? "text-green-400" : "text-red-400"}`}>
                      {item.Cooler}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
