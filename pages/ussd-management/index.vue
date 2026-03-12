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
    <div class="col-12 mb-3" v-if="showValidationBanner">
      <div class="validation-banner">
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
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
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
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
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
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
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
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
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

    <!-- ══ SECTION 1: USSD GATEWAY CONFIGURATION (Change 3) ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-settings-gear-63 mr-2"></i> USSD Gateway Configuration
      </div>
    </div>

    <div class="col-12">
      <card class="accent-card accent-purple">
        <div class="row">
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">System ID</label>
            <base-input v-model="gateway.systemId" placeholder="e.g. ussd_client_01" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Password</label>
            <div class="password-wrap">
              <base-input v-model="gateway.password" :type="showGwPassword ? 'text' : 'password'" placeholder="••••••••" :disabled="!gwEditMode"></base-input>
              <button class="eye-btn" @click="showGwPassword = !showGwPassword" type="button">
                <i :class="showGwPassword ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Gateway IP Address</label>
            <base-input v-model="gateway.ip" placeholder="e.g. 10.0.1.55" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Port</label>
            <base-input v-model="gateway.port" type="number" placeholder="e.g. 7080" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Bind Type</label>
            <el-select v-model="gateway.bindType" :disabled="!gwEditMode" class="w-100">
              <el-option label="Transceiver (TRX)" value="transceiver"></el-option>
              <el-option label="Transmitter (TX)"  value="transmitter"></el-option>
              <el-option label="Receiver (RX)"     value="receiver"></el-option>
            </el-select>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">TPS (Throughput/sec)</label>
            <base-input v-model="gateway.tps" type="number" placeholder="e.g. 50" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Max Sessions</label>
            <base-input v-model="gateway.maxSessions" type="number" placeholder="e.g. 5" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">System Type</label>
            <base-input v-model="gateway.systemType" placeholder="e.g. USSD" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Enquire Link Timer (s)</label>
            <base-input v-model="gateway.enquireLinkTimer" type="number" placeholder="e.g. 30" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Reconnect Delay (s)</label>
            <base-input v-model="gateway.reconnectDelay" type="number" placeholder="e.g. 10" :disabled="!gwEditMode"></base-input>
          </div>
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Session Timeout (s)</label>
            <base-input v-model="gateway.sessionTimeout" type="number" placeholder="e.g. 120" :disabled="!gwEditMode"></base-input>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="text-muted" style="font-size:0.78rem;">
            <i class="tim-icons icon-refresh-02 mr-1"></i> Last saved: {{ lastSaved }}
            &nbsp;·&nbsp; Gateway: <strong class="text-info">{{ gateway.ip }}:{{ gateway.port }}</strong>
          </div>
          <div class="d-flex" style="gap:10px;">
            <base-button v-if="!gwEditMode" type="info" size="sm" @click="gwEditMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit Config
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="gwEditMode = false">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveGatewayConfig">
                <i class="tim-icons icon-check-2 mr-1"></i> Save Changes
              </base-button>
            </template>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION 2: SERVICE CONTROLS ══ -->
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
              <base-button type="success" :disabled="serviceRunning" @click="startService">
                <i class="tim-icons icon-button-play mr-2"></i> Start
              </base-button>
              <base-button type="danger" :disabled="!serviceRunning" @click="stopService">
                <i class="tim-icons icon-simple-remove mr-2"></i> Stop
              </base-button>
              <base-button type="warning" @click="restartService">
                <i class="tim-icons icon-refresh-02 mr-2"></i> Restart
              </base-button>
            </div>
            <p class="text-muted mt-2" style="font-size:0.78rem;">
              <i class="tim-icons icon-refresh-02 mr-1"></i>
              Uptime: <strong class="text-success">{{ uptime }}</strong>
            </p>
          </div>
          <div class="col-md-7">
            <div class="sm-bar-labels"><span class="text-success sm-bar-label">Successful</span><span class="text-danger sm-bar-label">Failed</span></div>
            <div class="sm-bar-track">
              <div class="sm-bar-fill sm-fill-success" :style="{ width: (successfulSessions / (successfulSessions + failedSessions) * 100) + '%' }"></div>
              <div class="sm-bar-fill sm-fill-failed"  :style="{ width: (failedSessions  / (successfulSessions + failedSessions) * 100) + '%' }"></div>
            </div>
            <div class="sm-bar-values">
              <span class="text-success">{{ successfulSessions.toLocaleString() }}</span>
              <span class="text-muted" style="font-size:0.72rem;">Total: {{ (successfulSessions + failedSessions).toLocaleString() }}</span>
              <span class="text-danger">{{ failedSessions.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION 3: FLOW CONFIGURATION (Change 1 + 2) ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-settings-gear-63 mr-2"></i> Flow Configuration</span>
        <base-button size="sm" type="primary" @click="addFlow">
          <i class="tim-icons icon-simple-add mr-1"></i> Add Flow
        </base-button>
      </div>
    </div>

    <!-- Flow Tabs — dynamic, all flows shown as tabs -->
    <div class="col-12 mb-3">
      <div class="flow-tabs">
        <button
          v-for="tab in allFlowTabs"
          :key="tab.key"
          class="flow-tab-btn"
          :class="{ 'flow-tab-active': activeFlowTab === tab.key }"
          @click="activeFlowTab = tab.key"
        >
          <span class="flow-tab-dot" :class="'dot-' + tab.color"></span>
          {{ tab.label }}
          <span v-if="tab.shortcode" class="flow-tab-sc">{{ tab.shortcode }}</span>
        </button>
      </div>
    </div>

    <!-- Dynamic Flow Editor — renders the active flow's config -->
    <div class="col-12" v-for="flow in allFlows" :key="flow.key" v-if="activeFlowTab === flow.key">
      <card :class="'accent-card accent-' + flow.color">
        <div class="config-card-header mb-3">
          <div>
            <div class="d-flex align-items-center" style="gap:10px; flex-wrap:wrap;">
              <h5 class="config-card-title mb-0">{{ flow.label }}</h5>
              <span class="flow-type-badge" :class="'ftb-' + flow.type">{{ flow.type }}</span>
            </div>
            <p class="config-card-sub text-muted mt-1">{{ flow.description }}</p>
          </div>
          <div class="d-flex" style="gap:8px; flex-shrink:0;">
            <base-button v-if="!flow.editMode" type="info" size="sm" @click="flow.editMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="flow.editMode = false">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveFlow(flow)">
                <i class="tim-icons icon-check-2 mr-1"></i> Save
              </base-button>
            </template>
            <base-button v-if="allFlows.length > 1" type="danger" size="sm" @click="deleteFlow(flow.key)">
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </div>

        <div class="row">
          <!-- Common fields -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Shortcode</label>
            <base-input v-model="flow.shortcode" placeholder="e.g. *345#" :disabled="!flow.editMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Flow Type</label>
            <el-select v-model="flow.type" :disabled="!flow.editMode" class="w-100" @change="flow.description = flowTypeDesc(flow.type)">
              <el-option label="SUB — Subscription"     value="SUB"></el-option>
              <el-option label="UNSUB — Unsubscription" value="UNSUB"></el-option>
              <el-option label="MENU — Direct Menu"     value="MENU"></el-option>
              <el-option label="INFO — Info / Static"   value="INFO"></el-option>
            </el-select>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Service Code</label>
            <base-input v-model="flow.serviceCode" placeholder="e.g. SUB_DAILY" :disabled="!flow.editMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Timeout (seconds)</label>
            <base-input v-model="flow.timeout" type="number" placeholder="30" :disabled="!flow.editMode"></base-input>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Charge Point</label>
            <el-select v-model="flow.chargePoint" :disabled="!flow.editMode" class="w-100">
              <el-option label="On Subscribe" value="on_sub"></el-option>
              <el-option label="On First Use" value="on_use"></el-option>
              <el-option label="Deferred"     value="deferred"></el-option>
              <el-option label="None"         value="none"></el-option>
            </el-select>
          </div>
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Double Opt-In</label>
            <div class="d-flex align-items-center mt-2" style="gap:10px;">
              <el-switch v-model="flow.doubleOptIn" :disabled="!flow.editMode" active-color="#18ce0f" inactive-color="#444"></el-switch>
              <span class="text-muted" style="font-size:0.82rem;">{{ flow.doubleOptIn ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>

          <!-- Landing / Display Text (Change 2 — direct menu text) -->
          <div class="col-12 mb-3">
            <label class="config-label">
              {{ flow.type === 'MENU' ? 'Menu Landing Text' : flow.type === 'INFO' ? 'Info Page Text' : 'Response / Confirmation Message' }}
            </label>
            <textarea v-model="flow.landingText" class="ussd-textarea" rows="4" :disabled="!flow.editMode"
              :placeholder="flow.type === 'MENU' ? 'Welcome!\n1. Latest Scores\n2. Subscribe\n3. Exit' : 'Your message here...'">
            </textarea>
            <small class="text-muted">{{ (flow.landingText || '').length }}/182 characters</small>
          </div>

          <!-- Change 2: Sub-menu routing rows (only for MENU type) -->
          <div class="col-12 mb-3" v-if="flow.type === 'MENU'">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="config-label mb-0">Menu Options &amp; Routes</label>
              <base-button size="sm" type="primary" @click="addMenuOption(flow)" :disabled="!flow.editMode">
                <i class="tim-icons icon-simple-add mr-1"></i> Add Option
              </base-button>
            </div>
            <div class="menu-route-list">
              <div class="mrl-header">
                <span class="mrl-key">Key</span>
                <span class="mrl-label">Display Label</span>
                <span class="mrl-target">Routes To (Shortcode / Action)</span>
                <span class="mrl-act">Del</span>
              </div>
              <div v-for="(opt, idx) in flow.menuOptions" :key="idx" class="mrl-row">
                <span class="mrl-key">
                  <input v-model="opt.key" class="mb-inline-input" placeholder="1" :disabled="!flow.editMode" style="width:42px; text-align:center;" />
                </span>
                <span class="mrl-label">
                  <input v-model="opt.label" class="mb-inline-input" placeholder="e.g. Latest Scores" :disabled="!flow.editMode" />
                </span>
                <span class="mrl-target">
                  <input v-model="opt.target" class="mb-inline-input" placeholder="e.g. *345*1# or END" :disabled="!flow.editMode" />
                </span>
                <span class="mrl-act">
                  <button class="mb-del-btn" @click="flow.menuOptions.splice(idx,1)" :disabled="!flow.editMode">
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
                </span>
              </div>
              <div v-if="!flow.menuOptions || flow.menuOptions.length === 0" class="mrl-empty">
                No options yet. Click "Add Option" to build the menu.
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="config-label">
              Callback URL <span class="locked-tag"><i class="tim-icons icon-lock-circle"></i> Read-only</span>
            </label>
            <base-input v-model="flow.callbackUrl" placeholder="https://api.example.com/ussd" disabled></base-input>
          </div>
          <div class="col-md-6 mb-3">
            <label class="config-label">Fallback Message</label>
            <base-input v-model="flow.fallbackMsg" placeholder="Invalid input. Please try again." :disabled="!flow.editMode"></base-input>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION 4: LIVE SESSION MONITOR (Change 4) ══ -->
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

    <!-- Session table -->
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <el-table
          :data="liveSessions"
          style="width:100%"
          row-key="id"
          :row-class-name="sessionRowClass"
          @row-click="openSessionDetail"
          class="clickable-rows"
        >
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
          <el-table-column min-width="130" sortable label="Flow" prop="flow">
            <template slot-scope="{ row }">
              <span class="flow-tag" :class="flowTagClass(row.flow)">{{ row.flow }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150" sortable label="Current Menu" prop="currentMenu"></el-table-column>
          <el-table-column min-width="90"  sortable label="Duration" prop="duration">
            <template slot-scope="{ row }">{{ row.duration }}s</template>
          </el-table-column>
          <el-table-column min-width="110" sortable label="Status" prop="status">
            <template slot-scope="{ row }">
              <span class="sess-badge" :class="sessBadgeClass(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" sortable label="Steps" prop="steps">
            <template slot-scope="{ row }">
              <span class="text-muted" style="font-size:0.8rem;">{{ row.steps }} input(s)</span>
            </template>
          </el-table-column>
          <el-table-column min-width="140" sortable label="Started At" prop="startedAt"></el-table-column>
          <el-table-column min-width="80" label="Detail" align="center">
            <template slot-scope="{ row }">
              <base-button size="sm" type="info" icon @click.stop="openSessionDetail(row)" title="View Journey">
                <i class="tim-icons icon-zoom-split"></i>
              </base-button>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>

    <!-- ══ SESSION DETAIL MODAL (Change 4) ══ -->
    <modal :show.sync="showSessionModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Session Journey</h4>
      <div v-if="selectedSession">

        <!-- Session Header -->
        <div class="sj-header mb-3">
          <div class="sj-header-row">
            <div class="sj-info-chip"><i class="tim-icons icon-mobile mr-1"></i>{{ selectedSession.msisdn }}</div>
            <div class="sj-info-chip"><span class="shortcode-tag">{{ selectedSession.shortcode }}</span></div>
            <div class="sj-info-chip"><span class="flow-tag" :class="flowTagClass(selectedSession.flow)">{{ selectedSession.flow }}</span></div>
            <div class="sj-info-chip"><span class="sess-badge" :class="sessBadgeClass(selectedSession.status)">{{ selectedSession.status }}</span></div>
          </div>
          <div class="sj-meta mt-2">
            <span><i class="tim-icons icon-time-alarm mr-1"></i>Duration: <strong>{{ selectedSession.duration }}s</strong></span>
            <span><i class="tim-icons icon-calendar-60 mr-1"></i>Started: <strong>{{ selectedSession.startedAt }}</strong></span>
            <span><i class="tim-icons icon-notes mr-1"></i>Steps: <strong>{{ selectedSession.steps }}</strong></span>
          </div>
        </div>

        <!-- Journey Timeline -->
        <div class="sj-timeline">
          <div class="sj-tl-title mb-2">Session Journey</div>
          <div
            v-for="(step, idx) in selectedSession.journey"
            :key="idx"
            class="sj-tl-item"
          >
            <div class="sj-tl-node" :class="'sjn-' + step.type"></div>
            <div class="sj-tl-content">
              <div class="sj-tl-label">
                <span class="sj-step-num">#{{ idx + 1 }}</span>
                <span class="sj-step-type" :class="'sst-' + step.type">{{ step.typeLabel }}</span>
                <span class="sj-step-time">{{ step.time }}</span>
              </div>
              <div class="sj-tl-body">
                <div v-if="step.prompt" class="sj-tl-prompt">
                  <i class="tim-icons icon-mobile mr-1" style="color:#9a9a9a;"></i>
                  <span>{{ step.prompt }}</span>
                </div>
                <div v-if="step.input" class="sj-tl-input">
                  <i class="tim-icons icon-send mr-1" style="color:#00f2c3;"></i>
                  User input: <strong class="text-info">{{ step.input }}</strong>
                </div>
                <div v-if="step.action" class="sj-tl-action">
                  <i class="tim-icons icon-settings-gear-63 mr-1" style="color:#e14eca;"></i>
                  {{ step.action }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Outcome -->
        <div class="sj-outcome mt-3" :class="'sjo-' + selectedSession.status.toLowerCase()">
          <i :class="selectedSession.status === 'Completed' ? 'tim-icons icon-check-2' : selectedSession.status === 'Failed' ? 'tim-icons icon-simple-remove' : 'tim-icons icon-time-alarm'" class="mr-2"></i>
          <strong>Session {{ selectedSession.status }}</strong>
          <span class="ml-2 text-muted" style="font-size:0.8rem;">{{ selectedSession.outcomeMsg }}</span>
        </div>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showSessionModal = false">Close</base-button>
      </template>
    </modal>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import Modal from '@/components/Modal';

const JOURNEY_POOL = {
  SUB: [
    { type: 'system', typeLabel: 'Session Start',   prompt: 'Dial received: *345*1#',                         input: null, action: 'Flow matched: SUB_DAILY', time: '' },
    { type: 'prompt', typeLabel: 'Menu Displayed',  prompt: 'Subscribe to Sports Alerts for KES 5/day?\n1. Yes\n2. No', input: null, action: null, time: '' },
    { type: 'input',  typeLabel: 'User Input',      prompt: null, input: '1', action: null, time: '' },
    { type: 'system', typeLabel: 'Processing',      prompt: null, input: null, action: 'Subscription request sent to billing engine', time: '' },
    { type: 'prompt', typeLabel: 'Confirmation',    prompt: 'You are now subscribed! Enjoy live scores.', input: null, action: null, time: '' },
    { type: 'system', typeLabel: 'Session End',     prompt: null, input: null, action: 'Session closed. Callback fired to /ussd/sub', time: '' },
  ],
  UNSUB: [
    { type: 'system', typeLabel: 'Session Start',   prompt: 'Dial received: *345*0#', input: null, action: 'Flow matched: UNSUB_SPORTS', time: '' },
    { type: 'prompt', typeLabel: 'Menu Displayed',  prompt: 'Are you sure you want to unsubscribe?\n1. Yes  2. No', input: null, action: null, time: '' },
    { type: 'input',  typeLabel: 'User Input',      prompt: null, input: '1', action: null, time: '' },
    { type: 'system', typeLabel: 'Processing',      prompt: null, input: null, action: 'Unsubscription confirmed. Billing updated.', time: '' },
    { type: 'prompt', typeLabel: 'Goodbye Message', prompt: 'You have been unsubscribed. We hope to see you back!', input: null, action: null, time: '' },
    { type: 'system', typeLabel: 'Session End',     prompt: null, input: null, action: 'Session closed. Callback fired to /ussd/unsub', time: '' },
  ],
  Direct: [
    { type: 'system', typeLabel: 'Session Start',   prompt: 'Dial received: *345#', input: null, action: 'Flow matched: MAIN_MENU', time: '' },
    { type: 'prompt', typeLabel: 'Main Menu',       prompt: 'Welcome!\n1. Latest Scores\n2. Subscribe\n3. My Account\n4. Exit', input: null, action: null, time: '' },
    { type: 'input',  typeLabel: 'User Input',      prompt: null, input: '1', action: null, time: '' },
    { type: 'system', typeLabel: 'Route',           prompt: null, input: null, action: 'Navigating to: Scores sub-menu (*345*1#)', time: '' },
    { type: 'prompt', typeLabel: 'Scores Menu',     prompt: 'Latest Scores:\n1. EPL\n2. UCL\n3. Back', input: null, action: null, time: '' },
    { type: 'input',  typeLabel: 'User Input',      prompt: null, input: '3', action: null, time: '' },
    { type: 'system', typeLabel: 'Session End',     prompt: null, input: null, action: 'User navigated back. Session timeout applied.', time: '' },
  ],
  MENU: [
    { type: 'system', typeLabel: 'Session Start',   prompt: 'Dial received: *345*2#', input: null, action: 'Flow matched: WEEKLY_MENU', time: '' },
    { type: 'prompt', typeLabel: 'Menu Displayed',  prompt: 'Weekly Sports Pack\n1. Subscribe Weekly\n2. View Benefits\n3. Back', input: null, action: null, time: '' },
    { type: 'input',  typeLabel: 'User Input',      prompt: null, input: '2', action: null, time: '' },
    { type: 'prompt', typeLabel: 'Info Page',       prompt: 'Weekly Pack: KES 30/week. Unlimited scores, alerts & fantasy.', input: null, action: null, time: '' },
    { type: 'system', typeLabel: 'Session End',     prompt: null, input: null, action: 'Session ended. No subscription change.', time: '' },
  ]
};

const OUTCOMES = {
  Completed: 'User journey completed successfully.',
  Failed:    'Session dropped — network timeout or invalid input.',
  Active:    'Session is currently in progress.'
};

function nowTime() { return new Date().toTimeString().slice(0, 8); }

function buildJourney(flow) {
  const pool = JOURNEY_POOL[flow] || JOURNEY_POOL['Direct'];
  const base = new Date();
  return pool.map((step, i) => ({
    ...step,
    time: new Date(base.getTime() + i * 4000).toTimeString().slice(0, 8)
  }));
}

const SESSION_POOL = [
  { msisdn: '254712345678', shortcode: '*345#',    flow: 'Direct', currentMenu: 'Main Menu',     steps: 3 },
  { msisdn: '254798001122', shortcode: '*345*1#',  flow: 'SUB',    currentMenu: 'Sub Flow',      steps: 2 },
  { msisdn: '254700987654', shortcode: '*345*0#',  flow: 'UNSUB',  currentMenu: 'Unsub Confirm', steps: 4 },
  { msisdn: '254733445566', shortcode: '*345#',    flow: 'Direct', currentMenu: 'Scores',        steps: 5 },
  { msisdn: '254711223344', shortcode: '*345*2#',  flow: 'MENU',   currentMenu: 'Weekly Menu',   steps: 2 },
];

export default {
  name: 'UssdManagement',
  components: {
    Modal,
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
      activeFlowTab: 'sub-daily',
      gwEditMode: false,
      showGwPassword: false,
      showSessionModal: false,
      selectedSession: null,
      lastSaved: '2025-03-07 10:42',
      uptime: '6h 14m',
      uptimeSeconds: 22440,
      activeSessions: 3,
      successfulSessions: 18420,
      failedSessions: 342,
      avgDuration: 28,

      // CHANGE 3: Gateway config
      gateway: {
        systemId: 'ussd_client_01',
        password: 'ussd_s3cr3t',
        ip: '10.0.1.55',
        port: 7080,
        bindType: 'transceiver',
        tps: 50,
        maxSessions: 5,
        systemType: 'USSD',
        enquireLinkTimer: 30,
        reconnectDelay: 10,
        sessionTimeout: 120
      },

      // CHANGE 1 & 2: Multiple flows, each with type + menu options
      allFlows: [
        {
          key: 'sub-daily', label: 'Daily SUB', color: 'teal', type: 'SUB', editMode: false,
          shortcode: '*345*1#', serviceCode: 'SUB_DAILY', timeout: 30, chargePoint: 'on_sub',
          doubleOptIn: true, callbackUrl: 'https://api.vasplatform.com/ussd/sub/daily',
          landingText: 'Subscribe to Sports Alerts (Daily)\nKES 5/day\n1. Subscribe\n2. Cancel',
          fallbackMsg: 'Invalid input. Please try again.', menuOptions: []
        },
        {
          key: 'sub-weekly', label: 'Weekly SUB', color: 'purple', type: 'SUB', editMode: false,
          shortcode: '*345*2#', serviceCode: 'SUB_WEEKLY', timeout: 30, chargePoint: 'on_sub',
          doubleOptIn: true, callbackUrl: 'https://api.vasplatform.com/ussd/sub/weekly',
          landingText: 'Subscribe to Sports Alerts (Weekly)\nKES 30/week\n1. Subscribe\n2. Cancel',
          fallbackMsg: 'Invalid input. Please try again.', menuOptions: []
        },
        {
          key: 'sub-tournament', label: 'Tournament SUB', color: 'blue', type: 'SUB', editMode: false,
          shortcode: '*345*3#', serviceCode: 'SUB_TOURNAMENT', timeout: 30, chargePoint: 'on_sub',
          doubleOptIn: false, callbackUrl: 'https://api.vasplatform.com/ussd/sub/tournament',
          landingText: 'Subscribe for UCL Tournament Coverage\nKES 99 one-off\n1. Subscribe\n2. Cancel',
          fallbackMsg: 'Invalid input. Please try again.', menuOptions: []
        },
        {
          key: 'unsub-all', label: 'UNSUB', color: 'red', type: 'UNSUB', editMode: false,
          shortcode: '*345*0#', serviceCode: 'UNSUB_SPORTS', timeout: 30, chargePoint: 'none',
          doubleOptIn: false, callbackUrl: 'https://api.vasplatform.com/ussd/unsub',
          landingText: 'Are you sure you want to unsubscribe?\n1. Yes, unsubscribe\n2. No, keep my subscription',
          fallbackMsg: 'Invalid input.', menuOptions: []
        },
        {
          key: 'main-menu', label: 'Main Menu', color: 'orange', type: 'MENU', editMode: false,
          shortcode: '*345#', serviceCode: 'MAIN_MENU', timeout: 120, chargePoint: 'none',
          doubleOptIn: false, callbackUrl: 'https://api.vasplatform.com/ussd/menu',
          landingText: 'Welcome to Sports Alerts!\n1. Latest Scores\n2. Subscribe Daily\n3. Subscribe Weekly\n4. My Account\n5. Exit',
          fallbackMsg: 'Invalid option. Please try again.',
          menuOptions: [
            { key: '1', label: 'Latest Scores',    target: '/scores' },
            { key: '2', label: 'Subscribe Daily',  target: '*345*1#' },
            { key: '3', label: 'Subscribe Weekly', target: '*345*2#' },
            { key: '4', label: 'My Account',       target: '/account' },
            { key: '5', label: 'Exit',             target: 'END' },
          ]
        },
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
    },
    allFlowTabs() {
      return this.allFlows.map(f => ({
        key: f.key,
        label: f.label,
        shortcode: f.shortcode,
        color: f.color
      }));
    }
  },
  methods: {
    flowTypeDesc(type) {
      const map = {
        SUB:   'Subscription flow triggered when user dials this shortcode.',
        UNSUB: 'Unsubscription flow — opt-out journey for users.',
        MENU:  'Direct menu landing — user lands on a navigable menu.',
        INFO:  'Static info page displayed on dial-in.'
      };
      return map[type] || '';
    },
    addFlow() {
      const key = 'flow-' + Date.now();
      this.allFlows.push({
        key, label: 'New Flow', color: 'blue', type: 'MENU', editMode: true,
        shortcode: '', serviceCode: '', timeout: 30, chargePoint: 'none',
        doubleOptIn: false, callbackUrl: '',
        landingText: '', fallbackMsg: 'Invalid input.', menuOptions: []
      });
      this.activeFlowTab = key;
    },
    deleteFlow(key) {
      const idx = this.allFlows.findIndex(f => f.key === key);
      if (idx !== -1) this.allFlows.splice(idx, 1);
      if (this.activeFlowTab === key && this.allFlows.length) {
        this.activeFlowTab = this.allFlows[0].key;
      }
    },
    saveFlow(flow) {
      flow.editMode = false;
      this.$notify({ type: 'success', message: `Flow "${flow.label}" saved.` });
    },
    addMenuOption(flow) {
      if (!flow.menuOptions) this.$set(flow, 'menuOptions', []);
      flow.menuOptions.push({ key: String(flow.menuOptions.length + 1), label: '', target: '' });
    },
    saveGatewayConfig() {
      this.gwEditMode = false;
      this.lastSaved = new Date().toLocaleString();
      this.$notify({ type: 'success', message: 'USSD Gateway configuration saved.' });
    },
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
      setTimeout(() => {
        this.serviceRunning = true;
        this.uptimeSeconds = 0;
        this.$notify({ type: 'success', message: 'USSD Service restarted.' });
      }, 1500);
    },
    toggleLive() {
      this.isLive = !this.isLive;
      if (this.isLive) this.startSessionStream();
      else clearInterval(this.sessionInterval);
    },
    clearSessions() { this.liveSessions = []; },
    sessionRowClass({ row }) {
      return row.status === 'Active' ? 'row-active' : '';
    },
    openSessionDetail(row) {
      this.selectedSession = {
        ...row,
        journey: buildJourney(row.flow),
        outcomeMsg: OUTCOMES[row.status] || ''
      };
      this.showSessionModal = true;
    },
    flowTagClass(flow) {
      if (flow === 'SUB')    return 'flow-sub';
      if (flow === 'UNSUB')  return 'flow-unsub';
      if (flow === 'MENU')   return 'flow-menu';
      return 'flow-direct';
    },
    sessBadgeClass(status) {
      return status === 'Active' ? 'sess-active' : status === 'Completed' ? 'sess-done' : 'sess-failed';
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
          steps: Math.floor(Math.random() * 6) + 1,
          startedAt: nowTime()
        });
        if (this.liveSessions.length > 30) this.liveSessions.pop();
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
    SESSION_POOL.slice(0, 5).forEach((s, i) => {
      const statuses = ['Active', 'Active', 'Completed', 'Failed'];
      this.liveSessions.push({
        ...s, id: i,
        status: statuses[i % statuses.length],
        duration: Math.floor(Math.random() * 80) + 5,
        steps: Math.floor(Math.random() * 5) + 1,
        startedAt: nowTime()
      });
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
/* ══ Base ══ */
.page-title { font-size: 1.75rem; font-weight: 600; color: #fff; }

/* ══ Service Status Pill ══ */
.service-status-pill { display:inline-flex; align-items:center; gap:7px; padding:6px 16px; border-radius:20px; font-size:0.75rem; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; }
.pill-running { background:rgba(24,206,15,0.12); color:#18ce0f; border:1px solid rgba(24,206,15,0.3); }
.pill-stopped { background:rgba(253,93,147,0.12); color:#fd5d93; border:1px solid rgba(253,93,147,0.3); }
.pill-dot { width:7px; height:7px; border-radius:50%; background:currentColor; animation:blink 1.5s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

/* ══ Validation Banner ══ */
.validation-banner { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; background:rgba(255,141,114,0.08); border:1px solid rgba(255,141,114,0.35); border-left:4px solid #ff8d72; border-radius:8px; padding:14px 18px; }
.vb-left { display:flex; align-items:flex-start; gap:14px; }
.vb-icon { font-size:1.4rem; color:#ff8d72; flex-shrink:0; margin-top:2px; }
.vb-left strong { color:#ff8d72; font-size:0.9rem; display:block; margin-bottom:3px; }
.vb-sub { font-size:0.82rem; color:#9a9a9a; }
.vb-close { background:none; border:none; color:#9a9a9a; cursor:pointer; padding:0; flex-shrink:0; }
.vb-close:hover { color:#fff; }

/* ══ Stat Cards ══ */
.stat-card { display:flex; flex-direction:column; height:100%; }
.stat-card .card-body { flex:1; padding:20px 20px 10px !important; }
.stat-card-body { display:flex; align-items:flex-start; gap:16px; }
.stat-icon-circle { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:3px; }
.stat-icon-circle i { font-size:1.2rem; color:#fff; }
.stat-content { flex:1; min-width:0; }
.stat-label { font-size:0.72rem; color:#9a9a9a; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px; white-space:normal; line-height:1.4; }
.stat-value { font-size:1.6rem; font-weight:700; color:#fff; margin:0; line-height:1.2; }
.stat-footer { font-size:0.78rem; color:#9a9a9a; padding-top:8px; }

/* ══ Section Headings ══ */
.section-heading { font-size:0.8rem; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#9a9a9a; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:14px; }

/* ══ Accent Cards ══ */
.accent-card { border-radius:10px; }
.accent-purple { border-left:3px solid #e14eca; }
.accent-red    { border-left:3px solid #fd5d93; }
.accent-teal   { border-left:3px solid #00f2c3; }
.accent-blue   { border-left:3px solid #1d8cf8; }
.accent-orange { border-left:3px solid #ff8d72; }

/* ══ Config ══ */
.config-card-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; }
.config-card-title  { font-size:1rem; font-weight:700; color:#fff; margin:0; }
.config-card-sub    { font-size:0.82rem; margin:0; }
.config-label { font-size:0.72rem; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:#9a9a9a; margin-bottom:5px; display:flex; align-items:center; gap:6px; }
.locked-tag { font-size:0.65rem; color:#ff8d72; background:rgba(255,141,114,0.1); border:1px solid rgba(255,141,114,0.25); border-radius:4px; padding:1px 6px; display:inline-flex; align-items:center; gap:3px; font-weight:600; }
.locked-tag i { font-size:0.6rem; }

/* ══ Password field ══ */
.password-wrap { position:relative; }
.eye-btn { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#9a9a9a; cursor:pointer; z-index:1; padding:0; }
.eye-btn:hover { color:#fff; }

/* ══ Flow Tabs ══ */
.flow-tabs { display:flex; gap:6px; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0; }
.flow-tab-btn { background:transparent; border:1px solid transparent; border-bottom:none; border-radius:8px 8px 0 0; color:#9a9a9a; font-size:0.8rem; font-weight:600; padding:8px 16px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
.flow-tab-btn:hover { color:#fff; background:rgba(255,255,255,0.04); }
.flow-tab-active { background:rgba(225,78,202,0.1) !important; border-color:rgba(255,255,255,0.1) !important; color:#e14eca !important; }
.flow-tab-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.dot-teal   { background:#00f2c3; }
.dot-purple { background:#e14eca; }
.dot-blue   { background:#1d8cf8; }
.dot-red    { background:#fd5d93; }
.dot-orange { background:#ff8d72; }
.flow-tab-sc { font-size:0.7rem; color:#555; font-family:'Courier New',monospace; background:rgba(255,255,255,0.05); padding:1px 6px; border-radius:4px; }

/* ══ Flow Type Badge ══ */
.flow-type-badge { font-size:0.68rem; font-weight:700; letter-spacing:0.8px; padding:2px 10px; border-radius:10px; text-transform:uppercase; }
.ftb-SUB   { background:rgba(0,242,195,0.1);  color:#00f2c3; border:1px solid rgba(0,242,195,0.25); }
.ftb-UNSUB { background:rgba(253,93,147,0.1); color:#fd5d93; border:1px solid rgba(253,93,147,0.25); }
.ftb-MENU  { background:rgba(255,141,114,0.1); color:#ff8d72; border:1px solid rgba(255,141,114,0.25); }
.ftb-INFO  { background:rgba(29,140,248,0.1);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.25); }

/* ══ USSD Textarea ══ */
.ussd-textarea { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:6px; color:#fff; padding:10px 14px; font-size:0.85rem; font-family:'Courier New',monospace; resize:vertical; transition:border-color 0.2s; line-height:1.6; }
.ussd-textarea:focus { outline:none; border-color:#e14eca; }
.ussd-textarea:disabled { opacity:0.5; cursor:not-allowed; }

/* ══ Menu Route List ══ */
.menu-route-list { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:8px; overflow:hidden; }
.mrl-header { display:flex; gap:10px; padding:8px 12px; background:rgba(255,255,255,0.04); font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#9a9a9a; }
.mrl-row    { display:flex; gap:10px; padding:8px 12px; align-items:center; border-top:1px solid rgba(255,255,255,0.04); transition:background 0.15s; }
.mrl-row:hover { background:rgba(255,255,255,0.03); }
.mrl-key    { width:60px; flex-shrink:0; }
.mrl-label  { flex:1.2; min-width:0; }
.mrl-target { flex:1.8; min-width:0; }
.mrl-act    { width:40px; flex-shrink:0; }
.mrl-empty  { text-align:center; padding:20px; color:#555; font-size:0.82rem; }

/* ══ Inline input ══ */
.mb-inline-input { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:5px; color:#fff; font-size:0.82rem; padding:5px 10px; transition:border-color 0.2s; }
.mb-inline-input:focus { outline:none; border-color:rgba(225,78,202,0.5); }
.mb-inline-input::placeholder { color:#555; }
.mb-inline-input:disabled { opacity:0.4; }
.mb-del-btn { background:rgba(253,93,147,0.1); border:1px solid rgba(253,93,147,0.25); border-radius:5px; color:#fd5d93; cursor:pointer; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:0.75rem; transition:all 0.2s; }
.mb-del-btn:hover { background:rgba(253,93,147,0.2); }
.mb-del-btn:disabled { opacity:0.3; cursor:not-allowed; }

/* ══ Service Controls Bar ══ */
.sm-bar-labels { display:flex; justify-content:space-between; font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
.sm-bar-track  { display:flex; height:10px; border-radius:6px; overflow:hidden; background:rgba(255,255,255,0.06); }
.sm-bar-fill   { transition:width 0.6s ease; }
.sm-fill-success { background:linear-gradient(90deg,#00f2c3,#18ce0f); }
.sm-fill-failed  { background:linear-gradient(90deg,#fd5d93,#ec250d); }
.sm-bar-values { display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:700; margin-top:6px; }

/* ══ Live Badge ══ */
.log-live-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:12px; font-size:0.7rem; font-weight:700; letter-spacing:1px; border:1px solid rgba(255,255,255,0.1); color:#9a9a9a; }
.badge-live { background:rgba(24,206,15,0.1); color:#18ce0f; border-color:rgba(24,206,15,0.25); }
.live-dot { width:6px; height:6px; border-radius:50%; background:currentColor; animation:blink 1s infinite; }

/* ══ Table Cells ══ */
.mono-text    { font-family:'Courier New',monospace; font-size:0.82rem; color:#ccc; }
.shortcode-tag { background:rgba(29,140,248,0.12); color:#1d8cf8; border:1px solid rgba(29,140,248,0.25); padding:3px 10px; border-radius:5px; font-family:'Courier New',monospace; font-size:0.78rem; font-weight:600; }
.sess-badge   { padding:4px 10px; border-radius:10px; font-size:0.7rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.sess-active  { background:rgba(0,242,195,0.12); color:#00f2c3; border:1px solid rgba(0,242,195,0.25); }
.sess-done    { background:rgba(225,78,202,0.12); color:#e14eca; border:1px solid rgba(225,78,202,0.25); }
.sess-failed  { background:rgba(253,93,147,0.12); color:#fd5d93; border:1px solid rgba(253,93,147,0.25); }
.flow-tag     { padding:3px 10px; border-radius:5px; font-size:0.72rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.flow-sub     { background:rgba(0,242,195,0.1);  color:#00f2c3; border:1px solid rgba(0,242,195,0.2); }
.flow-unsub   { background:rgba(253,93,147,0.1); color:#fd5d93; border:1px solid rgba(253,93,147,0.2); }
.flow-direct  { background:rgba(29,140,248,0.1);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.2); }
.flow-menu    { background:rgba(255,141,114,0.1); color:#ff8d72; border:1px solid rgba(255,141,114,0.2); }
.clickable-rows .el-table__row { cursor:pointer; }

/* ══ Session Journey Modal ══ */
.sj-header-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.sj-info-chip  { display:inline-flex; align-items:center; }
.sj-meta       { display:flex; gap:20px; flex-wrap:wrap; font-size:0.8rem; color:#9a9a9a; }
.sj-meta span  { display:flex; align-items:center; gap:4px; }

.sj-timeline   { border-left:2px solid rgba(255,255,255,0.08); padding-left:20px; margin-top:8px; }
.sj-tl-title   { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9a9a9a; }
.sj-tl-item    { position:relative; margin-bottom:18px; }
.sj-tl-node    { position:absolute; left:-27px; top:4px; width:12px; height:12px; border-radius:50%; border:2px solid; }
.sjn-system    { background:#1d8cf8; border-color:#1d8cf8; }
.sjn-prompt    { background:#e14eca; border-color:#e14eca; }
.sjn-input     { background:#00f2c3; border-color:#00f2c3; }
.sj-tl-label   { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.sj-step-num   { font-size:0.68rem; color:#555; font-weight:700; }
.sj-step-type  { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding:2px 8px; border-radius:8px; }
.sst-system    { background:rgba(29,140,248,0.12); color:#1d8cf8; border:1px solid rgba(29,140,248,0.2); }
.sst-prompt    { background:rgba(225,78,202,0.12); color:#e14eca; border:1px solid rgba(225,78,202,0.2); }
.sst-input     { background:rgba(0,242,195,0.12);  color:#00f2c3; border:1px solid rgba(0,242,195,0.2); }
.sj-step-time  { font-size:0.72rem; color:#555; font-family:'Courier New',monospace; margin-left:auto; }
.sj-tl-body    { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:10px 14px; display:flex; flex-direction:column; gap:6px; }
.sj-tl-prompt  { font-family:'Courier New',monospace; font-size:0.8rem; color:#ccc; white-space:pre-wrap; display:flex; gap:6px; }
.sj-tl-input   { font-size:0.82rem; color:#9a9a9a; display:flex; gap:6px; align-items:center; }
.sj-tl-action  { font-size:0.78rem; color:#9a9a9a; display:flex; gap:6px; align-items:center; }
.sj-outcome    { display:flex; align-items:center; padding:12px 16px; border-radius:8px; font-size:0.85rem; }
.sjo-completed { background:rgba(24,206,15,0.08);  border:1px solid rgba(24,206,15,0.2);  color:#18ce0f; }
.sjo-failed    { background:rgba(253,93,147,0.08); border:1px solid rgba(253,93,147,0.2); color:#fd5d93; }
.sjo-active    { background:rgba(0,242,195,0.08);  border:1px solid rgba(0,242,195,0.2);  color:#00f2c3; }

/* ══ El-Select dark ══ */
.el-select .el-input__inner { background-color:#1e1e2f !important; border-color:rgba(255,255,255,0.12) !important; color:#fff !important; border-radius:6px; }
.el-select .el-input__inner::placeholder { color:#9a9a9a !important; }
.el-select .el-input .el-select__caret  { color:#9a9a9a !important; }
.el-table th > .cell { white-space:nowrap; }
</style>