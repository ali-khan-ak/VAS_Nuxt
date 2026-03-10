<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">Subscription Reporting</h2>
          <p class="text-muted mb-0">Look up any subscriber by MSISDN to view their full profile and activity history</p>
        </div>
        <div class="d-flex align-items-center" style="gap: 10px;" v-if="subscriber">
          <base-button type="default" size="sm" @click="exportSubscriber">
            <i class="tim-icons icon-cloud-download-93 mr-1"></i> Export
          </base-button>
          <base-button type="danger" size="sm" @click="clearSearch">
            <i class="tim-icons icon-simple-remove mr-1"></i> Clear
          </base-button>
        </div>
      </div>
    </div>

    <!-- ══ SEARCH PANEL ══ -->
    <div class="col-12 mb-4">
      <card class="search-card">
        <div class="search-hero">
          <div class="search-icon-wrap">
            <i class="tim-icons icon-zoom-split"></i>
          </div>
          <div class="search-body">
            <p class="search-label">Enter MSISDN to look up subscriber</p>
            <div class="search-row">
              <div class="search-input-wrap">
                <base-input
                  v-model="searchMsisdn"
                  placeholder="e.g. 254712345678"
                  class="search-input"
                  @keyup.native.enter="doSearch"
                ></base-input>
              </div>
              <base-button type="primary" @click="doSearch" :disabled="searching" class="search-btn">
                <i class="tim-icons icon-zoom-split mr-2"></i>
                {{ searching ? 'Searching...' : 'Search' }}
              </base-button>
            </div>
            <p class="search-hint">Supports full MSISDN (e.g. 254712345678) or local format (e.g. 0712345678)</p>
          </div>
        </div>

        <!-- Recent Searches -->
        <div class="recent-searches" v-if="recentSearches.length && !subscriber">
          <span class="recent-label">Recent:</span>
          <button
            v-for="msisdn in recentSearches"
            :key="msisdn"
            class="recent-chip"
            @click="searchMsisdn = msisdn; doSearch()"
          >{{ msisdn }}</button>
        </div>
      </card>
    </div>

    <!-- ══ EMPTY STATE ══ -->
    <div class="col-12" v-if="!subscriber && !searching && searched">
      <card class="empty-card">
        <div class="empty-state">
          <div class="empty-icon">
            <i class="tim-icons icon-zoom-split"></i>
          </div>
          <h4 class="empty-title">No subscriber found</h4>
          <p class="text-muted">No record found for <strong>{{ lastSearched }}</strong>. Check the MSISDN and try again.</p>
        </div>
      </card>
    </div>

    <!-- ══ RESULTS ══ -->
    <template v-if="subscriber">

      <!-- ── Profile + Status Cards ── -->
      <div class="col-lg-3 col-sm-6">
        <card class="card-stats stat-card">
          <div class="stat-card-body">
            <div class="stat-icon-circle" :style="{ background: statusGradient }">
              <i class="tim-icons icon-single-02"></i>
            </div>
            <div class="stat-content">
              <p class="stat-label">Status</p>
              <h3 class="stat-value" style="font-size:1.3rem;">
                <span class="status-badge" :class="statusBadgeClass">{{ subscriber.status }}</span>
              </h3>
            </div>
          </div>
          <div slot="footer" class="card-footer stat-footer">
            <i class="tim-icons icon-refresh-02"></i> Service: {{ subscriber.service }}
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
              <p class="stat-label">Subscribed On</p>
              <h3 class="stat-value" style="font-size:1rem; line-height:1.4;">{{ subscriber.subscriptionDate }}</h3>
            </div>
          </div>
          <div slot="footer" class="card-footer stat-footer">
            <i class="tim-icons icon-time-alarm"></i> {{ subscriber.daysSubscribed }} days subscribed
          </div>
        </card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <card class="card-stats stat-card">
          <div class="stat-card-body">
            <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
              <i class="tim-icons icon-money-coins"></i>
            </div>
            <div class="stat-content">
              <p class="stat-label">Last Charge</p>
              <h3 class="stat-value" style="font-size:1rem; line-height:1.4;">{{ subscriber.lastChargeDate }}</h3>
            </div>
          </div>
          <div slot="footer" class="card-footer stat-footer">
            <i class="tim-icons icon-coins"></i> Total charged: {{ subscriber.totalCharged }}
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
              <p class="stat-label">Unsubscribed On</p>
              <h3 class="stat-value" style="font-size:1rem; line-height:1.4;">
                {{ subscriber.unsubscriptionDate || '—' }}
              </h3>
            </div>
          </div>
          <div slot="footer" class="card-footer stat-footer">
            <i class="tim-icons icon-refresh-02"></i>
            {{ subscriber.unsubscriptionDate ? 'Via ' + subscriber.unsubChannel : 'Still active' }}
          </div>
        </card>
      </div>

      <!-- ── Subscriber Profile Card ── -->
      <div class="col-lg-8 col-12 mb-3">
        <card class="profile-card accent-card accent-purple">
          <div slot="header" class="section-heading mb-0">
            <i class="tim-icons icon-single-02 mr-2"></i> Subscriber Profile
          </div>
          <div class="profile-grid">
            <div class="profile-field">
              <span class="pf-label">MSISDN</span>
              <span class="pf-value mono-text">{{ subscriber.msisdn }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Service</span>
              <span class="pf-value">{{ subscriber.service }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Shortcode</span>
              <span class="pf-value"><span class="code-tag code-blue">{{ subscriber.shortcode }}</span></span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Keyword</span>
              <span class="pf-value"><span class="code-tag code-purple">{{ subscriber.keyword }}</span></span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Billing Cycle</span>
              <span class="pf-value">{{ subscriber.billingCycle }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Charge Amount</span>
              <span class="pf-value text-success fw-bold">{{ subscriber.chargeAmount }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Subscription Channel</span>
              <span class="pf-value">{{ subscriber.subChannel }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Opt-in Method</span>
              <span class="pf-value">{{ subscriber.optInMethod }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Network</span>
              <span class="pf-value">{{ subscriber.network }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Grace Period Ends</span>
              <span class="pf-value" :class="subscriber.gracePeriodEnds ? 'text-warning' : 'text-muted'">
                {{ subscriber.gracePeriodEnds || '—' }}
              </span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Total Events</span>
              <span class="pf-value text-info">{{ subscriber.activityLog.length }}</span>
            </div>
            <div class="profile-field">
              <span class="pf-label">Successful Charges</span>
              <span class="pf-value text-success">{{ chargeCount }}</span>
            </div>
          </div>
        </card>
      </div>

      <!-- ── Charge Summary Card ── -->
      <div class="col-lg-4 col-12 mb-3">
        <card class="accent-card accent-teal" style="height: calc(100% - 30px);">
          <div slot="header" class="section-heading mb-0">
            <i class="tim-icons icon-money-coins mr-2"></i> Charge Summary
          </div>
          <div class="charge-summary">
            <div class="charge-row">
              <span class="cr-label">Total Charges</span>
              <span class="cr-value text-success">{{ chargeCount }}</span>
            </div>
            <div class="charge-row">
              <span class="cr-label">Failed Charges</span>
              <span class="cr-value text-danger">{{ failedChargeCount }}</span>
            </div>
            <div class="charge-row">
              <span class="cr-label">Total Revenue</span>
              <span class="cr-value text-success fw-bold">{{ subscriber.totalCharged }}</span>
            </div>
            <div class="charge-row">
              <span class="cr-label">Charge Success Rate</span>
              <span class="cr-value" :class="chargeRate >= 80 ? 'text-success' : 'text-warning'">{{ chargeRate }}%</span>
            </div>
            <div class="charge-bar-wrap mt-3">
              <div class="charge-bar-track">
                <div class="charge-bar-fill" :style="{ width: chargeRate + '%' }"></div>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <small class="text-success">{{ chargeCount }} successful</small>
                <small class="text-danger">{{ failedChargeCount }} failed</small>
              </div>
            </div>
          </div>
        </card>
      </div>

      <!-- ── Activity Timeline ── -->
      <div class="col-12 mb-2 mt-1">
        <div class="section-heading d-flex justify-content-between align-items-center">
          <span><i class="tim-icons icon-bullet-list-67 mr-2"></i> Activity Timeline</span>
          <div class="d-flex align-items-center" style="gap: 8px;">
            <el-select v-model="activityFilter" class="activity-filter-select" size="mini">
              <el-option label="All Events"      value="all"></el-option>
              <el-option label="Subscriptions"   value="SUBSCRIPTION"></el-option>
              <el-option label="Unsubscriptions" value="UNSUBSCRIPTION"></el-option>
              <el-option label="Charges"         value="CHARGE"></el-option>
              <el-option label="Failed Charges"  value="CHARGE_FAILED"></el-option>
              <el-option label="Renewals"        value="RENEWAL"></el-option>
              <el-option label="SMS"             value="SMS"></el-option>
              <el-option label="USSD"            value="USSD"></el-option>
              <el-option label="IVR"             value="IVR"></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="col-12">
        <card class="timeline-card">
          <div class="timeline">
            <div
              v-for="(event, idx) in filteredActivity"
              :key="idx"
              class="timeline-item"
            >
              <!-- Connector line -->
              <div class="tl-line" v-if="idx < filteredActivity.length - 1"></div>

              <!-- Icon node -->
              <div class="tl-node" :class="`node-${eventColor(event.type)}`">
                <i :class="`tim-icons ${eventIcon(event.type)}`"></i>
              </div>

              <!-- Content -->
              <div class="tl-content">
                <div class="tl-header">
                  <span class="tl-event-tag" :class="`tag-${eventColor(event.type)}`">{{ eventLabel(event.type) }}</span>
                  <span class="tl-time">{{ event.timestamp }}</span>
                </div>
                <p class="tl-message">{{ event.message }}</p>
                <div class="tl-meta" v-if="event.amount || event.channel || event.reference">
                  <span v-if="event.amount"    class="tl-meta-pill pill-green">{{ event.amount }}</span>
                  <span v-if="event.channel"   class="tl-meta-pill pill-blue">via {{ event.channel }}</span>
                  <span v-if="event.reference" class="tl-meta-pill pill-grey">Ref: {{ event.reference }}</span>
                </div>
              </div>
            </div>

            <div v-if="filteredActivity.length === 0" class="tl-empty">
              No events match the selected filter.
            </div>
          </div>
        </card>
      </div>

    </template>

  </div>
</template>

<script>
import { Select, Option } from 'element-ui';

const MOCK_SUBSCRIBERS = {
  '254712345678': {
    msisdn: '254712345678',
    service: 'Premier League Alerts',
    shortcode: '20124',
    keyword: 'SUB',
    status: 'Active',
    subscriptionDate: '2025-01-14',
    unsubscriptionDate: null,
    unsubChannel: null,
    lastChargeDate: '2025-03-06',
    gracePeriodEnds: null,
    billingCycle: 'Daily',
    chargeAmount: 'KES 5.00',
    totalCharged: 'KES 370.00',
    subChannel: 'USSD (*384*1#)',
    optInMethod: 'Double Opt-In',
    network: 'Safaricom',
    daysSubscribed: 51,
    activityLog: [
      { type:'SUBSCRIPTION',  timestamp:'2025-01-14 09:12:04', message:'Subscriber opted in via USSD *384*1#. Double opt-in confirmed.',        channel:'USSD',    amount:null,       reference:'SUB-001' },
      { type:'SMS',           timestamp:'2025-01-14 09:12:06', message:'Welcome SMS sent: "Welcome to Premier League Alerts! KES 5/day."',       channel:'SMS',     amount:null,       reference:'MSG-1021' },
      { type:'CHARGE',        timestamp:'2025-01-14 09:12:08', message:'First charge processed successfully.',                                    channel:'Billing', amount:'KES 5.00', reference:'CHG-4401' },
      { type:'RENEWAL',       timestamp:'2025-01-15 08:00:01', message:'Daily renewal charge processed.',                                         channel:'Billing', amount:'KES 5.00', reference:'CHG-4502' },
      { type:'RENEWAL',       timestamp:'2025-01-16 08:00:03', message:'Daily renewal charge processed.',                                         channel:'Billing', amount:'KES 5.00', reference:'CHG-4608' },
      { type:'CHARGE_FAILED', timestamp:'2025-01-17 08:00:02', message:'Charge failed — insufficient balance. Retry scheduled in 6 hours.',       channel:'Billing', amount:'KES 5.00', reference:'CHG-4710' },
      { type:'CHARGE_FAILED', timestamp:'2025-01-17 14:00:02', message:'Retry charge failed — insufficient balance. Grace period started.',       channel:'Billing', amount:'KES 5.00', reference:'CHG-4711' },
      { type:'RENEWAL',       timestamp:'2025-01-18 08:00:01', message:'Daily renewal charge processed. Grace period ended.',                     channel:'Billing', amount:'KES 5.00', reference:'CHG-4812' },
      { type:'SMS',           timestamp:'2025-01-18 08:00:03', message:'Content SMS sent: "GW21 Results: Man City 3-1 Arsenal. Full time!"',      channel:'SMS',     amount:null,       reference:'MSG-1145' },
      { type:'USSD',          timestamp:'2025-02-02 11:34:19', message:'USSD session via *384#. Flow: Main Menu → Live Scores. Duration: 34s.',   channel:'USSD',    amount:null,       reference:'SES-7821' },
      { type:'RENEWAL',       timestamp:'2025-02-10 08:00:01', message:'Daily renewal charge processed.',                                         channel:'Billing', amount:'KES 5.00', reference:'CHG-5120' },
      { type:'IVR',           timestamp:'2025-02-14 15:22:44', message:'Inbound IVR call. Flow: Subscriptions → Manage. Duration: 28s. Key: 2.', channel:'IVR',     amount:null,       reference:'IVR-3301' },
      { type:'RENEWAL',       timestamp:'2025-03-01 08:00:01', message:'Daily renewal charge processed.',                                         channel:'Billing', amount:'KES 5.00', reference:'CHG-6200' },
      { type:'RENEWAL',       timestamp:'2025-03-06 08:00:01', message:'Daily renewal charge processed.',                                         channel:'Billing', amount:'KES 5.00', reference:'CHG-6510' },
      { type:'SMS',           timestamp:'2025-03-06 08:00:04', message:'Content SMS sent: "GW28 Preview: Liverpool vs Man Utd. Kickoff 16:30."',  channel:'SMS',     amount:null,       reference:'MSG-2201' },
    ]
  },
  '254798001122': {
    msisdn: '254798001122',
    service: 'Fantasy Football Pro',
    shortcode: '20200',
    keyword: 'FANTASY',
    status: 'Inactive',
    subscriptionDate: '2024-11-01',
    unsubscriptionDate: '2025-02-18',
    unsubChannel: 'SMS (UNSUB)',
    lastChargeDate: '2025-02-17',
    gracePeriodEnds: null,
    billingCycle: 'Weekly',
    chargeAmount: 'KES 20.00',
    totalCharged: 'KES 280.00',
    subChannel: 'SMS (SUB FANTASY to 20200)',
    optInMethod: 'Single Opt-In',
    network: 'Airtel Kenya',
    daysSubscribed: 109,
    activityLog: [
      { type:'SUBSCRIPTION',    timestamp:'2024-11-01 13:05:11', message:'Subscriber opted in via SMS keyword "SUB FANTASY" to 20200.',            channel:'SMS',     amount:null,        reference:'SUB-088' },
      { type:'SMS',             timestamp:'2024-11-01 13:05:13', message:'Welcome SMS sent: "Welcome to Fantasy Football Pro! KES 20/week."',      channel:'SMS',     amount:null,        reference:'MSG-0810' },
      { type:'CHARGE',          timestamp:'2024-11-01 13:05:15', message:'First charge processed successfully.',                                    channel:'Billing', amount:'KES 20.00', reference:'CHG-2201' },
      { type:'RENEWAL',         timestamp:'2024-11-08 08:00:01', message:'Weekly renewal processed.',                                              channel:'Billing', amount:'KES 20.00', reference:'CHG-2301' },
      { type:'RENEWAL',         timestamp:'2024-11-15 08:00:01', message:'Weekly renewal processed.',                                              channel:'Billing', amount:'KES 20.00', reference:'CHG-2401' },
      { type:'CHARGE_FAILED',   timestamp:'2024-11-22 08:00:01', message:'Weekly charge failed — low balance. Grace period started (3 days).',     channel:'Billing', amount:'KES 20.00', reference:'CHG-2500' },
      { type:'RENEWAL',         timestamp:'2024-11-24 08:00:01', message:'Retry charge successful. Grace period ended.',                           channel:'Billing', amount:'KES 20.00', reference:'CHG-2510' },
      { type:'USSD',            timestamp:'2024-12-10 09:41:22', message:'USSD session *384*1#. Flow: SUB confirm. Duration: 18s.',                channel:'USSD',    amount:null,        reference:'SES-4421' },
      { type:'RENEWAL',         timestamp:'2025-02-07 08:00:01', message:'Weekly renewal processed.',                                              channel:'Billing', amount:'KES 20.00', reference:'CHG-3900' },
      { type:'RENEWAL',         timestamp:'2025-02-14 08:00:01', message:'Weekly renewal processed.',                                              channel:'Billing', amount:'KES 20.00', reference:'CHG-4010' },
      { type:'RENEWAL',         timestamp:'2025-02-17 08:00:01', message:'Weekly renewal processed. Final charge before unsub.',                   channel:'Billing', amount:'KES 20.00', reference:'CHG-4100' },
      { type:'UNSUBSCRIPTION',  timestamp:'2025-02-18 10:22:33', message:'Subscriber sent UNSUB to 20200. Successfully unsubscribed.',             channel:'SMS',     amount:null,        reference:'UNSUB-099' },
      { type:'SMS',             timestamp:'2025-02-18 10:22:35', message:'Goodbye SMS sent: "You\'ve been unsubscribed from Fantasy Football Pro."', channel:'SMS',   amount:null,        reference:'MSG-3301' },
    ]
  }
};

export default {
  name: 'SubscriptionReporting',
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      searchMsisdn: '',
      lastSearched: '',
      subscriber: null,
      searching: false,
      searched: false,
      activityFilter: 'all',
      recentSearches: []
    };
  },
  computed: {
    filteredActivity() {
      if (!this.subscriber) return [];
      if (this.activityFilter === 'all') return this.subscriber.activityLog;
      return this.subscriber.activityLog.filter(e => e.type === this.activityFilter);
    },
    statusGradient() {
      if (!this.subscriber) return '';
      const map = {
        Active:   'linear-gradient(135deg, #00bf9a, #00f2c3)',
        Inactive: 'linear-gradient(135deg, #fd5d93, #ec250d)',
        Expired:  'linear-gradient(135deg, #ff8d72, #ff6491)'
      };
      return map[this.subscriber.status] || map.Inactive;
    },
    statusBadgeClass() {
      if (!this.subscriber) return '';
      return {
        'badge-success': this.subscriber.status === 'Active',
        'badge-danger':  this.subscriber.status === 'Inactive',
        'badge-warn':    this.subscriber.status === 'Expired'
      };
    },
    chargeCount() {
      if (!this.subscriber) return 0;
      return this.subscriber.activityLog.filter(e => e.type === 'CHARGE' || e.type === 'RENEWAL').length;
    },
    failedChargeCount() {
      if (!this.subscriber) return 0;
      return this.subscriber.activityLog.filter(e => e.type === 'CHARGE_FAILED').length;
    },
    chargeRate() {
      const total = this.chargeCount + this.failedChargeCount;
      return total ? Math.round((this.chargeCount / total) * 100) : 0;
    }
  },
  methods: {
    doSearch() {
      const raw = this.searchMsisdn.trim().replace(/^0/, '254');
      if (!raw) return;
      this.searching = true;
      this.searched  = false;
      this.subscriber = null;
      this.lastSearched = raw;

      setTimeout(() => {
        this.subscriber = MOCK_SUBSCRIBERS[raw] || null;
        this.searching  = false;
        this.searched   = true;
        if (this.subscriber && !this.recentSearches.includes(raw)) {
          this.recentSearches.unshift(raw);
          if (this.recentSearches.length > 5) this.recentSearches.pop();
        }
        this.activityFilter = 'all';
      }, 700);
    },
    clearSearch() {
      this.subscriber   = null;
      this.searched     = false;
      this.searchMsisdn = '';
      this.lastSearched = '';
      this.activityFilter = 'all';
    },
    exportSubscriber() {
      this.$notify({ type: 'success', message: `Subscriber report for ${this.subscriber.msisdn} exported.` });
    },
    eventIcon(type) {
      const map = {
        SUBSCRIPTION:   'icon-check-2',
        UNSUBSCRIPTION: 'icon-simple-remove',
        CHARGE:         'icon-money-coins',
        CHARGE_FAILED:  'icon-alert-circle-exc',
        RENEWAL:        'icon-refresh-02',
        SMS:            'icon-chat-33',
        USSD:           'icon-mobile',
        IVR:            'icon-headphones'
      };
      return map[type] || 'icon-bullet-list-67';
    },
    eventLabel(type) {
      const map = {
        SUBSCRIPTION:   'SUBSCRIBED',
        UNSUBSCRIPTION: 'UNSUBSCRIBED',
        CHARGE:         'CHARGED',
        CHARGE_FAILED:  'CHARGE FAILED',
        RENEWAL:        'RENEWAL',
        SMS:            'SMS',
        USSD:           'USSD SESSION',
        IVR:            'IVR CALL'
      };
      return map[type] || type;
    },
    eventColor(type) {
      const map = {
        SUBSCRIPTION:   'green',
        UNSUBSCRIPTION: 'red',
        CHARGE:         'teal',
        CHARGE_FAILED:  'orange',
        RENEWAL:        'blue',
        SMS:            'purple',
        USSD:           'cyan',
        IVR:            'pink'
      };
      return map[type] || 'grey';
    }
  }
};
</script>

<style scoped>
/* ══ Page ══ */
.page-title { font-size: 1.75rem; font-weight: 600; color: #ffffff; }

/* ══ Search Card ══ */
.search-card { border-left: 3px solid #e14eca; }
.search-hero { display: flex; align-items: flex-start; gap: 20px; }
.search-icon-wrap {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 12px; background: rgba(225,78,202,0.12);
  display: flex; align-items: center; justify-content: center;
}
.search-icon-wrap i { font-size: 1.3rem; color: #e14eca; }
.search-body { flex: 1; }
.search-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9a9a9a; margin-bottom: 10px; }
.search-row { display: flex; gap: 12px; align-items: flex-start; }
.search-input-wrap { flex: 1; max-width: 420px; }
.search-btn { min-width: 120px; height: 40px; }
.search-hint { font-size: 0.75rem; color: #555; margin-top: 6px; margin-bottom: 0; }
.recent-searches { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
.recent-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: #555; flex-shrink: 0; }
.recent-chip {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: #9a9a9a; border-radius: 16px; padding: 3px 12px;
  font-size: 0.76rem; font-family: 'Courier New', monospace; cursor: pointer;
  transition: all 0.2s;
}
.recent-chip:hover { background: rgba(225,78,202,0.1); border-color: rgba(225,78,202,0.3); color: #e14eca; }

/* ══ Empty State ══ */
.empty-card { text-align: center; }
.empty-state { padding: 50px 20px; }
.empty-icon { width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.empty-icon i { font-size: 1.6rem; color: #555; }
.empty-title { color: #9a9a9a; font-weight: 600; margin-bottom: 8px; }

/* ══ Stat Cards ══ */
.stat-card .card-body { padding: 20px 20px 10px !important; }
.stat-card-body { display: flex; align-items: center; gap: 16px; }
.stat-icon-circle { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-circle i { font-size: 1.2rem; color: #fff; }
.stat-content { flex: 1; }
.stat-label { font-size: 0.75rem; color: #9a9a9a; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0; line-height: 1.2; }
.stat-footer { font-size: 0.78rem; color: #9a9a9a; padding-top: 8px; }

/* ══ Section Headings ══ */
.section-heading {
  font-size: 0.8rem; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: #9a9a9a;
  padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 14px;
}

/* ══ Accent Cards ══ */
.accent-card  { border-radius: 10px; }
.accent-purple { border-left: 3px solid #e14eca; }
.accent-teal   { border-left: 3px solid #00f2c3; }

/* ══ Profile Grid ══ */
.profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px 24px; }
.profile-field { display: flex; flex-direction: column; gap: 4px; }
.pf-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #555; font-weight: 700; }
.pf-value { font-size: 0.88rem; color: #ddd; font-weight: 500; }

/* ══ Code Tags ══ */
.code-tag   { padding: 3px 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.78rem; font-weight: 600; }
.code-blue  { background: rgba(29,140,248,0.12);  color: #1d8cf8; border: 1px solid rgba(29,140,248,0.25); }
.code-purple { background: rgba(225,78,202,0.12); color: #e14eca; border: 1px solid rgba(225,78,202,0.25); }
.mono-text  { font-family: 'Courier New', monospace; font-size: 0.85rem; color: #ccc; }
.fw-bold    { font-weight: 700; }

/* ══ Status Badges ══ */
.status-badge { padding: 5px 14px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.badge-success { background: rgba(24,206,15,0.12);  color: #18ce0f; border: 1px solid rgba(24,206,15,0.25); }
.badge-danger  { background: rgba(253,93,147,0.12);  color: #fd5d93; border: 1px solid rgba(253,93,147,0.25); }
.badge-warn    { background: rgba(255,141,114,0.12); color: #ff8d72; border: 1px solid rgba(255,141,114,0.25); }

/* ══ Charge Summary ══ */
.charge-summary { display: flex; flex-direction: column; gap: 12px; }
.charge-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.charge-row:last-of-type { border-bottom: none; }
.cr-label { font-size: 0.78rem; color: #9a9a9a; }
.cr-value { font-size: 1rem; font-weight: 700; }
.charge-bar-track { height: 7px; border-radius: 6px; background: rgba(253,93,147,0.2); overflow: hidden; }
.charge-bar-fill  { height: 100%; background: #18ce0f; border-radius: 6px; transition: width 0.6s; }

/* ══ Activity Filter Select ══ */
.activity-filter-select { width: 160px !important; }
.activity-filter-select .el-input__inner {
  background-color: #1e1e2f !important; border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important; height: 32px; line-height: 32px;
}

/* ══ Timeline ══ */
.timeline-card .card-body { padding: 24px 28px !important; }
.timeline { position: relative; }
.timeline-item {
  display: flex; gap: 18px;
  position: relative; padding-bottom: 28px;
}
.timeline-item:last-child { padding-bottom: 0; }

.tl-line {
  position: absolute; left: 19px; top: 40px; bottom: 0;
  width: 2px; background: rgba(255,255,255,0.06); z-index: 0;
}

.tl-node {
  width: 38px; height: 38px; flex-shrink: 0;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  z-index: 1; position: relative;
}
.tl-node i { font-size: 0.85rem; }

.node-green  { background: rgba(24,206,15,0.15);  border: 2px solid rgba(24,206,15,0.4);  color: #18ce0f; }
.node-red    { background: rgba(253,93,147,0.15); border: 2px solid rgba(253,93,147,0.4); color: #fd5d93; }
.node-teal   { background: rgba(0,242,195,0.12);  border: 2px solid rgba(0,242,195,0.35); color: #00f2c3; }
.node-orange { background: rgba(255,141,114,0.15);border: 2px solid rgba(255,141,114,0.4);color: #ff8d72; }
.node-blue   { background: rgba(29,140,248,0.12); border: 2px solid rgba(29,140,248,0.35);color: #1d8cf8; }
.node-purple { background: rgba(225,78,202,0.12); border: 2px solid rgba(225,78,202,0.35);color: #e14eca; }
.node-cyan   { background: rgba(0,191,154,0.12);  border: 2px solid rgba(0,191,154,0.35); color: #00bf9a; }
.node-pink   { background: rgba(253,93,147,0.12); border: 2px solid rgba(253,93,147,0.35);color: #fd5d93; }
.node-grey   { background: rgba(255,255,255,0.05);border: 2px solid rgba(255,255,255,0.12);color: #666; }

.tl-content { flex: 1; padding-top: 4px; }
.tl-header  { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
.tl-time    { font-size: 0.75rem; color: #555; font-family: 'Courier New', monospace; margin-left: auto; }

.tl-event-tag {
  padding: 2px 9px; border-radius: 5px;
  font-size: 0.65rem; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
}
.tag-green  { background: rgba(24,206,15,0.12);  color: #18ce0f; }
.tag-red    { background: rgba(253,93,147,0.12); color: #fd5d93; }
.tag-teal   { background: rgba(0,242,195,0.1);   color: #00f2c3; }
.tag-orange { background: rgba(255,141,114,0.12);color: #ff8d72; }
.tag-blue   { background: rgba(29,140,248,0.1);  color: #1d8cf8; }
.tag-purple { background: rgba(225,78,202,0.1);  color: #e14eca; }
.tag-cyan   { background: rgba(0,191,154,0.1);   color: #00bf9a; }
.tag-pink   { background: rgba(253,93,147,0.1);  color: #fd5d93; }
.tag-grey   { background: rgba(255,255,255,0.05);color: #666; }

.tl-message { font-size: 0.84rem; color: #ccc; margin: 0 0 6px; line-height: 1.5; }
.tl-meta    { display: flex; gap: 6px; flex-wrap: wrap; }
.tl-meta-pill { padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
.pill-green { background: rgba(24,206,15,0.1);  color: #18ce0f; }
.pill-blue  { background: rgba(29,140,248,0.1); color: #1d8cf8; }
.pill-grey  { background: rgba(255,255,255,0.05); color: #666; font-family: 'Courier New', monospace; }

.tl-empty { text-align: center; padding: 40px; color: #555; font-size: 0.85rem; }

/* ══ El-Select dark ══ */
.el-select .el-input__inner { background-color: #1e1e2f !important; border-color: rgba(255,255,255,0.12) !important; color: #fff !important; border-radius: 6px; }
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }
</style>