'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Papa from 'papaparse';

// Registrar los elementos del gráfico
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Lazy load Pie and Bar components
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

export default function ReportPage() {
  // Estado para manejar los datos del reporte
  const [callDetails, setCallDetails] = useState([]);
  const [responseDistribution, setResponseDistribution] = useState({});
  const [voicemailDistribution, setVoicemailDistribution] = useState({});
  const [callDuration, setCallDuration] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('Datos parseados:', result.data);
  
        // Limpiar los datos y ajustar los nombres de las propiedades
        const parsedData = result.data.map((row) => ({
          lineNumber: row['Phone Number']?.trim(),
          firstName: row['First Name']?.trim(),
          lastName: row['Last Name']?.trim(),
          timeOfCall: row['Time of Call']?.trim(),
          duration: parseInt(row['Duration (sec)']?.trim(), 10),
          response: row['Response']?.trim(),
          voicemail: row['V.M.']?.trim(),
        }));
  
        setCallDetails(parsedData);
        updateCharts(parsedData);
      },
    });
  };


  // Actualizar los gráficos con los datos del CSV
  const updateCharts = (data) => {
    const responseCounts = {};
    const voicemailCounts = { Voicemail: 0, 'No Voicemail': 0 };
    const callDurations = {};

    data.forEach((call) => {
      // Contar respuestas
      const response = call.response || 'Unknown';
      responseCounts[response] = (responseCounts[response] || 0) + 1;

      // Contar voicemails
      const voicemail = call.voicemail === 'YES' ? 'Voicemail' : 'No Voicemail';
      voicemailCounts[voicemail] += 1;

      // Duración de llamadas
      const name = call.firstName || 'Unknown';
      callDurations[name] = (callDurations[name] || 0) + parseInt(call.duration, 10);
    });

    setResponseDistribution({
      labels: Object.keys(responseCounts),
      datasets: [
        {
          data: Object.values(responseCounts),
          backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71'],
          hoverOffset: 4,
        },
      ],
    });

    setVoicemailDistribution({
      labels: Object.keys(voicemailCounts),
      datasets: [
        {
          data: Object.values(voicemailCounts),
          backgroundColor: ['#3498db', '#2ecc71'],
          hoverOffset: 4,
        },
      ],
    });

    setCallDuration({
      labels: Object.keys(callDurations),
      datasets: [
        {
          label: 'duration',
          data: Object.values(callDurations),
          backgroundColor: '#8e44ad',
        },
      ],
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">REP REPORT - James Doe #123 (09/27/2024)</h1>

      {/* Input para cargar el archivo CSV */}
      <div className="mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4 p-2 border rounded"
        />
      </div>

      {/* Gráficos circulares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Response Distribution</h2>
          {responseDistribution.labels && <Pie data={responseDistribution} />}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Voicemail Distribution</h2>
          {voicemailDistribution.labels && <Pie data={voicemailDistribution} />}
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Call Duration</h2>
        {callDuration.labels && <Bar data={callDuration} options={{ responsive: true, maintainAspectRatio: true }} height={200} />}
      </div>

      {/* Tabla de detalles de las llamadas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Phone Number</th>
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
