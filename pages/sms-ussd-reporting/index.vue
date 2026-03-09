<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">SMS & USSD Reporting</h2>
          <p class="text-muted mb-0">Campaign-wise breakdown, inbound/outbound stats and session analytics</p>
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
            <i class="tim-icons icon-send"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">SMS Outbound Today</p>
            <h3 class="stat-value">284,540</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up text-success"></i>&nbsp;+12.4% vs yesterday
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
            <p class="stat-label">SMS Inbound Today</p>
            <h3 class="stat-value">18,320</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up text-success"></i>&nbsp;+5.1% vs yesterday
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #00bf9a, #00f2c3);">
            <i class="tim-icons icon-mobile"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">USSD Sessions Today</p>
            <h3 class="stat-value">43,810</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-check-2 text-success"></i>&nbsp;96.2% success rate
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
            <p class="stat-label">Failed Sessions Today</p>
            <h3 class="stat-value">1,660</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc text-warning"></i>&nbsp;3.8% fail rate
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
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════
         TAB 1: SMS OUTBOUND
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'sms_outbound'">

      <!-- Sub-filters -->
      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="outboundFilters.status" placeholder="Filter by Status" class="w-100">
                <el-option label="All Statuses"  value=""></el-option>
                <el-option label="Delivered"     value="Delivered"></el-option>
                <el-option label="Sent"          value="Sent"></el-option>
                <el-option label="Failed"        value="Failed"></el-option>
                <el-option label="Pending"       value="Pending"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="outboundFilters.campaign" placeholder="Filter by Campaign" class="w-100">
                <el-option label="All Campaigns" value=""></el-option>
                <el-option v-for="c in campaignList" :key="c" :label="c" :value="c"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="outboundFilters.type" placeholder="Filter by Type" class="w-100">
                <el-option label="All Types"      value=""></el-option>
                <el-option label="Broadcast"      value="Broadcast"></el-option>
                <el-option label="Attribute-Based" value="Attribute-Based"></el-option>
                <el-option label="Scheduled"      value="Scheduled"></el-option>
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
            <h4 class="card-title mb-0">SMS Outbound — Campaign Breakdown</h4>
          </div>
          <el-table :data="filteredOutbound" style="width:100%">
            <el-table-column min-width="200" sortable label="Campaign Name" prop="campaign">
              <template slot-scope="{ row }">
                <span class="fw-bold">{{ row.campaign }}</span><br>
                <small class="text-muted">{{ row.type }}</small>
              </template>
            </el-table-column>
            <el-table-column min-width="150" sortable label="MSISDN / Segment" prop="msisdn">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.msisdn }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge" :class="outStatusClass(row.status)">{{ row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120" sortable label="Sent" prop="sent"></el-table-column>
            <el-table-column min-width="130" sortable label="Delivered" prop="delivered"></el-table-column>
            <el-table-column min-width="110" sortable label="Delivery %" prop="deliveryRate">
              <template slot-scope="{ row }">
                <div class="rate-wrap">
                  <div class="rate-bar-track">
                    <div class="rate-bar-fill"
                      :style="{ width: row.deliveryRate + '%', background: row.deliveryRate >= 90 ? '#18ce0f' : row.deliveryRate >= 70 ? '#ff8d72' : '#fd5d93' }"
                    ></div>
                  </div>
                  <span :class="row.deliveryRate >= 90 ? 'text-success' : row.deliveryRate >= 70 ? 'text-warning' : 'text-danger'">
                    {{ row.deliveryRate }}%
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="110" sortable label="Failed" prop="failed"></el-table-column>
            <el-table-column min-width="160" sortable label="Date" prop="date"></el-table-column>
          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 2: SMS INBOUND
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'sms_inbound'">

      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="inboundFilters.shortcode" placeholder="Filter by Shortcode" class="w-100">
                <el-option label="All Shortcodes" value=""></el-option>
                <el-option label="20124" value="20124"></el-option>
                <el-option label="20200" value="20200"></el-option>
                <el-option label="21000" value="21000"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="inboundFilters.keyword" placeholder="Filter by Keyword" class="w-100">
                <el-option label="All Keywords" value=""></el-option>
                <el-option label="SCORE"   value="SCORE"></el-option>
                <el-option label="SUB"     value="SUB"></el-option>
                <el-option label="UNSUB"   value="UNSUB"></el-option>
                <el-option label="HELP"    value="HELP"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="inboundFilters.routed" placeholder="Routing Status" class="w-100">
                <el-option label="All"       value=""></el-option>
                <el-option label="Routed"    value="Routed"></el-option>
                <el-option label="Unmatched" value="Unmatched"></el-option>
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
          <div slot="header" class="d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">SMS Inbound Messages</h4>
          </div>
          <el-table :data="filteredInbound" style="width:100%">
            <el-table-column min-width="150" sortable label="MSISDN" prop="msisdn">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.msisdn }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" sortable label="Shortcode" prop="shortcode">
              <template slot-scope="{ row }">
                <span class="code-tag code-blue">{{ row.shortcode }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" sortable label="Keyword" prop="keyword">
              <template slot-scope="{ row }">
                <span class="code-tag code-purple">{{ row.keyword }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" label="Message" prop="message">
              <template slot-scope="{ row }">
                <span class="msg-preview">{{ row.message }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120" sortable label="Routed To" prop="routedTo"></el-table-column>
            <el-table-column min-width="110" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge" :class="row.status === 'Routed' ? 'badge-success' : 'badge-warn'">{{ row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="160" sortable label="Received At" prop="receivedAt"></el-table-column>
          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 3: USSD SESSIONS
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'ussd_sessions'">

      <!-- USSD Sub-Stats -->
      <div class="col-lg-4 col-sm-12 mb-3">
        <card class="ussd-stat-card accent-teal">
          <div class="ussd-stat-inner">
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-success">{{ ussdStats.successful.toLocaleString() }}</span>
              <span class="ussd-stat-label">Successful</span>
            </div>
            <div class="ussd-stat-divider"></div>
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-danger">{{ ussdStats.failed.toLocaleString() }}</span>
              <span class="ussd-stat-label">Failed</span>
            </div>
            <div class="ussd-stat-divider"></div>
            <div class="ussd-stat-block">
              <span class="ussd-stat-num text-warning">{{ ussdStats.timeout.toLocaleString() }}</span>
              <span class="ussd-stat-label">Timed Out</span>
            </div>
          </div>
          <div class="ussd-rate-bar mt-3">
            <div class="ussd-bar-track">
              <div class="ussd-bar-success" :style="{ width: ussdSuccessRate + '%' }"></div>
              <div class="ussd-bar-failed"  :style="{ width: ussdFailRate + '%' }"></div>
              <div class="ussd-bar-timeout" :style="{ width: ussdTimeoutRate + '%' }"></div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small class="text-success">{{ ussdSuccessRate }}% success</small>
              <small class="text-muted">{{ (ussdStats.successful + ussdStats.failed + ussdStats.timeout).toLocaleString() }} total</small>
              <small class="text-danger">{{ ussdFailRate }}% failed</small>
            </div>
          </div>
        </card>
      </div>

      <div class="col-lg-8 col-sm-12 mb-3">
        <card class="accent-card accent-blue">
          <div class="row text-center">
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ ussdStats.avgDuration }}s</span>
                <span class="mini-stat-label">Avg Duration</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ ussdStats.subFlow.toLocaleString() }}</span>
                <span class="mini-stat-label">SUB Sessions</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ ussdStats.unsubFlow.toLocaleString() }}</span>
                <span class="mini-stat-label">UNSUB Sessions</span>
              </div>
            </div>
            <div class="col-3">
              <div class="mini-stat">
                <span class="mini-stat-val">{{ ussdStats.directFlow.toLocaleString() }}</span>
                <span class="mini-stat-label">Direct Landing</span>
              </div>
            </div>
          </div>
        </card>
      </div>

      <!-- USSD Sub-filters -->
      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3">
              <el-select v-model="ussdFilters.status" placeholder="Filter by Status" class="w-100">
                <el-option label="All Statuses"  value=""></el-option>
                <el-option label="Successful"    value="Successful"></el-option>
                <el-option label="Failed"        value="Failed"></el-option>
                <el-option label="Timeout"       value="Timeout"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="ussdFilters.flow" placeholder="Filter by Flow" class="w-100">
                <el-option label="All Flows"    value=""></el-option>
                <el-option label="SUB"          value="SUB"></el-option>
                <el-option label="UNSUB"        value="UNSUB"></el-option>
                <el-option label="Direct"       value="Direct"></el-option>
              </el-select>
            </div>
            <div class="col-md-3">
              <el-select v-model="ussdFilters.shortcode" placeholder="Filter by Shortcode" class="w-100">
                <el-option label="All Shortcodes" value=""></el-option>
                <el-option label="*384#"   value="*384#"></el-option>
                <el-option label="*384*1#" value="*384*1#"></el-option>
                <el-option label="*384*0#" value="*384*0#"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <span class="filter-result-count">{{ filteredUssd.length }} records</span>
            </div>
          </div>
        </card>
      </div>

      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header" class="d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">USSD Session Report</h4>
          </div>
          <el-table :data="filteredUssd" style="width:100%">
            <el-table-column min-width="150" sortable label="MSISDN" prop="msisdn">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.msisdn }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120" sortable label="Shortcode" prop="shortcode">
              <template slot-scope="{ row }">
                <span class="code-tag code-blue">{{ row.shortcode }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100" sortable label="Flow" prop="flow">
              <template slot-scope="{ row }">
                <span class="flow-tag" :class="row.flow === 'SUB' ? 'flow-sub' : row.flow === 'UNSUB' ? 'flow-unsub' : 'flow-direct'">{{ row.flow }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" sortable label="Final Menu" prop="finalMenu"></el-table-column>
            <el-table-column min-width="120" sortable label="Duration" prop="duration">
              <template slot-scope="{ row }">{{ row.duration }}s</template>
            </el-table-column>
            <el-table-column min-width="110" sortable label="Steps" prop="steps"></el-table-column>
            <el-table-column min-width="120" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge"
                  :class="row.status === 'Successful' ? 'badge-success' : row.status === 'Failed' ? 'badge-danger' : 'badge-warn'">
                  {{ row.status }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="160" sortable label="Started At" prop="startedAt"></el-table-column>
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
  name: 'SmsUssdReporting',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      activeTab: 'sms_outbound',
      globalSearch: '',
      dateFrom: null,
      dateTo: null,
      quickRange: 'today',

      tabs: [
        { key: 'sms_outbound',  label: 'SMS Outbound',    icon: 'icon-send',       count: 284540 },
        { key: 'sms_inbound',   label: 'SMS Inbound',     icon: 'icon-chat-33',    count: 18320  },
        { key: 'ussd_sessions', label: 'USSD Sessions',   icon: 'icon-mobile',     count: 43810  },
      ],

      outboundFilters: { status: '', campaign: '', type: '' },
      inboundFilters:  { shortcode: '', keyword: '', routed: '' },
      ussdFilters:     { status: '', flow: '', shortcode: '' },

      campaignList: [
        'Premier League GW28 Alerts',
        'Champions League Draw Alert',
        'FA Cup QF Score Update',
        'Fantasy Football Reminder',
        'Serie A Weekend Preview',
        'UCL Matchday 6 Promo',
        'La Liga GW26 Results'
      ],

      ussdStats: {
        successful: 42170,
        failed: 980,
        timeout: 660,
        avgDuration: 28,
        subFlow: 14820,
        unsubFlow: 3240,
        directFlow: 25750
      },

      outboundData: [
        { id:1,  campaign:'Premier League GW28 Alerts',   type:'Broadcast',       msisdn:'120,000 subscribers', status:'Delivered',  sent:'119,420', delivered:'118,820', failed:'600',   deliveryRate:99, date:'2025-03-01 08:00' },
        { id:2,  campaign:'Champions League Draw Alert',  type:'Broadcast',       msisdn:'250,000 subscribers', status:'Sent',       sent:'210,780', delivered:'177,055', failed:'33,725', deliveryRate:84, date:'2025-03-05 10:30' },
        { id:3,  campaign:'FA Cup QF Score Update',       type:'Attribute-Based', msisdn:'65,000 subscribers',  status:'Delivered',  sent:'63,450',  delivered:'61,547', failed:'1,903',  deliveryRate:97, date:'2025-02-28 18:00' },
        { id:4,  campaign:'Fantasy Football Reminder',    type:'Scheduled',       msisdn:'98,000 subscribers',  status:'Pending',    sent:'0',       delivered:'0',      failed:'0',      deliveryRate:0,  date:'2025-03-10 09:00' },
        { id:5,  campaign:'Serie A Weekend Preview',      type:'Broadcast',       msisdn:'45,000 subscribers',  status:'Failed',     sent:'12,100',  delivered:'3,146',  failed:'8,954',  deliveryRate:26, date:'2025-03-04 07:00' },
        { id:6,  campaign:'UCL Matchday 6 Promo',         type:'Attribute-Based', msisdn:'180,000 subscribers', status:'Sent',       sent:'88,500',  delivered:'81,420', failed:'7,080',  deliveryRate:92, date:'2025-03-06 11:00' },
        { id:7,  campaign:'La Liga GW26 Results',         type:'Broadcast',       msisdn:'75,000 subscribers',  status:'Delivered',  sent:'74,100',  delivered:'72,618', failed:'1,482',  deliveryRate:98, date:'2025-02-25 20:00' },
      ],

      inboundData: [
        { id:1,  msisdn:'254712345678', shortcode:'20124', keyword:'SCORE',  message:'SCORE PL',                 routedTo:'Sports Alerts',    status:'Routed',    receivedAt:'2025-03-07 09:14:22' },
        { id:2,  msisdn:'254798001122', shortcode:'20200', keyword:'SUB',    message:'SUB SPORTS',               routedTo:'Subscription Mgr', status:'Routed',    receivedAt:'2025-03-07 09:15:01' },
        { id:3,  msisdn:'254700987654', shortcode:'20200', keyword:'UNSUB',  message:'UNSUB',                    routedTo:'Subscription Mgr', status:'Routed',    receivedAt:'2025-03-07 09:16:44' },
        { id:4,  msisdn:'254733445566', shortcode:'21000', keyword:'HELP',   message:'HELP',                     routedTo:'Default Handler',  status:'Routed',    receivedAt:'2025-03-07 09:17:10' },
        { id:5,  msisdn:'254711223344', shortcode:'20124', keyword:'LIVE',   message:'LIVE UCL',                 routedTo:'Live Updates',     status:'Routed',    receivedAt:'2025-03-07 09:18:33' },
        { id:6,  msisdn:'254799887766', shortcode:'20124', keyword:'XYZ',    message:'XYZ SOMETHING',            routedTo:'—',                status:'Unmatched', receivedAt:'2025-03-07 09:19:05' },
        { id:7,  msisdn:'254722334455', shortcode:'20200', keyword:'SUB',    message:'SUB FANTASY',              routedTo:'Fantasy Football', status:'Routed',    receivedAt:'2025-03-07 09:20:18' },
        { id:8,  msisdn:'254766554433', shortcode:'21000', keyword:'SCORE',  message:'SCORE SERIE A',            routedTo:'Sports Alerts',    status:'Routed',    receivedAt:'2025-03-07 09:21:44' },
        { id:9,  msisdn:'254755443322', shortcode:'20124', keyword:'LIVE',   message:'LIVE PL GW28',             routedTo:'Live Updates',     status:'Routed',    receivedAt:'2025-03-07 09:22:09' },
        { id:10, msisdn:'254744332211', shortcode:'20200', keyword:'UNSUB',  message:'UNSUB FANTASY',            routedTo:'Subscription Mgr', status:'Routed',    receivedAt:'2025-03-07 09:23:55' },
      ],

      ussdData: [
        { id:1,  msisdn:'254712345678', shortcode:'*384#',   flow:'Direct', finalMenu:'Latest Scores',    duration:34,  steps:4, status:'Successful', startedAt:'2025-03-07 09:10:01' },
        { id:2,  msisdn:'254798001122', shortcode:'*384*1#', flow:'SUB',    finalMenu:'Confirm SUB',      duration:18,  steps:3, status:'Successful', startedAt:'2025-03-07 09:11:44' },
        { id:3,  msisdn:'254700987654', shortcode:'*384*0#', flow:'UNSUB',  finalMenu:'Confirm UNSUB',    duration:22,  steps:3, status:'Successful', startedAt:'2025-03-07 09:12:30' },
        { id:4,  msisdn:'254733445566', shortcode:'*384#',   flow:'Direct', finalMenu:'Timeout',          duration:120, steps:1, status:'Timeout',    startedAt:'2025-03-07 09:13:05' },
        { id:5,  msisdn:'254711223344', shortcode:'*384#',   flow:'Direct', finalMenu:'Fantasy Football', duration:45,  steps:5, status:'Successful', startedAt:'2025-03-07 09:14:22' },
        { id:6,  msisdn:'254799887766', shortcode:'*384*1#', flow:'SUB',    finalMenu:'Error',            duration:8,   steps:2, status:'Failed',     startedAt:'2025-03-07 09:15:11' },
        { id:7,  msisdn:'254722334455', shortcode:'*384#',   flow:'Direct', finalMenu:'My Subscriptions', duration:28,  steps:3, status:'Successful', startedAt:'2025-03-07 09:16:40' },
        { id:8,  msisdn:'254766554433', shortcode:'*384*0#', flow:'UNSUB',  finalMenu:'Goodbye',          duration:15,  steps:2, status:'Successful', startedAt:'2025-03-07 09:17:55' },
        { id:9,  msisdn:'254755443322', shortcode:'*384#',   flow:'Direct', finalMenu:'Latest Scores',    duration:31,  steps:4, status:'Successful', startedAt:'2025-03-07 09:18:20' },
        { id:10, msisdn:'254744332211', shortcode:'*384*1#', flow:'SUB',    finalMenu:'Welcome',          duration:20,  steps:3, status:'Successful', startedAt:'2025-03-07 09:19:03' },
      ]
    };
  },
  computed: {
    filteredOutbound() {
      return this.outboundData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch = !s || r.campaign.toLowerCase().includes(s) || r.msisdn.toLowerCase().includes(s);
        const matchStatus   = !this.outboundFilters.status   || r.status   === this.outboundFilters.status;
        const matchCampaign = !this.outboundFilters.campaign || r.campaign === this.outboundFilters.campaign;
        const matchType     = !this.outboundFilters.type     || r.type     === this.outboundFilters.type;
        return matchSearch && matchStatus && matchCampaign && matchType;
      });
    },
    filteredInbound() {
      return this.inboundData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch   = !s || r.msisdn.toLowerCase().includes(s) || r.keyword.toLowerCase().includes(s) || r.message.toLowerCase().includes(s);
        const matchShortcode = !this.inboundFilters.shortcode || r.shortcode === this.inboundFilters.shortcode;
        const matchKeyword   = !this.inboundFilters.keyword   || r.keyword   === this.inboundFilters.keyword;
        const matchRouted    = !this.inboundFilters.routed    || r.status    === this.inboundFilters.routed;
        return matchSearch && matchShortcode && matchKeyword && matchRouted;
      });
    },
    filteredUssd() {
      return this.ussdData.filter(r => {
        const s = this.globalSearch.toLowerCase();
        const matchSearch    = !s || r.msisdn.toLowerCase().includes(s) || r.flow.toLowerCase().includes(s);
        const matchStatus    = !this.ussdFilters.status    || r.status    === this.ussdFilters.status;
        const matchFlow      = !this.ussdFilters.flow      || r.flow      === this.ussdFilters.flow;
        const matchShortcode = !this.ussdFilters.shortcode || r.shortcode === this.ussdFilters.shortcode;
        return matchSearch && matchStatus && matchFlow && matchShortcode;
      });
    },
    ussdTotal()       { return this.ussdStats.successful + this.ussdStats.failed + this.ussdStats.timeout; },
    ussdSuccessRate() { return this.ussdTotal ? ((this.ussdStats.successful / this.ussdTotal) * 100).toFixed(1) : 0; },
    ussdFailRate()    { return this.ussdTotal ? ((this.ussdStats.failed     / this.ussdTotal) * 100).toFixed(1) : 0; },
    ussdTimeoutRate() { return this.ussdTotal ? ((this.ussdStats.timeout    / this.ussdTotal) * 100).toFixed(1) : 0; },
  },
  methods: {
    outStatusClass(status) {
      return {
        'badge-success': status === 'Delivered',
        'badge-info':    status === 'Sent',
        'badge-danger':  status === 'Failed',
        'badge-default': status === 'Pending'
      };
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
      this.outboundFilters = { status: '', campaign: '', type: '' };
      this.inboundFilters  = { shortcode: '', keyword: '', routed: '' };
      this.ussdFilters     = { status: '', flow: '', shortcode: '' };
    },
    exportReport() {
      this.$notify({ type: 'success', message: 'Report exported as CSV.' });
    },
    refreshData() {
      this.$notify({ type: 'info', message: 'Report data refreshed.' });
    }
  }
};
</script>

<style scoped>
/* ══ Page Title ══ */
.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
}

/* ══ Stat Cards ══ */
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

/* ══ Filter Card ══ */
.filter-card   { border-left: 3px solid #e14eca; }
.sub-filter-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 14px 18px; }
.config-label {
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.6px; text-transform: uppercase;
  color: #9a9a9a; margin-bottom: 5px; display: block;
}
.filter-result-count {
  font-size: 0.82rem;
  color: #9a9a9a;
  font-weight: 600;
}

/* ══ Report Tabs ══ */
.report-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-wrap: wrap;
}
.report-tab-btn {
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  color: #9a9a9a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.report-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }
.tab-active {
  background: rgba(225,78,202,0.1) !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: #e14eca !important;
}
.tab-count {
  background: rgba(255,255,255,0.08);
  color: #9a9a9a;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}
.tab-active .tab-count { background: rgba(225,78,202,0.2); color: #e14eca; }

/* ══ Table Cells ══ */
.mono-text    { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #ccc; }
.msg-preview  { font-size: 0.82rem; color: #bbb; font-family: 'Courier New', monospace; }
.fw-bold      { font-weight: 700; color: #fff; }

.code-tag {
  padding: 3px 10px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  font-weight: 600;
}
.code-blue   { background: rgba(29,140,248,0.12); color: #1d8cf8; border: 1px solid rgba(29,140,248,0.25); }
.code-purple { background: rgba(225,78,202,0.12); color: #e14eca; border: 1px solid rgba(225,78,202,0.25); }

/* ══ Status Badges ══ */
.status-badge {
  padding: 4px 10px; border-radius: 10px;
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase;
}
.badge-success { background: rgba(24,206,15,0.12);  color: #18ce0f; border: 1px solid rgba(24,206,15,0.25); }
.badge-info    { background: rgba(29,140,248,0.12);  color: #1d8cf8; border: 1px solid rgba(29,140,248,0.25); }
.badge-danger  { background: rgba(253,93,147,0.12);  color: #fd5d93; border: 1px solid rgba(253,93,147,0.25); }
.badge-warn    { background: rgba(255,141,114,0.12); color: #ff8d72; border: 1px solid rgba(255,141,114,0.25); }
.badge-default { background: rgba(255,255,255,0.07); color: #9a9a9a; border: 1px solid rgba(255,255,255,0.12); }

/* ══ Delivery Rate Bar ══ */
.rate-wrap { display: flex; align-items: center; gap: 8px; }
.rate-bar-track {
  width: 60px; height: 5px; border-radius: 4px;
  background: rgba(255,255,255,0.08); overflow: hidden; flex-shrink: 0;
}
.rate-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }

/* ══ Flow Tags ══ */
.flow-tag {
  padding: 3px 9px; border-radius: 5px;
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
}
.flow-sub    { background: rgba(0,242,195,0.1);  color: #00f2c3; border: 1px solid rgba(0,242,195,0.2); }
.flow-unsub  { background: rgba(253,93,147,0.1); color: #fd5d93; border: 1px solid rgba(253,93,147,0.2); }
.flow-direct { background: rgba(29,140,248,0.1); color: #1d8cf8; border: 1px solid rgba(29,140,248,0.2); }

/* ══ USSD Stats Card ══ */
.ussd-stat-card { border-left: 3px solid #00f2c3; }
.accent-card    { border-radius: 10px; }
.accent-blue    { border-left: 3px solid #1d8cf8; }
.accent-teal    { border-left: 3px solid #00f2c3; }
.ussd-stat-inner { display: flex; align-items: center; justify-content: space-around; gap: 8px; }
.ussd-stat-block { text-align: center; }
.ussd-stat-num   { display: block; font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.ussd-stat-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #9a9a9a; margin-top: 2px; }
.ussd-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }
.ussd-bar-track {
  height: 8px; border-radius: 6px;
  overflow: hidden; display: flex;
  background: rgba(255,255,255,0.05);
}
.ussd-bar-success { background: #18ce0f; transition: width 0.6s; }
.ussd-bar-failed  { background: #fd5d93; transition: width 0.6s; }
.ussd-bar-timeout { background: #ff8d72; transition: width 0.6s; }

/* ══ Mini Stats ══ */
.mini-stat { padding: 12px 6px; }
.mini-stat-val   { display: block; font-size: 1.4rem; font-weight: 700; color: #fff; }
.mini-stat-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.4px; color: #9a9a9a; margin-top: 3px; }

/* ══ El-Select dark theme ══ */
.el-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }
.el-date-editor.el-input { width: 100% !important; }
.el-date-editor .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-table th > .cell { white-space: nowrap; }
</style>