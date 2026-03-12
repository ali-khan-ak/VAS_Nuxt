<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">IVR Reporting</h2>
          <p class="text-muted mb-0">Campaign-wise call breakdown, inbound/outbound daily stats and call analytics</p>
        </div>
        <div class="d-flex align-items-center" style="gap: 10px;">
          <base-button type="default" size="sm" @click="exportReport">
            <i class="tim-icons icon-cloud-download-93 mr-1"></i> Export CSV
          </base-button>
          <base-button type="primary" size="sm" @click="refreshData">
            <i class="tim-icons icon-refresh-02 mr-1"></i> Refresh
          </base-button>
        </div>
      </div>
    </div>

    <!-- ══ STAT CARDS ══ -->
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #e14eca, #ba54f5);">
            <i class="tim-icons icon-headphones"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Outbound Calls Today</p>
            <h3 class="stat-value">97,430</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up text-success"></i>&nbsp;+8.3% vs yesterday
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
            <i class="tim-icons icon-chat-33"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Inbound Calls Today</p>
            <h3 class="stat-value">12,840</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up text-success"></i>&nbsp;+4.7% vs yesterday
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #00bf9a, #00f2c3);">
            <i class="tim-icons icon-check-2"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg Answer Rate</p>
            <h3 class="stat-value">67%</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-time-alarm"></i>&nbsp;Avg duration: 38s
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #fd5d93, #ec250d);">
            <i class="tim-icons icon-simple-remove"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Failed Calls Today</p>
            <h3 class="stat-value">218</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc text-warning"></i>&nbsp;1.8% fail rate
        </div>
      </card>
    </div>

    <!-- ══ GLOBAL FILTERS ══ -->
    <div class="col-12 mb-3">
      <card class="filter-card">
        <div class="row align-items-end">
          <div class="col-md-3 mb-3 mb-md-0">
            <label class="config-label">Search MSISDN or Campaign</label>
            <base-input
              v-model="globalSearch"
              placeholder="e.g. 254712... or Premier League"
              addon-left-icon="tim-icons icon-zoom-split"
            ></base-input>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <label class="config-label">Date From</label>
            <el-date-picker
              v-model="dateFrom"
              type="date"
              placeholder="Start date"
              class="w-100"
            ></el-date-picker>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <label class="config-label">Date To</label>
            <el-date-picker
              v-model="dateTo"
              type="date"
              placeholder="End date"
              class="w-100"
            ></el-date-picker>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <label class="config-label">Quick Range</label>
            <el-select v-model="quickRange" class="w-100" @change="applyQuickRange">
              <el-option label="Today"        value="today"></el-option>
              <el-option label="Yesterday"    value="yesterday"></el-option>
              <el-option label="Last 7 Days"  value="7d"></el-option>
              <el-option label="Last 30 Days" value="30d"></el-option>
              <el-option label="This Month"   value="month"></el-option>
              <el-option label="Custom"       value="custom"></el-option>
            </el-select>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3" style="gap: 8px;">
          <base-button type="default" size="sm" @click="clearFilters">Clear</base-button>
          <base-button type="primary" size="sm" @click="applyFilters">
            <i class="tim-icons icon-zoom-split mr-1"></i> Apply Filters
          </base-button>
        </div>
      </card>
    </div>

    <!-- ══ REPORT TABS ══ -->
    <div class="col-12 mb-3">
      <div class="report-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="report-tab-btn"
          :class="{ 'tab-active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="`tim-icons ${tab.icon} mr-2`"></i>
          {{ tab.label }}
          <span class="tab-count">{{ tab.count.toLocaleString() }}</span>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════
         TAB 1: OUTBOUND CALLS
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'ivr_outbound'">

      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="outboundFilters.status" placeholder="Filter by Status" class="w-100">
                <el-option label="All Statuses" value=""></el-option>
                <el-option label="Answered"     value="Answered"></el-option>
                <el-option label="No Answer"    value="No Answer"></el-option>
                <el-option label="Failed"       value="Failed"></el-option>
                <el-option label="Busy"         value="Busy"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="outboundFilters.campaign" placeholder="Filter by Campaign" class="w-100">
                <el-option label="All Campaigns" value=""></el-option>
                <el-option v-for="c in campaignList" :key="c" :label="c" :value="c"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="outboundFilters.promptType" placeholder="Prompt Type" class="w-100">
                <el-option label="All Types"    value=""></el-option>
                <el-option label="Pre-recorded" value="Pre-recorded"></el-option>
                
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <span class="filter-result-count">{{ filteredOutbound.length }} records</span>
            </div>
          </div>
        </card>
      </div>

      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header" class="d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">IVR Outbound — Campaign Breakdown</h4>
          </div>
          <el-table :data="filteredOutbound" style="width:100%">

            <el-table-column min-width="210" sortable label="Campaign" prop="campaign">
              <template slot-scope="{ row }">
                <span class="fw-bold">{{ row.campaign }}</span><br>
                <small class="text-muted">{{ row.promptType }}</small>
              </template>
            </el-table-column>

            <el-table-column min-width="160" sortable label="Subscriber Segment" prop="segment">
              <template slot-scope="{ row }">
                <span class="text-muted" style="font-size:0.82rem;">{{ row.segment }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge" :class="outStatusClass(row.status)">{{ row.status }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="110" sortable label="Total Calls" prop="totalCalls"></el-table-column>

            <el-table-column min-width="120" sortable label="Answered" prop="answered"></el-table-column>

            <el-table-column min-width="130" sortable label="Answer Rate" prop="answerRate">
              <template slot-scope="{ row }">
                <div class="rate-wrap">
                  <div class="rate-bar-track">
                    <div class="rate-bar-fill"
                      :style="{ width: row.answerRate + '%', background: row.answerRate >= 70 ? '#18ce0f' : row.answerRate >= 50 ? '#ff8d72' : '#fd5d93' }"
                    ></div>
                  </div>
                  <span :class="row.answerRate >= 70 ? 'text-success' : row.answerRate >= 50 ? 'text-warning' : 'text-danger'">
                    {{ row.answerRate }}%
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="110" sortable label="Failed" prop="failed"></el-table-column>

            <el-table-column min-width="130" sortable label="Avg Duration" prop="avgDuration">
              <template slot-scope="{ row }">{{ row.avgDuration }}s</template>
            </el-table-column>

            <el-table-column min-width="160" sortable label="Scheduled At" prop="scheduledAt"></el-table-column>

          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 2: INBOUND CALLS
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'ivr_inbound'">

      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="inboundFilters.status" placeholder="Filter by Status" class="w-100">
                <el-option label="All Statuses" value=""></el-option>
                <el-option label="Completed"    value="Completed"></el-option>
                <el-option label="Abandoned"    value="Abandoned"></el-option>
                <el-option label="Failed"       value="Failed"></el-option>
                <el-option label="Transferred"  value="Transferred"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="inboundFilters.flow" placeholder="Filter by IVR Flow" class="w-100">
                <el-option label="All Flows"       value=""></el-option>
                <el-option label="Main Menu"       value="Main Menu"></el-option>
                <el-option label="Subscriptions"   value="Subscriptions"></el-option>
                <el-option label="Live Scores"     value="Live Scores"></el-option>
                <el-option label="Support"         value="Support"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="inboundFilters.dtmf" placeholder="DTMF Input" class="w-100">
                <el-option label="Any Input"  value=""></el-option>
                <el-option label="Key 1"      value="1"></el-option>
                <el-option label="Key 2"      value="2"></el-option>
                <el-option label="Key 3"      value="3"></el-option>
                <el-option label="Key 0"      value="0"></el-option>
                <el-option label="No Input"   value="none"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <span class="filter-result-count">{{ filteredInbound.length }} records</span>
            </div>
          </div>
        </card>
      </div>

      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header">
            <h4 class="card-title mb-0">IVR Inbound Calls</h4>
          </div>
          <el-table :data="filteredInbound" style="width:100%">

            <el-table-column min-width="150" sortable label="MSISDN" prop="msisdn">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.msisdn }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Caller ID" prop="callerId">
              <template slot-scope="{ row }">
                <span class="code-tag code-blue">{{ row.callerId }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="150" sortable label="IVR Flow" prop="flow">
              <template slot-scope="{ row }">
                <span class="flow-tag" :class="flowClass(row.flow)">{{ row.flow }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="130" sortable label="Final Menu" prop="finalMenu"></el-table-column>

            <el-table-column min-width="100" sortable label="DTMF" prop="dtmfInput">
              <template slot-scope="{ row }">
                <span class="code-tag code-purple" v-if="row.dtmfInput !== 'none'">{{ row.dtmfInput }}</span>
                <span class="text-muted" style="font-size:0.78rem;" v-else>No input</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Duration" prop="duration">
              <template slot-scope="{ row }">{{ row.duration }}s</template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge" :class="inboundStatusClass(row.status)">{{ row.status }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="165" sortable label="Received At" prop="receivedAt"></el-table-column>

          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 3: CALL ANALYTICS
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'ivr_analytics'">

      <!-- Analytics sub-stat panels -->
      <div class="col-lg-4 col-sm-12 mb-3">
        <card class="accent-card accent-teal">
          <div class="ussd-stat-inner">
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-success">{{ callStats.answered.toLocaleString() }}</span>
              <span class="ussd-stat-label">Answered</span>
            </div>
            <div class="ussd-stat-divider"></div>
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-danger">{{ callStats.failed.toLocaleString() }}</span>
              <span class="ussd-stat-label">Failed</span>
            </div>
            <div class="ussd-stat-divider"></div>
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-warning">{{ callStats.noAnswer.toLocaleString() }}</span>
              <span class="ussd-stat-label">No Answer</span>
            </div>
          </div>
          <div class="ussd-rate-bar mt-3">
            <div class="ussd-bar-track">
              <div class="ussd-bar-success" :style="{ width: answeredRate + '%' }"></div>
              <div class="ussd-bar-failed"  :style="{ width: failedRate + '%' }"></div>
              <div class="ussd-bar-timeout" :style="{ width: noAnswerRate + '%' }"></div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small class="text-success">{{ answeredRate }}% answered</small>
              <small class="text-muted">{{ callTotal.toLocaleString() }} total</small>
              <small class="text-danger">{{ failedRate }}% failed</small>
            </div>
          </div>
        </card>
      </div>

      <div class="col-lg-8 col-sm-12 mb-3">
        <card class="accent-card accent-blue">
          <div class="row text-center">
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ callStats.avgDuration }}s</span>
                <span class="mini-stat-label">Avg Duration</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ callStats.dtmfRate }}%</span>
                <span class="mini-stat-label">DTMF Engaged</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ callStats.transferred.toLocaleString() }}</span>
                <span class="mini-stat-label">Transferred</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ callStats.retries.toLocaleString() }}</span>
                <span class="mini-stat-label">Retries</span>
              </div>
            </div>
          </div>
        </card>
      </div>

      <!-- Analytics sub-filters -->
      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="analyticsFilters.campaign" placeholder="Filter by Campaign" class="w-100">
                <el-option label="All Campaigns" value=""></el-option>
                <el-option v-for="c in campaignList" :key="c" :label="c" :value="c"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="analyticsFilters.disposition" placeholder="Call Disposition" class="w-100">
                <el-option label="All"         value=""></el-option>
                <el-option label="Answered"    value="Answered"></el-option>
                <el-option label="No Answer"   value="No Answer"></el-option>
                <el-option label="Busy"        value="Busy"></el-option>
                <el-option label="Failed"      value="Failed"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="analyticsFilters.retried" placeholder="Retry Status" class="w-100">
                <el-option label="All"     value=""></el-option>
                <el-option label="Retried" value="true"></el-option>
                <el-option label="No Retry" value="false"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <span class="filter-result-count">{{ filteredAnalytics.length }} records</span>
            </div>
          </div>
        </card>
      </div>

      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header">
            <h4 class="card-title mb-0">Per-Call Analytics Detail</h4>
          </div>
          <el-table :data="filteredAnalytics" style="width:100%">

            <el-table-column min-width="150" sortable label="MSISDN" prop="msisdn">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.msisdn }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="200" sortable label="Campaign" prop="campaign">
              <template slot-scope="{ row }">
                <span class="fw-bold" style="font-size:0.85rem;">{{ row.campaign }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Disposition" prop="disposition">
              <template slot-scope="{ row }">
                <span class="status-badge" :class="outStatusClass(row.disposition)">{{ row.disposition }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Duration" prop="duration">
              <template slot-scope="{ row }">{{ row.duration }}s</template>
            </el-table-column>

            <el-table-column min-width="110" sortable label="DTMF Keys" prop="dtmfKeys">
              <template slot-scope="{ row }">
                <template v-if="row.dtmfKeys.length">
                  <span
                    v-for="k in row.dtmfKeys"
                    :key="k"
                    class="code-tag code-purple"
                    style="margin-right:3px;"
                  >{{ k }}</span>
                </template>
                <span v-else class="text-muted" style="font-size:0.78rem;">—</span>
              </template>
            </el-table-column>

            <el-table-column min-width="100" sortable label="Retried" prop="retried">
              <template slot-scope="{ row }">
                <span :class="row.retried ? 'text-warning' : 'text-muted'" style="font-size:0.8rem;">
                  {{ row.retried ? 'Yes' : 'No' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Disconnect" prop="disconnectCause"></el-table-column>

            <el-table-column min-width="165" sortable label="Call Time" prop="callTime"></el-table-column>

          </el-table>
        </card>
      </div>
    </template>

  </div>
</template>

<script>
import { Select, Option, DatePicker } from 'element-ui';
import { Table, TableColumn } from 'element-ui';

export default {
  name: 'IvrReporting',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      activeTab: 'ivr_outbound',
      globalSearch: '',
      dateFrom: null,
      dateTo: null,
      quickRange: 'today',

      tabs: [
        { key: 'ivr_outbound',  label: 'Outbound Calls',  icon: 'icon-headphones', count: 97430 },
        { key: 'ivr_inbound',   label: 'Inbound Calls',   icon: 'icon-chat-33',    count: 12840 },
        { key: 'ivr_analytics', label: 'Call Analytics',  icon: 'icon-chart-bar-32', count: 110270 },
      ],

      outboundFilters:  { status: '', campaign: '', promptType: '' },
      inboundFilters:   { status: '', flow: '', dtmf: '' },
      analyticsFilters: { campaign: '', disposition: '', retried: '' },

      campaignList: [
        'Premier League GW28 OBD',
        'UCL Pre-Match Alert',
        'FA Cup Score Blast',
        'Fantasy Football Reminder',
        'Serie A Weekend OBD',
        'La Liga Results Call',
        'Subscription Renewal Reminder'
      ],

      callStats: {
        answered:    65278,
        failed:      218,
        noAnswer:    31934,
        avgDuration: 38,
        dtmfRate:    74,
        transferred: 1420,
        retries:     8840
      },

      outboundData: [
        { id:1,  campaign:'Premier League GW28 OBD',       promptType:'Pre-recorded', segment:'120,000 subscribers', status:'Answered',  totalCalls:'119,420', answered:'80,012', failed:'320',   answerRate:67, avgDuration:42, scheduledAt:'2025-03-01 08:00' },
        { id:2,  campaign:'UCL Pre-Match Alert',           promptType:'Pre-recorded',          segment:'250,000 subscribers', status:'No Answer', totalCalls:'210,780', answered:'84,312', failed:'1,840', answerRate:40, avgDuration:28, scheduledAt:'2025-03-05 10:30' },
        { id:3,  campaign:'FA Cup Score Blast',            promptType:'Pre-recorded', segment:'65,000 subscribers',  status:'Answered',  totalCalls:'63,450',  answered:'44,415', failed:'640',   answerRate:70, avgDuration:35, scheduledAt:'2025-02-28 18:00' },
        { id:4,  campaign:'Fantasy Football Reminder',     promptType:'Pre-recorded',          segment:'98,000 subscribers',  status:'Busy',      totalCalls:'0',       answered:'0',      failed:'0',     answerRate:0,  avgDuration:0,  scheduledAt:'2025-03-10 09:00' },
        { id:5,  campaign:'Serie A Weekend OBD',           promptType:'Pre-recorded', segment:'45,000 subscribers',  status:'Failed',    totalCalls:'12,100',  answered:'3,146',  failed:'8,954', answerRate:26, avgDuration:18, scheduledAt:'2025-03-04 07:00' },
        { id:6,  campaign:'La Liga Results Call',          promptType:'Pre-recorded',          segment:'80,000 subscribers',  status:'Answered',  totalCalls:'78,500',  answered:'54,950', failed:'780',   answerRate:70, avgDuration:44, scheduledAt:'2025-03-06 11:00' },
        { id:7,  campaign:'Subscription Renewal Reminder', promptType:'Pre-recorded', segment:'75,000 subscribers',  status:'Answered',  totalCalls:'74,100',  answered:'54,093', failed:'370',   answerRate:73, avgDuration:36, scheduledAt:'2025-02-25 20:00' },
      ],

      inboundData: [
        { id:1,  msisdn:'254712345678', callerId:'+254711000001', flow:'Main Menu',     finalMenu:'Live Scores',   dtmfInput:'1',    duration:54,  status:'Completed',   receivedAt:'2025-03-07 09:10:01' },
        { id:2,  msisdn:'254798001122', callerId:'+254711000001', flow:'Subscriptions', finalMenu:'Confirm SUB',   dtmfInput:'2',    duration:28,  status:'Completed',   receivedAt:'2025-03-07 09:11:44' },
        { id:3,  msisdn:'254700987654', callerId:'+254711000001', flow:'Live Scores',   finalMenu:'PL Scores',     dtmfInput:'1',    duration:62,  status:'Completed',   receivedAt:'2025-03-07 09:12:30' },
        { id:4,  msisdn:'254733445566', callerId:'+254711000001', flow:'Main Menu',     finalMenu:'Timeout',       dtmfInput:'none', duration:30,  status:'Abandoned',   receivedAt:'2025-03-07 09:13:05' },
        { id:5,  msisdn:'254711223344', callerId:'+254711000001', flow:'Support',       finalMenu:'Transfer',      dtmfInput:'0',    duration:120, status:'Transferred', receivedAt:'2025-03-07 09:14:22' },
        { id:6,  msisdn:'254799887766', callerId:'+254711000001', flow:'Subscriptions', finalMenu:'Error',         dtmfInput:'9',    duration:8,   status:'Failed',      receivedAt:'2025-03-07 09:15:11' },
        { id:7,  msisdn:'254722334455', callerId:'+254711000001', flow:'Main Menu',     finalMenu:'Fantasy Stats', dtmfInput:'3',    duration:48,  status:'Completed',   receivedAt:'2025-03-07 09:16:40' },
        { id:8,  msisdn:'254766554433', callerId:'+254711000001', flow:'Live Scores',   finalMenu:'UCL Results',   dtmfInput:'2',    duration:38,  status:'Completed',   receivedAt:'2025-03-07 09:17:55' },
        { id:9,  msisdn:'254755443322', callerId:'+254711000001', flow:'Subscriptions', finalMenu:'Confirm UNSUB', dtmfInput:'2',    duration:22,  status:'Completed',   receivedAt:'2025-03-07 09:18:20' },
        { id:10, msisdn:'254744332211', callerId:'+254711000001', flow:'Main Menu',     finalMenu:'La Liga Stats',  dtmfInput:'4',   duration:45,  status:'Completed',   receivedAt:'2025-03-07 09:19:03' },
      ],

      analyticsData: [
        { id:1,  msisdn:'254712345678', campaign:'Premier League GW28 OBD',       disposition:'Answered',  duration:42, dtmfKeys:['1','3'],  retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:10:01' },
        { id:2,  msisdn:'254798001122', campaign:'UCL Pre-Match Alert',           disposition:'No Answer', duration:30, dtmfKeys:[],         retried:true,  disconnectCause:'No Answer (19)',    callTime:'2025-03-07 09:11:22' },
        { id:3,  msisdn:'254700987654', campaign:'FA Cup Score Blast',            disposition:'Answered',  duration:35, dtmfKeys:['2'],      retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:12:05' },
        { id:4,  msisdn:'254733445566', campaign:'Subscription Renewal Reminder', disposition:'Busy',      duration:0,  dtmfKeys:[],         retried:true,  disconnectCause:'User Busy (17)',    callTime:'2025-03-07 09:13:44' },
        { id:5,  msisdn:'254711223344', campaign:'La Liga Results Call',          disposition:'Answered',  duration:44, dtmfKeys:['1','1'],  retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:14:30' },
        { id:6,  msisdn:'254799887766', campaign:'Serie A Weekend OBD',           disposition:'Failed',    duration:0,  dtmfKeys:[],         retried:true,  disconnectCause:'Network (38)',     callTime:'2025-03-07 09:15:01' },
        { id:7,  msisdn:'254722334455', campaign:'Premier League GW28 OBD',       disposition:'Answered',  duration:38, dtmfKeys:['3'],      retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:16:55' },
        { id:8,  msisdn:'254766554433', campaign:'Fantasy Football Reminder',     disposition:'No Answer', duration:30, dtmfKeys:[],         retried:true,  disconnectCause:'No Answer (19)',    callTime:'2025-03-07 09:17:10' },
        { id:9,  msisdn:'254755443322', campaign:'UCL Pre-Match Alert',           disposition:'Answered',  duration:28, dtmfKeys:['2','0'],  retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:18:44' },
        { id:10, msisdn:'254744332211', campaign:'La Liga Results Call',          disposition:'Answered',  duration:46, dtmfKeys:['4'],      retried:false, disconnectCause:'Normal (16)',      callTime:'2025-03-07 09:19:20' },
      ]
    };
  },
  computed: {
    filteredOutbound() {
      return this.outboundData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch    = !s || r.campaign.toLowerCase().includes(s) || r.segment.toLowerCase().includes(s);
        const matchStatus    = !this.outboundFilters.status     || r.status     === this.outboundFilters.status;
        const matchCampaign  = !this.outboundFilters.campaign   || r.campaign   === this.outboundFilters.campaign;
        const matchPrompt    = !this.outboundFilters.promptType || r.promptType === this.outboundFilters.promptType;
        return matchSearch && matchStatus && matchCampaign && matchPrompt;
      });
    },
    filteredInbound() {
      return this.inboundData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch = !s || r.msisdn.toLowerCase().includes(s) || r.flow.toLowerCase().includes(s) || r.finalMenu.toLowerCase().includes(s);
        const matchStatus = !this.inboundFilters.status || r.status === this.inboundFilters.status;
        const matchFlow   = !this.inboundFilters.flow   || r.flow   === this.inboundFilters.flow;
        const matchDtmf   = !this.inboundFilters.dtmf   || r.dtmfInput === this.inboundFilters.dtmf;
        return matchSearch && matchStatus && matchFlow && matchDtmf;
      });
    },
    filteredAnalytics() {
      return this.analyticsData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch      = !s || r.msisdn.toLowerCase().includes(s) || r.campaign.toLowerCase().includes(s);
        const matchCampaign    = !this.analyticsFilters.campaign    || r.campaign    === this.analyticsFilters.campaign;
        const matchDisposition = !this.analyticsFilters.disposition || r.disposition === this.analyticsFilters.disposition;
        const matchRetried     = !this.analyticsFilters.retried     || String(r.retried) === this.analyticsFilters.retried;
        return matchSearch && matchCampaign && matchDisposition && matchRetried;
      });
    },
    callTotal()    { return this.callStats.answered + this.callStats.failed + this.callStats.noAnswer; },
    answeredRate() { return this.callTotal ? ((this.callStats.answered / this.callTotal) * 100).toFixed(1) : 0; },
    failedRate()   { return this.callTotal ? ((this.callStats.failed   / this.callTotal) * 100).toFixed(1) : 0; },
    noAnswerRate() { return this.callTotal ? ((this.callStats.noAnswer / this.callTotal) * 100).toFixed(1) : 0; },
  },
  methods: {
    outStatusClass(status) {
      return {
        'badge-success': status === 'Answered',
        'badge-info':    status === 'No Answer',
        'badge-danger':  status === 'Failed',
        'badge-warn':    status === 'Busy'
      };
    },
    inboundStatusClass(status) {
      return {
        'badge-success': status === 'Completed',
        'badge-purple':  status === 'Transferred',
        'badge-danger':  status === 'Failed',
        'badge-warn':    status === 'Abandoned'
      };
    },
    flowClass(flow) {
      const map = {
        'Main Menu': 'flow-main', 'Subscriptions': 'flow-sub',
        'Live Scores': 'flow-live', 'Support': 'flow-support'
      };
      return map[flow] || 'flow-main';
    },
    applyQuickRange(val) {
      const now   = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (val === 'today')     { this.dateFrom = today; this.dateTo = now; }
      if (val === 'yesterday') { const y = new Date(today); y.setDate(y.getDate()-1); this.dateFrom = y; this.dateTo = today; }
      if (val === '7d')        { const d = new Date(today); d.setDate(d.getDate()-7); this.dateFrom = d; this.dateTo = now; }
      if (val === '30d')       { const d = new Date(today); d.setDate(d.getDate()-30); this.dateFrom = d; this.dateTo = now; }
      if (val === 'month')     { this.dateFrom = new Date(now.getFullYear(), now.getMonth(), 1); this.dateTo = now; }
    },
    applyFilters() {
      this.$notify({ type: 'info', message: 'Filters applied.' });
    },
    clearFilters() {
      this.globalSearch = '';
      this.dateFrom = null;
      this.dateTo = null;
      this.quickRange = 'today';
      this.outboundFilters  = { status: '', campaign: '', promptType: '' };
      this.inboundFilters   = { status: '', flow: '', dtmf: '' };
      this.analyticsFilters = { campaign: '', disposition: '', retried: '' };
    },
    exportReport() { this.$notify({ type: 'success', message: 'IVR report exported as CSV.' }); },
    refreshData()  { this.$notify({ type: 'info',    message: 'Report data refreshed.' }); }
  }
};
</script>

<style scoped>
.page-title { font-size: 1.75rem; font-weight: 600; color: #ffffff; }

/* ── Stat Cards ── */
.stat-card .card-body { padding: 20px 20px 10px !important; }
.stat-card-body { display: flex; align-items: center; gap: 16px; }
.stat-icon-circle {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon-circle i { font-size: 1.2rem; color: #fff; }
.stat-content { flex: 1; }
.stat-label { font-size: 0.75rem; color: #9a9a9a; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0; line-height: 1.2; }
.stat-footer { font-size: 0.78rem; color: #9a9a9a; padding-top: 8px; }

/* ── Filters ── */
.filter-card { border-left: 3px solid #1d8cf8; }
.sub-filter-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 14px 18px; }
.config-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #9a9a9a; margin-bottom: 5px; display: block; }
.filter-result-count { font-size: 0.82rem; color: #9a9a9a; font-weight: 600; }

/* ── Tabs ── */
.report-tabs { display: flex; gap: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; }
.report-tab-btn {
  background: transparent; border: 1px solid transparent; border-bottom: none;
  border-radius: 8px 8px 0 0; color: #9a9a9a; font-size: 0.82rem; font-weight: 600;
  padding: 10px 20px; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.report-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }
.tab-active { background: rgba(29,140,248,0.1) !important; border-color: rgba(255,255,255,0.1) !important; color: #1d8cf8 !important; }
.tab-count { background: rgba(255,255,255,0.08); color: #9a9a9a; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; }
.tab-active .tab-count { background: rgba(29,140,248,0.2); color: #1d8cf8; }

/* ── Table ── */
.mono-text  { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #ccc; }
.fw-bold    { font-weight: 700; color: #fff; }
.code-tag   { padding: 3px 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.78rem; font-weight: 600; }
.code-blue  { background: rgba(29,140,248,0.12); color: #1d8cf8; border: 1px solid rgba(29,140,248,0.25); }
.code-purple { background: rgba(225,78,202,0.12); color: #e14eca; border: 1px solid rgba(225,78,202,0.25); }

/* ── Status Badges ── */
.status-badge { padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.badge-success { background: rgba(24,206,15,0.12);  color: #18ce0f; border: 1px solid rgba(24,206,15,0.25); }
.badge-info    { background: rgba(29,140,248,0.12);  color: #1d8cf8; border: 1px solid rgba(29,140,248,0.25); }
.badge-danger  { background: rgba(253,93,147,0.12);  color: #fd5d93; border: 1px solid rgba(253,93,147,0.25); }
.badge-warn    { background: rgba(255,141,114,0.12); color: #ff8d72; border: 1px solid rgba(255,141,114,0.25); }
.badge-purple  { background: rgba(225,78,202,0.12);  color: #e14eca; border: 1px solid rgba(225,78,202,0.25); }

/* ── Rate Bar ── */
.rate-wrap { display: flex; align-items: center; gap: 8px; }
.rate-bar-track { width: 60px; height: 5px; border-radius: 4px; background: rgba(255,255,255,0.08); overflow: hidden; flex-shrink: 0; }
.rate-bar-fill  { height: 100%; border-radius: 4px; transition: width 0.4s; }

/* ── Flow Tags ── */
.flow-tag { padding: 3px 9px; border-radius: 5px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.flow-main    { background: rgba(29,140,248,0.1);  color: #1d8cf8; border: 1px solid rgba(29,140,248,0.2); }
.flow-sub     { background: rgba(0,242,195,0.1);   color: #00f2c3; border: 1px solid rgba(0,242,195,0.2); }
.flow-live    { background: rgba(225,78,202,0.1);  color: #e14eca; border: 1px solid rgba(225,78,202,0.2); }
.flow-support { background: rgba(255,141,114,0.1); color: #ff8d72; border: 1px solid rgba(255,141,114,0.2); }

/* ── Analytics Stat Panel ── */
.accent-card { border-radius: 10px; }
.accent-blue { border-left: 3px solid #1d8cf8; }
.accent-teal { border-left: 3px solid #00f2c3; }
.ussd-stat-inner { display: flex; align-items: center; justify-content: space-around; gap: 8px; }
.ussd-stat-block { text-align: center; }
.ussd-stat-num   { display: block; font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.ussd-stat-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #9a9a9a; margin-top: 2px; }
.ussd-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }
.ussd-rate-bar .ussd-bar-track { height: 8px; border-radius: 6px; overflow: hidden; display: flex; background: rgba(255,255,255,0.05); }
.ussd-bar-success { background: #18ce0f; transition: width 0.6s; }
.ussd-bar-failed  { background: #fd5d93; transition: width 0.6s; }
.ussd-bar-timeout { background: #ff8d72; transition: width 0.6s; }
.mini-stat { padding: 12px 6px; }
.mini-stat-val   { display: block; font-size: 1.4rem; font-weight: 700; color: #fff; }
.mini-stat-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.4px; color: #9a9a9a; margin-top: 3px; }

/* ── El-Select / DatePicker dark ── */
.el-select .el-input__inner { background-color: #1e1e2f !important; border-color: rgba(255,255,255,0.12) !important; color: #fff !important; border-radius: 6px; }
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }
.el-date-editor.el-input { width: 100% !important; }
.el-date-editor .el-input__inner { background-color: #1e1e2f !important; border-color: rgba(255,255,255,0.12) !important; color: #fff !important; border-radius: 6px; }
.el-table th > .cell { white-space: nowrap; }
</style>