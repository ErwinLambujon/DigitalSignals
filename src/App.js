import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, Typography, CardContent } from "@mui/material";

const DigitalSignalEncoding = () => {
  const [inputData, setInputData] = useState("");

  const convertToBinary = (data) => data.split("").map((bit) => parseInt(bit));

  const nrzl = (bits) => bits.map((bit) => (bit === 0 ? 0 : 1));

  const nrzi = (bits) => {
    let prev = 0;
    return bits.map((bit) => {
      const current = bit === 0 ? prev : 1 - prev;
      prev = current;
      return current;
    });
  };

  const bipolarAmi = (bits) => {
    let lastSignal = 0;
    return bits.map((bit) => {
      if (bit === 1) {
        lastSignal = lastSignal === 1 ? -1 : 1;
        return lastSignal;
      }
      return 0;
    });
  };

  const pseudoternary = (bits) => {
    let lastSignal = 0;
    return bits.map((bit) => {
      if (bit === 0) {
        lastSignal = lastSignal === 1 ? -1 : 1;
        return lastSignal;
      }
      return 0;
    });
  };

  const manchester = (bits) => {
    let points = [];
    bits.forEach((bit) => {
      if (bit === 0) {
        points.push(1, -1);
      } else {
        points.push(-1, 1);
      }
    });
    return points;
  };

  const diffManchester = (bits) => {
    let points = [];
    let lastState = 1;

    bits.forEach((bit) => {
      if (bit === 0) {
        lastState = lastState === 1 ? -1 : 1;
        points.push(lastState);
        lastState = lastState === 1 ? -1 : 1;
        points.push(lastState);
      } else {
        points.push(lastState);
        lastState = lastState === 1 ? -1 : 1;
        points.push(lastState);
      }
    });

    return points;
  };

  const generateTransitionData = (bits, encoder) => {
    const encodedData = encoder(bits);
    const transitionData = [];

    for (let i = 0; i < encodedData.length; i++) {
      transitionData.push({ time: i, value: encodedData[i] });
      if (i < encodedData.length - 1) {
        transitionData.push({ time: i + 1, value: encodedData[i] });
      }
    }

    transitionData.push({
      time: encodedData.length,
      value: encodedData[encodedData.length - 1],
    });

    return transitionData;
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const renderSignals = () => {
    const bits = convertToBinary(inputData);

    const nrzlData = generateTransitionData(bits, nrzl);
    const nrziData = generateTransitionData(bits, nrzi);
    const bipolarAmiData = generateTransitionData(bits, bipolarAmi);
    const pseudoternaryData = generateTransitionData(bits, pseudoternary);
    const manchesterData = generateTransitionData(bits, manchester);
    const diffManchesterData = generateTransitionData(bits, diffManchester);

    const renderChart = (data, label, color, domain) => (
      <div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="time" type="number" tick={false} />{" "}
            <YAxis type="number" domain={domain} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke={color}
              name={label}
            />
          </LineChart>
        </ResponsiveContainer>
        <CardContent></CardContent>
      </div>
    );

    return (
      <div className="grid grid-cols-3 gap-4">
        {renderChart(nrzlData, "NRZ - L", "#8884d8", [0, 1])}
        {renderChart(nrziData, "NRZI", "#82ca9d", [0, 1])}
        {renderChart(bipolarAmiData, "Bipolar - AMI", "#ffc658", [-1, 1])}
        {renderChart(pseudoternaryData, "Pseudoternary", "#ff7300", [-1, 1])}
        {renderChart(manchesterData, "Manchester", "#37a2da", [-1, 1])}
        {renderChart(
          diffManchesterData,
          "Differential Manchester",
          "#8c8c8c",
          [0, 1]
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <Typography variant="h5">Digital Signal Encoding Visualizer</Typography>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="input-data" className="block font-medium mb-2">
            Enter binary data:
          </label>
          <input
            id="input-data"
            type="text"
            value={inputData}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <br />
        {renderSignals()}
      </CardContent>
    </Card>
  );
};

export default DigitalSignalEncoding;
