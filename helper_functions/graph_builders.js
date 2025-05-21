import QuickChart from "quickchart-js";
import { DateTime } from "luxon";

async function timeline_graph(
  data = {},
  title = "",
  x_label = "",
  y_label = "",
  datasetLabel = "Data"
) {
  let dataset = {
    label: datasetLabel,
    backgroundColor: "rgba(75, 192, 192, 0.5)",
    borderColor: "rgb(75, 192, 192)",
    fill: false,
    data: []
  };

  for (let key of Object.keys(data)) {
    // Asumsi key adalah Unix timestamp detik, konversi ke ISO string
    let dateStr = DateTime.fromSeconds(parseInt(key)).toISO();
    dataset.data.push({ x: dateStr, y: data[key] });
  }

  let options = {
    plugins: {
      title: {
        display: !!title,
        text: title,
        color: "rgb(143, 143, 143)",
        font: { size: 40 }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        type: "time",
        title: {
          display: !!x_label,
          text: x_label,
          color: "rgb(143, 143, 143)",
          font: { size: 30 }
        },
        ticks: {
          color: "rgb(143, 143, 143)",
          font: { size: 25 }
        },
        grid: {
          color: "rgb(143, 143, 143)"
        }
      },
      y: {
        title: {
          display: !!y_label,
          text: y_label,
          color: "rgb(143, 143, 143)",
          font: { size: 30 }
        },
        ticks: {
          color: "rgb(143, 143, 143)",
          font: { size: 25 }
        },
        grid: {
          color: "rgb(143, 143, 143)"
        }
      }
    }
  };

  const qc = new QuickChart();
  qc.setConfig({
    type: "line",
    data: {
      datasets: [dataset]
    },
    options: options
  });
  qc.setWidth(1500).setHeight(800).setBackgroundColor("transparent");

  const image = await qc.toBinary();
  return image;
}

const Graphs_builders = {
  timeline_graph
};

export { Graphs_builders };
