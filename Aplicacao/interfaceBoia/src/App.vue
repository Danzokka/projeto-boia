<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import LineChart from "./components/LineChart.vue";
import DataTable from "./components/DataTable.vue";

const mediaTemperatura = ref([]);
const mediaPorMinuto = ref([]);

async function fetchData() {
  try {
    const response = await fetch("http://localhost:5000/api/temperaturas");
    const data = await response.json();
    mediaTemperatura.value = data;
    console.log(mediaTemperatura.value);

    // Update lineChartData after fetching data
    lineChartData.value = {
      labels: mediaTemperatura.value.map((item) => item.interval),
      datasets: [
        {
          label: "Média de Temperatura",
          data: mediaTemperatura.value.map((item) => item.media_temperatura),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    // Calculate average per minute
    calculateAveragePerMinute();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function calculateAveragePerMinute() {
  const groupedData = {};
  mediaTemperatura.value.forEach((item) => {
    const minute = item.interval.split(":")[1]; // Assuming interval is in HH:MM format
    if (!groupedData[minute]) {
      groupedData[minute] = [];
    }
    groupedData[minute].push(item.media_temperatura);
  });

  mediaPorMinuto.value = Object.keys(groupedData).map((minute) => {
    const temperatures = groupedData[minute];
    const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    return { Minute: minute, AverageTemperature: average.toFixed(2) };
  });
}

// Dados e opções para o gráfico de linha
const lineChartData = ref(null);
const lineChartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

// Dados para a tabela
const tableColumns = ref(["Minute", "AverageTemperature"]);
const tableData = ref([]);

onMounted(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 30000); // 30 seconds

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <div class="bg-[#F7FFFE]">
    <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">
      Dashboard de Temperatura
    </h1>

    <!-- Gráfico de Linha -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">
        Temperatura por segundo
      </h2>
      <div class="bg-white p-4 rounded-lg shadow">
        <LineChart
          v-if="lineChartData"
          :chart-data="lineChartData"
          :chart-options="lineChartOptions"
        />
      </div>
    </section>

    <!-- Tabela de Dados -->
    <section>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">
        Média de Temperatura por Minuto
      </h2>
      <div class="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <DataTable :columns="tableColumns" :data="mediaPorMinuto" />
      </div>
    </section>
  </div>
</template>
