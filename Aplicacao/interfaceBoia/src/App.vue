<script setup>
import { ref, onMounted } from "vue";
import LineChart from "./components/LineChart.vue";
import DataTable from "./components/DataTable.vue";

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
const tableColumns = ref(["Nome", "Idade", "Cidade"]);
const tableData = ref([]);

// Inicializa os dados do gráfico e da tabela quando o componente é montado
onMounted(() => {
  lineChartData.value = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
    datasets: [
      {
        label: "Vendas",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
      },
    ],
  };

  tableData.value = [
    { Nome: "Ana", Idade: 28, Cidade: "São Paulo" },
    { Nome: "Bruno", Idade: 32, Cidade: "Rio de Janeiro" },
    { Nome: "Carla", Idade: 25, Cidade: "Belo Horizonte" },
    { Nome: "Diego", Idade: 35, Cidade: "Curitiba" },
  ];
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
        Gráfico de Vendas
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
        Dados dos Clientes
      </h2>
      <div class="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <DataTable :columns="tableColumns" :data="tableData" />
      </div>
    </section>
  </div>
</template>
