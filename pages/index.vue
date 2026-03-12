<template>
  <div class="row">
    <!-- Big Chart -->
    <div class="col-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
              <h5 class="card-category">Campaign Activity</h5>
              <h2 class="card-title">Performance</h2>
            </div>
            <div class="col-sm-6 d-flex d-sm-block">
              <div
                class="btn-group btn-group-toggle"
                :class="isRTL ? 'float-left' : 'float-right'"
                data-toggle="buttons"
              >
                <label
                  v-for="(option, index) in bigLineChartCategories"
                  :key="option.name"
                  class="btn btn-sm btn-primary btn-simple"
                  :class="{ active: bigLineChart.activeIndex === index }"
                  :id="index"
                >
                  <input
                    type="radio"
                    @click="initBigChart(index)"
                    name="options"
                    autocomplete="off"
                    :checked="bigLineChart.activeIndex === index"
                  />
                  <span class="d-none d-sm-block">{{ option.name }}</span>
                  <span class="d-block d-sm-none">
                    <i :class="option.icon"></i>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            ref="bigChart"
            :chart-data="bigLineChart.chartData"
            :gradient-colors="bigLineChart.gradientColors"
            :gradient-stops="bigLineChart.gradientStops"
            :extra-options="bigLineChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <!-- ── Row 1: Original 3 small charts ── -->
    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Total SMS Sent</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-bell-55 text-primary"></i> 1,284,540
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="purpleLineChart.chartData"
            :gradient-colors="purpleLineChart.gradientColors"
            :gradient-stops="purpleLineChart.gradientStops"
            :extra-options="purpleLineChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Active Subscribers</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-single-02 text-info"></i> 48,320
          </h3>
        </template>
        <div class="chart-area">
          <bar-chart
            style="height: 100%"
            :chart-data="blueBarChart.chartData"
            :gradient-stops="blueBarChart.gradientStops"
            :extra-options="blueBarChart.extraOptions"
          >
          </bar-chart>
        </div>
      </card>
    </div>

    <div class="col-lg-4" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">OBD Calls Delivered</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-send text-success"></i> 97,430
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="greenLineChart.chartData"
            :gradient-stops="greenLineChart.gradientStops"
            :extra-options="greenLineChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <!-- ── Row 2: 4 new inbound / outbound cards ── -->
    <div class="col-lg-3" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Total Inbound SMS &amp; USSD</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-chat-33 text-warning"></i> 62,140
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="inboundSmsUssdChart.chartData"
            :gradient-colors="inboundSmsUssdChart.gradientColors"
            :gradient-stops="inboundSmsUssdChart.gradientStops"
            :extra-options="inboundSmsUssdChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <div class="col-lg-3" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Total Inbound IVR</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-headphones text-info"></i> 12,840
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="inboundIvrChart.chartData"
            :gradient-colors="inboundIvrChart.gradientColors"
            :gradient-stops="inboundIvrChart.gradientStops"
            :extra-options="inboundIvrChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <div class="col-lg-3" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Total Outbound SMS &amp; USSD</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-send text-primary"></i> 328,360
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="outboundSmsUssdChart.chartData"
            :gradient-colors="outboundSmsUssdChart.gradientColors"
            :gradient-stops="outboundSmsUssdChart.gradientStops"
            :extra-options="outboundSmsUssdChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <div class="col-lg-3" :class="{ 'text-right': isRTL }">
      <card type="chart">
        <template slot="header">
          <h5 class="card-category">Total Outbound IVR</h5>
          <h3 class="card-title">
            <i class="tim-icons icon-volume-98 text-success"></i> 97,430
          </h3>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            :chart-data="outboundIvrChart.chartData"
            :gradient-colors="outboundIvrChart.gradientColors"
            :gradient-stops="outboundIvrChart.gradientStops"
            :extra-options="outboundIvrChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>

    <!-- ── Tasks + Recent Campaigns ── -->
    <div class="col-lg-5">
      <card type="tasks" :header-classes="{ 'text-right': isRTL }">
        <template slot="header" class="d-inline">
          <h6 class="title d-inline">Tasks (6)</h6>
          <p class="card-category d-inline">Today</p>
          <base-dropdown
            menu-on-right=""
            tag="div"
            title-classes="btn btn-link btn-icon"
            class="float-right"
          >
            <i slot="title" class="tim-icons icon-settings-gear-63"></i>
            <a class="dropdown-item" href="#pablo">View All</a>
            <a class="dropdown-item" href="#pablo">Mark All Done</a>
            <a class="dropdown-item" href="#pablo">Clear Completed</a>
          </base-dropdown>
        </template>
        <div class="table-full-width table-responsive">
          <task-list></task-list>
        </div>
      </card>
    </div>

    <div class="col-lg-7">
      <card card-body-classes="table-full-width">
        <h4 slot="header" class="card-title">Recent Campaigns</h4>
        <el-table :data="tableData">
          <el-table-column
            min-width="180"
            sortable
            label="Campaign Name"
            property="name"
          ></el-table-column>
          <el-table-column
            min-width="120"
            sortable
            label="Type"
            property="type"
          ></el-table-column>
          <el-table-column
            min-width="120"
            sortable
            label="Status"
            property="status"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            align="right"
            header-align="right"
            label="Subscribers Reached"
            property="reached"
          ></el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';
import * as chartConfigs from '@/components/Charts/config';
import TaskList from '@/components/Dashboard/TaskList';
import config from '@/config';
import { Table, TableColumn } from 'element-ui';

let bigChartData = [
  [45000, 62000, 58000, 71000, 83000, 76000, 91000, 88000, 104000, 97000, 115000, 122000],
  [12000, 18000, 15000, 22000, 19000, 25000, 21000, 28000, 24000, 30000, 27000, 34000],
  [3200,  4100,  3800,  5200,  4700,  6100,  5500,  6800,  6200,  7400,  7100,  8300]
];
let bigChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
let bigChartDatasetOptions = {
  fill: true,
  borderColor: config.colors.primary,
  borderWidth: 2,
  borderDash: [],
  borderDashOffset: 0.0,
  pointBackgroundColor: config.colors.primary,
  pointBorderColor: 'rgba(255,255,255,0)',
  pointHoverBackgroundColor: config.colors.primary,
  pointBorderWidth: 20,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 15,
  pointRadius: 4
};

export default {
  name: 'dashboard',
  components: {
    LineChart,
    BarChart,
    TaskList,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      tableData: [
        { id: 1, name: 'Premier League GW28 Alerts',       type: 'SMS', status: 'Completed', reached: '84,320'  },
        { id: 2, name: 'El Clásico Preview Voice Blast',   type: 'OBD', status: 'Failed',    reached: '12,540'  },
        { id: 3, name: 'Champions League Draw Alert',      type: 'SMS', status: 'Running',   reached: '210,780' },
        { id: 4, name: 'FA Cup QF Score Update',           type: 'SMS', status: 'Completed', reached: '63,450'  },
        { id: 5, name: 'Fantasy Football GW28 Reminder',   type: 'OBD', status: 'Completed', reached: '97,200'  }
      ],

      // ── Big chart ──
      bigLineChart: {
        activeIndex: 0,
        chartData: {
          datasets: [{ ...bigChartDatasetOptions, data: bigChartData[0] }],
          labels: bigChartLabels
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: []
      },

      // ── Original small charts ──
      purpleLineChart: {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [{
            label: 'SMS Sent',
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [91000, 88000, 104000, 97000, 115000, 122000]
          }]
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.2, 0]
      },

      greenLineChart: {
        extraOptions: chartConfigs.greenChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
          datasets: [{
            label: 'OBD Delivered',
            fill: true,
            borderColor: config.colors.danger,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.danger,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.danger,
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [21000, 28000, 24000, 30000, 27000]
          }]
        },
        gradientColors: ['rgba(66,134,121,0.15)', 'rgba(66,134,121,0.0)', 'rgba(66,134,121,0)'],
        gradientStops: [1, 0.4, 0]
      },

      blueBarChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: ['SMS', 'OBD', 'USSD', 'IVR', 'Inbound', 'Notif'],
          datasets: [{
            label: 'Active Subscribers by Service',
            fill: true,
            borderColor: config.colors.info,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            data: [48320, 12400, 8750, 3200, 15600, 6800]
          }]
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0]
      },

      // ── NEW: Inbound SMS & USSD ──
      inboundSmsUssdChart: {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [{
            label: 'Inbound SMS & USSD',
            fill: true,
            borderColor: '#ff8d72',
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: '#ff8d72',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ff8d72',
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [7200, 8800, 9400, 10100, 11800, 14840]
          }]
        },
        gradientColors: ['rgba(255,141,114,0.15)', 'rgba(255,141,114,0.05)', 'rgba(255,141,114,0)'],
        gradientStops: [1, 0.4, 0]
      },

      // ── NEW: Inbound IVR ──
      inboundIvrChart: {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [{
            label: 'Inbound IVR',
            fill: true,
            borderColor: config.colors.info,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.info,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.info,
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [1400, 1820, 2010, 2340, 2680, 2590]
          }]
        },
        gradientColors: ['rgba(29,140,248,0.15)', 'rgba(29,140,248,0.05)', 'rgba(29,140,248,0)'],
        gradientStops: [1, 0.4, 0]
      },

      // ── NEW: Outbound SMS & USSD ──
      outboundSmsUssdChart: {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [{
            label: 'Outbound SMS & USSD',
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [44000, 52000, 58000, 64500, 71200, 38660]
          }]
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0]
      },

      // ── NEW: Outbound IVR ──
      outboundIvrChart: {
        extraOptions: chartConfigs.greenChartOptions,
        chartData: {
          labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [{
            label: 'Outbound IVR',
            fill: true,
            borderColor: config.colors.success,
            borderWidth: 2,
            borderDash: [], borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.success,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.success,
            pointBorderWidth: 20, pointHoverRadius: 4, pointHoverBorderWidth: 15, pointRadius: 4,
            data: [12000, 15400, 18200, 21000, 24800, 6030]
          }]
        },
        gradientColors: ['rgba(24,206,15,0.15)', 'rgba(24,206,15,0.05)', 'rgba(24,206,15,0)'],
        gradientStops: [1, 0.4, 0]
      }
    };
  },
  computed: {
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    bigLineChartCategories() {
      return [
        { name: 'SMS Campaigns',  icon: 'tim-icons icon-send'        },
        { name: 'OBD Campaigns',  icon: 'tim-icons icon-headphones'  },
        { name: 'USSD Sessions',  icon: 'tim-icons icon-mobile'      }
      ];
    }
  },
  methods: {
    initBigChart(index) {
      let chartData = {
        datasets: [{ ...bigChartDatasetOptions, data: bigChartData[index] }],
        labels: bigChartLabels
      };
      this.$refs.bigChart.updateGradients(chartData);
      this.bigLineChart.chartData   = chartData;
      this.bigLineChart.activeIndex = index;
    }
  },
  mounted() {
    this.initBigChart(0);
  }
};
</script>

<style>
.el-table th {
  background-color: transparent !important;
}
.el-table thead tr {
  background-color: transparent !important;
}
.el-table th > .cell {
  color: #9a9a9a;
}
</style>