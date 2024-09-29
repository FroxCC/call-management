'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registrar los elementos del gráfico
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Lazy load Pie and Bar components
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

export default function ReportPage() {
  // Datos para los gráficos y tabla
  const responseDistributionData = {
    labels: ['Not Interested', 'Sale Made', 'Interested', 'Call Back Later'],
    datasets: [
      {
        data: [40, 20, 20, 20],
        backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71'],
        hoverOffset: 4,
      },
    ],
  };

  const voicemailDistributionData = {
    labels: ['Voicemail', 'No Voicemail'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#3498db', '#2ecc71'],
        hoverOffset: 4,
      },
    ],
  };

  const callDurationData = {
    labels: ['David', 'Sarah', 'Mark', 'Anna', 'John'],
    datasets: [
      {
        label: 'duration',
        data: [90, 120, 180, 60, 150],
        backgroundColor: '#8e44ad',
      },
    ],
  };

  const callDetails = [
    { lineNumber: 1, firstName: 'David', lastName: 'Medina', timeOfCall: '9:45 AM', duration: 90, response: 'Not Interested', voicemail: 'YES' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">REP REPORT - James Doe #123 (09/27/2024)</h1>

      {/* Gráficos circulares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Response Distribution</h2>
          <Pie data={responseDistributionData} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Voicemail Distribution</h2>
          <Pie data={voicemailDistributionData} />
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Call Duration</h2>
        <Bar data={callDurationData} options={{ responsive: true, maintainAspectRatio: true }} height={200} />
      </div>

      {/* Tabla de detalles de las llamadas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Line Number</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Time of Call</th>
              <th className="py-2 px-4 border-b">Duration (sec)</th>
              <th className="py-2 px-4 border-b">Response</th>
              <th className="py-2 px-4 border-b">V.M.</th>
            </tr>
          </thead>
          <tbody>
            {callDetails.map((call, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{call.lineNumber}</td>
                <td className="py-2 px-4 border-b">{call.firstName}</td>
                <td className="py-2 px-4 border-b">{call.lastName}</td>
                <td className="py-2 px-4 border-b">{call.timeOfCall}</td>
                <td className="py-2 px-4 border-b">{call.duration}</td>
                <td className="py-2 px-4 border-b">{call.response}</td>
                <td className="py-2 px-4 border-b">{call.voicemail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
