<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">USSD Management</h2>
          <p class="text-muted mb-0">Configure flows, manage service controls and monitor live sessions</p>
        </div>
        <div class="d-flex align-items-center" style="gap: 12px;">
          <span class="service-status-pill" :class="serviceRunning ? 'pill-running' : 'pill-stopped'">
            <span class="pill-dot"></span>
            {{ serviceRunning ? 'Service Running' : 'Service Stopped' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ══ VALIDATION BANNER ══ -->
    <div class="col-12 mb-3">
      <div class="validation-banner" v-if="showValidationBanner">
        <div class="vb-left">
          <i class="tim-icons icon-alert-circle-exc vb-icon"></i>
          <div>
            <strong>Pending Validation</strong>
            <p class="vb-sub mb-0">Some configuration fields are locked until USSD gateway validation is complete. Contact your gateway administrator to unlock full configuration access.</p>
          </div>
        </div>
        <button class="vb-close" @click="showValidationBanner = false">
          <i class="tim-icons icon-simple-remove"></i>
        </button>
      </div>
    </div>

    <!-- ══ LIVE METRICS STRIP ══ -->
    <div class="col-lg-3 col-sm-6 mb-0">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #e14eca, #ba54f5);">
            <i class="tim-icons icon-mobile"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Active Sessions</p>
            <h3 class="stat-value">{{ activeSessions }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Live count
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 mb-0">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #00bf9a, #00f2c3);">
            <i class="tim-icons icon-check-2"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Successful Today</p>
            <h3 class="stat-value">{{ successfulSessions.toLocaleString() }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up"></i> +9.3% from yesterday
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 mb-0">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #fd5d93, #ec250d);">
            <i class="tim-icons icon-simple-remove"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Failed Today</p>
            <h3 class="stat-value">{{ failedSessions.toLocaleString() }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc"></i> {{ failRate }}% fail rate
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 mb-0">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
            <i class="tim-icons icon-time-alarm"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg. Session Duration</p>
            <h3 class="stat-value">{{ avgDuration }}s</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Across all flows
        </div>
      </card>
    </div>

    <!-- ══ SECTION: SERVICE CONTROLS ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-button-play mr-2"></i> Service Controls
      </div>
    </div>

    <div class="col-12">
      <card class="accent-card accent-blue">
        <div class="row align-items-center">
          <div class="col-md-5">
            <div class="d-flex align-items-center" style="gap: 12px; flex-wrap: wrap;">
              <base-button type="success" :disabled="serviceRunning" @click="startService" class="service-btn">
                <i class="tim-icons icon-button-play mr-2"></i> Start
              </base-button>
              <base-button type="danger" :disabled="!serviceRunning" @click="stopService" class="service-btn">
                <i class="tim-icons icon-simple-remove mr-2"></i> Stop
              </base-button>
              <base-button type="warning" @click="restartService" class="service-btn">
                <i class="tim-icons icon-refresh-02 mr-2"></i> Restart
              </base-button>
            </div>
            <p class="service-meta mt-2">
              <i class="tim-icons icon-refresh-02 mr-1"></i>
              Uptime: <strong class="text-success">{{ uptime }}</strong>
              &nbsp;·&nbsp; Gateway: <strong class="text-info">{{ config.gatewayIp }}:{{ config.gatewayPort }}</strong>
            </p>
          </div>
          <div class="col-md-7">
            <div class="session-monitor-strip">
              <div class="sm-bar-wrap">
                <div class="sm-bar-labels">
                  <span class="text-success sm-bar-label">Successful</span>
                  <span class="text-danger sm-bar-label">Failed</span>
                </div>
                <div class="sm-bar-track">
                  <div class="sm-bar-fill sm-fill-success" :style="{ width: (successfulSessions / (successfulSessions + failedSessions) * 100) + '%' }"></div>
                  <div class="sm-bar-fill sm-fill-failed" :style="{ width: (failedSessions / (successfulSessions + failedSessions) * 100) + '%' }"></div>
                </div>
                <div class="sm-bar-values">
                  <span class="text-success">{{ successfulSessions.toLocaleString() }}</span>
                  <span class="text-muted sm-bar-total">Total: {{ (successfulSessions + failedSessions).toLocaleString() }}</span>
                  <span class="text-danger">{{ failedSessions.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION: USSD FLOW CONFIGURATION ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-settings-gear-63 mr-2"></i> Flow Configuration
      </div>
    </div>

    <!-- Flow Tabs -->
    <div class="col-12 mb-3">
      <div class="flow-tabs">
        <button
          v-for="tab in flowTabs"
          :key="tab.key"
          class="flow-tab-btn"
          :class="{ 'flow-tab-active': activeFlowTab === tab.key }"
          @click="activeFlowTab = tab.key"
        >
          <i :class="`tim-icons ${tab.icon} mr-2`"></i>{{ tab.label }}
        </button>
      </div>
    </div>

    <!-- SUB Flow -->
    <div class="col-12" v-if="activeFlowTab === 'sub'">
      <card class="accent-card accent-purple">
        <div class="config-card-header mb-3">
          <div>
            <h5 class="config-card-title">Subscription Flow (SUB)</h5>
            <p class="config-card-sub text-muted">Configure the subscription journey triggered when a user dials the SUB shortcode.</p>
          </div>
          <div class="d-flex" style="gap:8px;">
            <base-button v-if="!subEditMode" type="info" size="sm" @click="subEditMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="subEditMode = false">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveFlow('sub')">
                <i class="tim-icons icon-check-2 mr-1"></i> Save
              </base-button>
            </template>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Shortcode</label>
            <base-input v-model="subFlow.shortcode" placeholder="e.g. *384#" :disabled="!subEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Service Code</label>
            <base-input v-model="subFlow.serviceCode" placeholder="e.g. SUB_SPORTS" :disabled="!subEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Confirmation Message</label>
            <base-input v-model="subFlow.confirmMsg" placeholder="Subscription confirmed!" :disabled="!subEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Welcome Message</label>
            <base-input v-model="subFlow.welcomeMsg" placeholder="Welcome to Sports Alerts!" :disabled="!subEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Charge Point</label>
            <el-select v-model="subFlow.chargePoint" :disabled="!subEditMode" class="w-100">
              <el-option label="On Subscribe" value="on_sub"></el-option>
              <el-option label="On First Use" value="on_use"></el-option>
              <el-option label="Deferred" value="deferred"></el-option>
            </el-select>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Double Opt-In</label>
            <div class="d-flex align-items-center mt-2" style="gap:10px;">
              <el-switch v-model="subFlow.doubleOptIn" :disabled="!subEditMode" active-color="#18ce0f" inactive-color="#444"></el-switch>
              <span class="text-muted" style="font-size:0.82rem;">{{ subFlow.doubleOptIn ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="col-12 mb-3" v-if="subFlow.doubleOptIn">
            <label class="config-label">Opt-In Confirmation Prompt</label>
            <textarea v-model="subFlow.optInPrompt" class="ussd-textarea" rows="2" :disabled="!subEditMode" placeholder="Reply 1 to confirm subscription. Reply 2 to cancel."></textarea>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Callback URL <span class="locked-tag" v-if="!subEditMode"><i class="tim-icons icon-lock-circle"></i> Read-only</span></label>
            <base-input v-model="subFlow.callbackUrl" placeholder="https://api.example.com/sub" disabled></base-input>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Timeout (seconds)</label>
            <base-input v-model="subFlow.timeout" type="number" placeholder="30" :disabled="!subEditMode"></base-input>
          </div>
        </div>
      </card>
    </div>

    <!-- UNSUB Flow -->
    <div class="col-12" v-if="activeFlowTab === 'unsub'">
      <card class="accent-card accent-red">
        <div class="config-card-header mb-3">
          <div>
            <h5 class="config-card-title">Unsubscription Flow (UNSUB)</h5>
            <p class="config-card-sub text-muted">Configure the unsubscription journey and opt-out messaging.</p>
          </div>
          <div class="d-flex" style="gap:8px;">
            <base-button v-if="!unsubEditMode" type="info" size="sm" @click="unsubEditMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="unsubEditMode = false">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveFlow('unsub')">
                <i class="tim-icons icon-check-2 mr-1"></i> Save
              </base-button>
            </template>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Shortcode</label>
            <base-input v-model="unsubFlow.shortcode" placeholder="e.g. *384*0#" :disabled="!unsubEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Service Code</label>
            <base-input v-model="unsubFlow.serviceCode" placeholder="e.g. UNSUB_SPORTS" :disabled="!unsubEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Goodbye Message</label>
            <base-input v-model="unsubFlow.goodbyeMsg" placeholder="You have been unsubscribed." :disabled="!unsubEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Require Confirmation</label>
            <div class="d-flex align-items-center mt-2" style="gap:10px;">
              <el-switch v-model="unsubFlow.requireConfirm" :disabled="!unsubEditMode" active-color="#18ce0f" inactive-color="#444"></el-switch>
              <span class="text-muted" style="font-size:0.82rem;">{{ unsubFlow.requireConfirm ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="col-md-4 col-sm-6 mb-3" v-if="unsubFlow.requireConfirm">
            <label class="config-label">Confirmation Prompt</label>
            <base-input v-model="unsubFlow.confirmPrompt" placeholder="Reply 1 to unsubscribe." :disabled="!unsubEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Grace Period (days)</label>
            <base-input v-model="unsubFlow.gracePeriod" type="number" placeholder="0" :disabled="!unsubEditMode"></base-input>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Callback URL <span class="locked-tag"><i class="tim-icons icon-lock-circle"></i> Read-only</span></label>
            <base-input v-model="unsubFlow.callbackUrl" placeholder="https://api.example.com/unsub" disabled></base-input>
          </div>
        </div>
      </card>
    </div>

    <!-- Direct Menu Landing -->
    <div class="col-12" v-if="activeFlowTab === 'direct'">
      <card class="accent-card accent-teal">
        <div class="config-card-header mb-3">
          <div>
            <h5 class="config-card-title">Direct Menu Landing</h5>
            <p class="config-card-sub text-muted">Configure the entry point users land on when dialing the main shortcode directly.</p>
          </div>
          <div class="d-flex" style="gap:8px;">
            <base-button v-if="!directEditMode" type="info" size="sm" @click="directEditMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="directEditMode = false">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveFlow('direct')">
                <i class="tim-icons icon-check-2 mr-1"></i> Save
              </base-button>
            </template>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Main Shortcode</label>
            <base-input v-model="directFlow.shortcode" placeholder="e.g. *384#" :disabled="!directEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Landing Type</label>
            <el-select v-model="directFlow.landingType" :disabled="!directEditMode" class="w-100">
              <el-option label="Main Menu" value="menu"></el-option>
              <el-option label="Direct Service" value="service"></el-option>
              <el-option label="Info Page" value="info"></el-option>
            </el-select>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Session Timeout (s)</label>
            <base-input v-model="directFlow.sessionTimeout" type="number" placeholder="120" :disabled="!directEditMode"></base-input>
          </div>
          <div class="col-12 mb-3">
            <label class="config-label">Landing Page Text</label>
            <textarea v-model="directFlow.landingText" class="ussd-textarea" rows="3" :disabled="!directEditMode" placeholder="Welcome to Sports Alerts!&#10;1. Latest Scores&#10;2. My Subscriptions&#10;3. Exit"></textarea>
            <small class="text-muted">{{ directFlow.landingText.length }}/182 characters (USSD limit)</small>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Fallback Message</label>
            <base-input v-model="directFlow.fallbackMsg" placeholder="Invalid input. Please try again." :disabled="!directEditMode"></base-input>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Gateway Endpoint <span class="locked-tag"><i class="tim-icons icon-lock-circle"></i> Read-only</span></label>
            <base-input v-model="directFlow.gatewayEndpoint" placeholder="https://gateway/ussd" disabled></base-input>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION: CUSTOM MENU BUILDER ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-puzzle-10 mr-2"></i> Custom Menu Builder</span>
        <base-button size="sm" type="primary" @click="addMenuItem">
          <i class="tim-icons icon-simple-add mr-1"></i> Add Menu Item
        </base-button>
      </div>
    </div>

    <div class="col-12">
      <card>
        <!-- Menu Preview Header -->
        <div class="menu-preview-header">
          <div class="menu-preview-phone">
            <div class="mpf-screen">
              <div class="mpf-title">{{ directFlow.shortcode || '*384#' }}</div>
              <div class="mpf-body">{{ directFlow.landingText || 'Welcome!\n1. Option A\n2. Option B' }}</div>
            </div>
          </div>
          <div class="menu-builder-list">
            <div class="mb-list-header">
              <span class="mb-col-num">#</span>
              <span class="mb-col-label">Menu Option Label</span>
              <span class="mb-col-action">Action / Route</span>
              <span class="mb-col-type">Type</span>
              <span class="mb-col-actions">Actions</span>
            </div>
            <draggable-list
              v-if="false"
            ></draggable-list>
            <div
              v-for="(item, idx) in menuItems"
              :key="item.id"
              class="mb-list-row"
              :class="{ 'mb-row-active': item.active }"
            >
              <span class="mb-col-num">
                <span class="mb-num-badge">{{ idx + 1 }}</span>
              </span>
              <span class="mb-col-label">
                <input v-model="item.label" class="mb-inline-input" placeholder="e.g. Latest Scores" />
              </span>
              <span class="mb-col-action">
                <input v-model="item.route" class="mb-inline-input" placeholder="e.g. /scores or submenu key" />
              </span>
              <span class="mb-col-type">
                <el-select v-model="item.type" size="mini" class="mb-type-select">
                  <el-option label="Submenu" value="submenu"></el-option>
                  <el-option label="API Call" value="api"></el-option>
                  <el-option label="End Session" value="end"></el-option>
                  <el-option label="Info Page" value="info"></el-option>
                </el-select>
              </span>
              <span class="mb-col-actions">
                <el-switch v-model="item.active" active-color="#18ce0f" inactive-color="#444" class="mr-2"></el-switch>
                <button class="mb-del-btn" @click="removeMenuItem(idx)">
                  <i class="tim-icons icon-simple-remove"></i>
                </button>
              </span>
            </div>
            <div v-if="menuItems.length === 0" class="mb-empty">
              No menu items yet. Click "Add Menu Item" to start building.
            </div>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION: SESSION MONITOR ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-align-center mr-2"></i> Live Session Monitor</span>
        <div class="d-flex align-items-center" style="gap:10px;">
          <span class="log-live-badge" :class="{ 'badge-live': isLive }">
            <span class="live-dot"></span> {{ isLive ? 'LIVE' : 'PAUSED' }}
          </span>
          <base-button size="sm" type="default" @click="toggleLive">
            <i :class="isLive ? 'tim-icons icon-button-pause' : 'tim-icons icon-button-play'"></i>
            {{ isLive ? 'Pause' : 'Resume' }}
          </base-button>
          <base-button size="sm" type="danger" @click="clearSessions">
            <i class="tim-icons icon-simple-remove"></i> Clear
          </base-button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <card card-body-classes="table-full-width">
        <el-table :data="liveSessions" style="width: 100%">
          <el-table-column min-width="150" sortable label="MSISDN" prop="msisdn">
            <template slot-scope="{ row }">
              <span class="mono-text">{{ row.msisdn }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" sortable label="Shortcode" prop="shortcode">
            <template slot-scope="{ row }">
              <span class="shortcode-tag">{{ row.shortcode }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="140" sortable label="Current Menu" prop="currentMenu">
          </el-table-column>
          <el-table-column min-width="100" sortable label="Duration" prop="duration">
            <template slot-scope="{ row }">
              {{ row.duration }}s
            </template>
          </el-table-column>
          <el-table-column min-width="110" sortable label="Status" prop="status">
            <template slot-scope="{ row }">
              <span class="sess-badge" :class="row.status === 'Active' ? 'sess-active' : row.status === 'Completed' ? 'sess-done' : 'sess-failed'">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="140" sortable label="Started At" prop="startedAt">
          </el-table-column>
          <el-table-column min-width="120" sortable label="Flow" prop="flow">
            <template slot-scope="{ row }">
              <span class="flow-tag" :class="row.flow === 'SUB' ? 'flow-sub' : row.flow === 'UNSUB' ? 'flow-unsub' : 'flow-direct'">
                {{ row.flow }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import { Table, TableColumn } from 'element-ui';

const SESSION_POOL = [
  { msisdn: '254712345678', shortcode: '*384#',   currentMenu: 'Main Menu',     flow: 'Direct', duration: 12,  status: 'Active',    startedAt: '' },
  { msisdn: '254798001122', shortcode: '*384*1#',  currentMenu: 'Sub Flow',      flow: 'SUB',    duration: 5,   status: 'Active',    startedAt: '' },
  { msisdn: '254700987654', shortcode: '*384*0#',  currentMenu: 'Unsub Confirm', flow: 'UNSUB',  duration: 18,  status: 'Active',    startedAt: '' },
  { msisdn: '254733445566', shortcode: '*384#',   currentMenu: 'Scores',        flow: 'Direct', duration: 34,  status: 'Completed', startedAt: '' },
  { msisdn: '254711223344', shortcode: '*384#',   currentMenu: 'Timeout',       flow: 'Direct', duration: 120, status: 'Failed',    startedAt: '' },
];

function now() {
  return new Date().toTimeString().slice(0, 8);
}

export default {
  name: 'UssdManagement',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Switch.name]: Switch,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      serviceRunning: true,
      showValidationBanner: true,
      isLive: true,
      activeFlowTab: 'sub',
      subEditMode: false,
      unsubEditMode: false,
      directEditMode: false,
      uptime: '6h 14m',
      uptimeSeconds: 22440,
      activeSessions: 3,
      successfulSessions: 18420,
      failedSessions: 342,
      avgDuration: 28,

      flowTabs: [
        { key: 'sub',    label: 'SUB Flow',    icon: 'icon-simple-add' },
        { key: 'unsub',  label: 'UNSUB Flow',  icon: 'icon-simple-remove' },
        { key: 'direct', label: 'Direct Landing', icon: 'icon-mobile' },
      ],

      config: {
        gatewayIp: '10.0.1.55',
        gatewayPort: 7080
      },

      subFlow: {
        shortcode: '*384*1#',
        serviceCode: 'SUB_SPORTS',
        confirmMsg: 'You are now subscribed to Sports Alerts!',
        welcomeMsg: 'Welcome! You will receive live match updates.',
        chargePoint: 'on_sub',
        doubleOptIn: true,
        optInPrompt: 'Reply 1 to confirm subscription.\nReply 2 to cancel.',
        callbackUrl: 'https://api.vasplatform.com/ussd/sub',
        timeout: 30
      },

      unsubFlow: {
        shortcode: '*384*0#',
        serviceCode: 'UNSUB_SPORTS',
        goodbyeMsg: 'You have been unsubscribed. We hope to see you back!',
        requireConfirm: true,
        confirmPrompt: 'Reply 1 to confirm unsubscription. Reply 2 to stay.',
        gracePeriod: 0,
        callbackUrl: 'https://api.vasplatform.com/ussd/unsub'
      },

      directFlow: {
        shortcode: '*384#',
        landingType: 'menu',
        sessionTimeout: 120,
        landingText: 'Welcome to Sports Alerts!\n1. Latest Scores\n2. My Subscriptions\n3. Fantasy Football\n4. Exit',
        fallbackMsg: 'Invalid input. Please try again.',
        gatewayEndpoint: 'https://gw.vasplatform.com/ussd/handler'
      },

      menuItems: [
        { id: 1, label: 'Latest Scores',      route: '/scores',      type: 'api',     active: true  },
        { id: 2, label: 'My Subscriptions',   route: '/subscriptions', type: 'submenu', active: true  },
        { id: 3, label: 'Fantasy Football',   route: '/fantasy',     type: 'api',     active: true  },
        { id: 4, label: 'Help',               route: '/help',        type: 'info',    active: true  },
        { id: 5, label: 'Exit',               route: 'END',          type: 'end',     active: true  },
      ],

      liveSessions: [],
      sessionInterval: null,
      uptimeInterval: null
    };
  },
  computed: {
    failRate() {
      const total = this.successfulSessions + this.failedSessions;
      return total ? ((this.failedSessions / total) * 100).toFixed(1) : '0.0';
    }
  },
  methods: {
    // ── Service ──
    startService() {
      this.serviceRunning = true;
      this.$notify({ type: 'success', message: 'USSD Service started.' });
    },
    stopService() {
      this.serviceRunning = false;
      this.$notify({ type: 'danger', message: 'USSD Service stopped.' });
    },
    restartService() {
      this.serviceRunning = false;
      this.$notify({ type: 'warning', message: 'Restarting USSD Service...' });
      setTimeout(() => {
        this.serviceRunning = true;
        this.uptimeSeconds = 0;
        this.$notify({ type: 'success', message: 'USSD Service restarted.' });
      }, 1500);
    },

    // ── Flow Save ──
    saveFlow(flow) {
      if (flow === 'sub')    this.subEditMode = false;
      if (flow === 'unsub')  this.unsubEditMode = false;
      if (flow === 'direct') this.directEditMode = false;
      this.$notify({ type: 'success', message: `${flow.toUpperCase()} flow configuration saved.` });
    },

    // ── Menu Builder ──
    addMenuItem() {
      this.menuItems.push({ id: Date.now(), label: '', route: '', type: 'submenu', active: true });
    },
    removeMenuItem(idx) {
      this.menuItems.splice(idx, 1);
    },

    // ── Session Monitor ──
    toggleLive() {
      this.isLive = !this.isLive;
      if (this.isLive) this.startSessionStream();
      else clearInterval(this.sessionInterval);
    },
    clearSessions() {
      this.liveSessions = [];
    },
    startSessionStream() {
      clearInterval(this.sessionInterval);
      this.sessionInterval = setInterval(() => {
        if (!this.isLive) return;
        const pool = SESSION_POOL[Math.floor(Math.random() * SESSION_POOL.length)];
        const statuses = ['Active', 'Active', 'Completed', 'Failed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        this.liveSessions.unshift({
          ...pool,
          id: Date.now(),
          status,
          duration: Math.floor(Math.random() * 120) + 3,
          startedAt: now()
        });
        if (this.liveSessions.length > 30) this.liveSessions.pop();
        // Update counters
        if (status === 'Completed') this.successfulSessions++;
        if (status === 'Failed')    this.failedSessions++;
        this.activeSessions = this.liveSessions.filter(s => s.status === 'Active').length;
      }, 2000);
    },
    startUptimeTick() {
      this.uptimeInterval = setInterval(() => {
        this.uptimeSeconds++;
        const h = Math.floor(this.uptimeSeconds / 3600);
        const m = Math.floor((this.uptimeSeconds % 3600) / 60);
        this.uptime = h > 0 ? `${h}h ${m}m` : `${m}m ${this.uptimeSeconds % 60}s`;
      }, 1000);
    }
  },
  mounted() {
    // Seed sessions
    SESSION_POOL.slice(0, 5).forEach((s, i) => {
      this.liveSessions.push({ ...s, id: i, startedAt: now() });
    });
    this.startSessionStream();
    this.startUptimeTick();
  },
  beforeDestroy() {
    clearInterval(this.sessionInterval);
    clearInterval(this.uptimeInterval);
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

/* ══ Service Status Pill ══ */
.service-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.pill-running { background: rgba(24,206,15,0.12); color: #18ce0f; border: 1px solid rgba(24,206,15,0.3); }
.pill-stopped { background: rgba(253,93,147,0.12); color: #fd5d93; border: 1px solid rgba(253,93,147,0.3); }
.pill-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.5s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

/* ══ Validation Banner ══ */
.validation-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 141, 114, 0.08);
  border: 1px solid rgba(255, 141, 114, 0.35);
  border-left: 4px solid #ff8d72;
  border-radius: 8px;
  padding: 14px 18px;
}
.vb-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.vb-icon {
  font-size: 1.4rem;
  color: #ff8d72;
  flex-shrink: 0;
  margin-top: 2px;
}
.vb-left strong { color: #ff8d72; font-size: 0.9rem; display: block; margin-bottom: 3px; }
.vb-sub { font-size: 0.82rem; color: #9a9a9a; }
.vb-close {
  background: none;
  border: none;
  color: #9a9a9a;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  margin-top: 2px;
}
.vb-close:hover { color: #fff; }

/* ══ Stat Cards ══ */
.stat-card .card-body { padding: 20px 20px 10px !important; }
.stat-card-body { display: flex; align-items: center; gap: 16px; }
.stat-icon-circle {
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon-circle i { font-size: 1.2rem; color: #fff; }
.stat-content { flex: 1; }
.stat-label { font-size: 0.75rem; color: #9a9a9a; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0; line-height: 1.2; }
.stat-footer { font-size: 0.78rem; color: #9a9a9a; padding-top: 8px; }

/* ══ Section Headings ══ */
.section-heading {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #9a9a9a;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 14px;
}

/* ══ Accent Cards ══ */
.accent-card { border-radius: 10px; }
.accent-purple { border-left: 3px solid #e14eca; }
.accent-red    { border-left: 3px solid #fd5d93; }
.accent-teal   { border-left: 3px solid #00f2c3; }
.accent-blue   { border-left: 3px solid #1d8cf8; }

/* ══ Config Card Header ══ */
.config-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}
.config-card-title { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 4px; }
.config-card-sub   { font-size: 0.82rem; margin: 0; }

/* ══ Config Labels ══ */
.config-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #9a9a9a;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.locked-tag {
  font-size: 0.65rem;
  color: #ff8d72;
  background: rgba(255,141,114,0.1);
  border: 1px solid rgba(255,141,114,0.25);
  border-radius: 4px;
  padding: 1px 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.locked-tag i { font-size: 0.6rem; }

/* ══ USSD Textarea ══ */
.ussd-textarea {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  color: #fff;
  padding: 10px 14px;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
  transition: border-color 0.2s;
  line-height: 1.6;
}
.ussd-textarea:focus { outline: none; border-color: #e14eca; }
.ussd-textarea:disabled { opacity: 0.5; cursor: not-allowed; }

/* ══ Flow Tabs ══ */
.flow-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 0;
}
.flow-tab-btn {
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  color: #9a9a9a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 9px 20px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.flow-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }
.flow-tab-active {
  background: rgba(225,78,202,0.1) !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: #e14eca !important;
  border-bottom-color: transparent !important;
}

/* ══ Service Controls ══ */
.service-btn { min-width: 100px; }
.service-meta { font-size: 0.78rem; color: #9a9a9a; margin-bottom: 0; }

/* ══ Session Bar Chart ══ */
.session-monitor-strip { padding: 0 8px; }
.sm-bar-wrap { width: 100%; }
.sm-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.sm-bar-track {
  display: flex;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255,255,255,0.06);
}
.sm-bar-fill { transition: width 0.6s ease; }
.sm-fill-success { background: linear-gradient(90deg, #00f2c3, #18ce0f); }
.sm-fill-failed  { background: linear-gradient(90deg, #fd5d93, #ec250d); }
.sm-bar-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 6px;
}
.sm-bar-total { font-size: 0.72rem; font-weight: 400; color: #9a9a9a; }

/* ══ Menu Builder ══ */
.menu-preview-header {
  display: flex;
  gap: 28px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.menu-preview-phone {
  flex-shrink: 0;
  width: 200px;
}
.mpf-screen {
  background: #0a0a14;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 14px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  min-height: 160px;
  white-space: pre-wrap;
  line-height: 1.7;
}
.mpf-title {
  color: #e14eca;
  font-weight: 700;
  font-size: 0.78rem;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 6px;
}
.mpf-body { color: #ccc; }

.menu-builder-list { flex: 1; min-width: 0; }
.mb-list-header {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 0 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #9a9a9a;
}
.mb-list-row {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
}
.mb-list-row:hover { background: rgba(255,255,255,0.02); border-radius: 4px; }
.mb-col-num    { width: 36px; flex-shrink: 0; text-align: center; }
.mb-col-label  { flex: 1.5; min-width: 0; }
.mb-col-action { flex: 1.5; min-width: 0; }
.mb-col-type   { width: 130px; flex-shrink: 0; }
.mb-col-actions{ width: 90px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
.mb-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: rgba(225,78,202,0.15);
  color: #e14eca;
  font-size: 0.72rem;
  font-weight: 700;
}
.mb-inline-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  color: #fff;
  font-size: 0.82rem;
  padding: 5px 10px;
  transition: border-color 0.2s;
}
.mb-inline-input:focus { outline: none; border-color: rgba(225,78,202,0.5); }
.mb-inline-input::placeholder { color: #555; }
.mb-type-select { width: 100% !important; }
.mb-type-select .el-input__inner {
  background: rgba(255,255,255,0.05) !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: #fff !important;
  height: 30px;
  line-height: 30px;
  padding: 0 8px;
}
.mb-del-btn {
  background: rgba(253,93,147,0.1);
  border: 1px solid rgba(253,93,147,0.25);
  border-radius: 5px;
  color: #fd5d93;
  cursor: pointer;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s;
}
.mb-del-btn:hover { background: rgba(253,93,147,0.2); }
.mb-empty {
  text-align: center;
  padding: 32px 0;
  color: #555;
  font-size: 0.85rem;
}

/* ══ Live Session Monitor ══ */
.log-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  border: 1px solid rgba(255,255,255,0.1);
  color: #9a9a9a;
}
.badge-live { background: rgba(24,206,15,0.1); color: #18ce0f; border-color: rgba(24,206,15,0.25); }
.live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1s infinite;
}

/* ══ Table Cells ══ */
.mono-text   { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #ccc; }
.shortcode-tag {
  background: rgba(29,140,248,0.12);
  color: #1d8cf8;
  border: 1px solid rgba(29,140,248,0.25);
  padding: 3px 10px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  font-weight: 600;
}
.sess-badge {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.sess-active { background: rgba(0,242,195,0.12); color: #00f2c3; border: 1px solid rgba(0,242,195,0.25); }
.sess-done   { background: rgba(225,78,202,0.12); color: #e14eca; border: 1px solid rgba(225,78,202,0.25); }
.sess-failed { background: rgba(253,93,147,0.12); color: #fd5d93; border: 1px solid rgba(253,93,147,0.25); }

.flow-tag {
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.flow-sub    { background: rgba(0,242,195,0.1); color: #00f2c3; border: 1px solid rgba(0,242,195,0.2); }
.flow-unsub  { background: rgba(253,93,147,0.1); color: #fd5d93; border: 1px solid rgba(253,93,147,0.2); }
.flow-direct { background: rgba(29,140,248,0.1); color: #1d8cf8; border: 1px solid rgba(29,140,248,0.2); }

/* ══ El-Select dark theme ══ */
.el-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }
.el-table th > .cell { white-space: nowrap; }
</style>