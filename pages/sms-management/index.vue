<template>
  <div class="row">

    <!-- Page Header -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">SMS Management</h2>
          <p class="text-muted mb-0">SMPP configuration, service controls, live logs & routing rules</p>
        </div>
        <div class="d-flex align-items-center gap-12">
          <span class="service-status-pill" :class="serviceRunning ? 'pill-running' : 'pill-stopped'">
            <span class="pill-dot"></span>
            {{ serviceRunning ? 'Service Running' : 'Service Stopped' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── SECTION 1: SMPP Account Configuration ── -->
    <div class="col-12 mb-2">
      <div class="section-heading">
        <i class="tim-icons icon-settings-gear-63 mr-2"></i> SMPP Account Configuration
      </div>
    </div>

    <div class="col-12">
      <card class="smpp-config-card">
        <div class="row">
          <!-- System ID -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">System ID</label>
            <base-input
              v-model="smpp.systemId"
              placeholder="e.g. vas_client_01"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Password -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Password</label>
            <div class="password-wrap">
              <base-input
                v-model="smpp.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="!editMode"
                class="config-input"
              ></base-input>
              <button class="eye-btn" @click="showPassword = !showPassword" type="button">
                <i :class="showPassword ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
              </button>
            </div>
          </div>
          <!-- IP Address -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">SMSC IP Address</label>
            <base-input
              v-model="smpp.ip"
              placeholder="e.g. 192.168.1.100"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Port -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Port</label>
            <base-input
              v-model="smpp.port"
              type="number"
              placeholder="e.g. 2775"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Window Size -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Window Size</label>
            <base-input
              v-model="smpp.windowSize"
              type="number"
              placeholder="e.g. 10"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Bind Type -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Bind Type</label>
            <el-select v-model="smpp.bindType" :disabled="!editMode" class="w-100">
              <el-option label="Transceiver (TRX)" value="transceiver"></el-option>
              <el-option label="Transmitter (TX)" value="transmitter"></el-option>
              <el-option label="Receiver (RX)" value="receiver"></el-option>
            </el-select>
          </div>
          <!-- TPS -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">TPS (Throughput/sec)</label>
            <base-input
              v-model="smpp.tps"
              type="number"
              placeholder="e.g. 100"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Max Sessions -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Max Sessions</label>
            <base-input
              v-model="smpp.maxSessions"
              type="number"
              placeholder="e.g. 5"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- System Type -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">System Type</label>
            <base-input
              v-model="smpp.systemType"
              placeholder="e.g. VMA"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Enquire Link Timer -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Enquire Link Timer (s)</label>
            <base-input
              v-model="smpp.enquireLinkTimer"
              type="number"
              placeholder="e.g. 30"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
          <!-- Reconnect Delay -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Reconnect Delay (s)</label>
            <base-input
              v-model="smpp.reconnectDelay"
              type="number"
              placeholder="e.g. 10"
              :disabled="!editMode"
              class="config-input"
            ></base-input>
          </div>
        </div>

        <!-- Config Actions -->
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="smpp-meta text-muted">
            <i class="tim-icons icon-refresh-02 mr-1"></i>
            Last saved: {{ lastSaved }}
          </div>
          <div class="d-flex" style="gap: 10px;">
            <base-button v-if="!editMode" type="info" size="sm" @click="editMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit Config
            </base-button>
            <template v-else>
              <base-button type="default" size="sm" @click="cancelEdit">Cancel</base-button>
              <base-button type="success" size="sm" @click="saveConfig">
                <i class="tim-icons icon-check-2 mr-1"></i> Save Changes
              </base-button>
            </template>
          </div>
        </div>
      </card>
    </div>

    <!-- ── SECTION 2: Service Controls ── -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-button-play mr-2"></i> Service Controls
      </div>
    </div>

    <div class="col-12">
      <card class="service-control-card">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center" style="gap: 16px; flex-wrap: wrap;">

              <div class="service-btn-wrap">
                <base-button
                  type="success"
                  :disabled="serviceRunning"
                  @click="startService"
                  class="service-btn"
                >
                  <i class="tim-icons icon-button-play mr-2"></i> Start
                </base-button>
              </div>

              <div class="service-btn-wrap">
                <base-button
                  type="danger"
                  :disabled="!serviceRunning"
                  @click="stopService"
                  class="service-btn"
                >
                  <i class="tim-icons icon-simple-remove mr-2"></i> Stop
                </base-button>
              </div>

              <div class="service-btn-wrap">
                <base-button
                  type="warning"
                  @click="restartService"
                  class="service-btn"
                >
                  <i class="tim-icons icon-refresh-02 mr-2"></i> Restart
                </base-button>
              </div>

            </div>
          </div>
          <div class="col-md-6">
            <div class="service-stats-row">
              <div class="service-stat">
                <span class="sstat-label">Uptime</span>
                <span class="sstat-value text-success">{{ uptime }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Active Sessions</span>
                <span class="sstat-value text-info">{{ smpp.activeSessions }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Queue Depth</span>
                <span class="sstat-value text-warning">{{ queueDepth }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Messages/sec</span>
                <span class="sstat-value text-primary">{{ currentTps }}</span>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>

    <!-- ── SECTION 3: Live SMPP Log Viewer ── -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-align-center mr-2"></i> Live SMPP Log Viewer</span>
        <div class="d-flex align-items-center" style="gap:10px;">
          <span class="log-live-badge" :class="{ 'badge-live': isLive }">
            <span class="live-dot"></span> {{ isLive ? 'LIVE' : 'PAUSED' }}
          </span>
          <el-select v-model="logLevel" class="log-level-select" size="mini">
            <el-option label="All Levels" value="all"></el-option>
            <el-option label="INFO" value="INFO"></el-option>
            <el-option label="WARN" value="WARN"></el-option>
            <el-option label="ERROR" value="ERROR"></el-option>
            <el-option label="DEBUG" value="DEBUG"></el-option>
          </el-select>
          <base-button size="sm" type="default" @click="toggleLive">
            <i :class="isLive ? 'tim-icons icon-button-pause' : 'tim-icons icon-button-play'"></i>
            {{ isLive ? 'Pause' : 'Resume' }}
          </base-button>
          <base-button size="sm" type="danger" @click="clearLogs">
            <i class="tim-icons icon-simple-remove"></i> Clear
          </base-button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <card class="log-card">
        <div class="log-viewer" ref="logViewer">
          <div
            v-for="(log, idx) in filteredLogs"
            :key="idx"
            class="log-line"
            :class="`log-${log.level.toLowerCase()}`"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-level-tag" :class="`tag-${log.level.toLowerCase()}`">{{ log.level }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
          <div v-if="filteredLogs.length === 0" class="log-empty">
            No log entries match the current filter.
          </div>
        </div>
      </card>
    </div>

    <!-- ── SECTION 4: SMS Routing Rules ── -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-vector mr-2"></i> SMS Routing Rules</span>
        <base-button size="sm" type="primary" @click="openRuleModal">
          <i class="tim-icons icon-simple-add mr-1"></i> Add Rule
        </base-button>
      </div>
    </div>

    <div class="col-12">
      <card card-body-classes="table-full-width">
        <el-table :data="routingRules" style="width: 100%">

          <el-table-column min-width="130" sortable label="Shortcode" prop="shortcode">
            <template slot-scope="{ row }">
              <span class="shortcode-tag">{{ row.shortcode }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="140" sortable label="Keyword" prop="keyword">
            <template slot-scope="{ row }">
              <span class="keyword-tag">{{ row.keyword }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="150" sortable label="Route To" prop="routeTo">
          </el-table-column>

          <el-table-column min-width="130" sortable label="Service" prop="service">
          </el-table-column>

          <el-table-column min-width="100" sortable label="Priority" prop="priority">
            <template slot-scope="{ row }">
              <span class="priority-badge" :class="`priority-${row.priority.toLowerCase()}`">{{ row.priority }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="100" label="Status" prop="active">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.active"
                active-color="#18ce0f"
                inactive-color="#444"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column min-width="160" label="Actions" align="right" header-align="right">
            <template slot-scope="{ row }">
              <base-button size="sm" type="info" icon @click="editRule(row)" title="Edit">
                <i class="tim-icons icon-pencil"></i>
              </base-button>
              <base-button size="sm" type="danger" icon @click="deleteRule(row)" title="Delete">
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </template>
          </el-table-column>

        </el-table>
      </card>
    </div>

    <!-- ── Add / Edit Routing Rule Modal ── -->
    <modal :show.sync="showRuleModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">{{ editingRule ? 'Edit Routing Rule' : 'Add Routing Rule' }}</h4>
      <div class="row">
        <div class="col-md-6 mb-3">
          <base-input label="Shortcode" v-model="ruleForm.shortcode" placeholder="e.g. 20124"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <base-input label="Keyword" v-model="ruleForm.keyword" placeholder="e.g. SCORE (or * for all)"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <base-input label="Route To (Service URL / Handler)" v-model="ruleForm.routeTo" placeholder="e.g. http://handler/sms"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <base-input label="Service Name" v-model="ruleForm.service" placeholder="e.g. Sports Alerts"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <label class="control-label">Priority</label>
          <el-select v-model="ruleForm.priority" class="w-100">
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </div>
        <div class="col-md-6 mb-3 d-flex align-items-end">
          <div class="d-flex align-items-center" style="gap: 10px; padding-bottom: 10px;">
            <el-switch v-model="ruleForm.active" active-color="#18ce0f" inactive-color="#444"></el-switch>
            <span class="text-muted">{{ ruleForm.active ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showRuleModal = false">Cancel</base-button>
        <base-button type="primary" @click="saveRule">
          {{ editingRule ? 'Update Rule' : 'Add Rule' }}
        </base-button>
      </template>
    </modal>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import Modal from '@/components/Modal';

const LOG_POOL = [
  { level: 'INFO',  message: 'SMPP session bound successfully. System ID: vas_client_01' },
  { level: 'INFO',  message: 'submit_sm received. To: 254712345678 | Msg: "PL GW28 Alert"' },
  { level: 'INFO',  message: 'deliver_sm_resp sent. Seq: 1042 | Status: 0 (OK)' },
  { level: 'DEBUG', message: 'enquire_link sent. Waiting for enquire_link_resp...' },
  { level: 'DEBUG', message: 'enquire_link_resp received. Session alive.' },
  { level: 'INFO',  message: 'submit_sm received. To: 254798765432 | Msg: "Champions League Alert"' },
  { level: 'WARN',  message: 'TPS limit approaching threshold. Current: 94/100' },
  { level: 'INFO',  message: 'Message queued. Queue depth: 342' },
  { level: 'ERROR', message: 'submit_sm_resp error. Seq: 1089 | Status: 0x00000045 (Invalid dest addr)' },
  { level: 'INFO',  message: 'Reconnect attempt 1/5 to SMSC 192.168.1.100:2775' },
  { level: 'INFO',  message: 'Session re-bound. Active sessions: 3' },
  { level: 'WARN',  message: 'High queue depth detected: 820 messages pending' },
  { level: 'DEBUG', message: 'Window size check: 10/10 slots used' },
  { level: 'INFO',  message: 'Routing rule matched. Shortcode: 20124, Keyword: SCORE → Sports Alerts handler' },
  { level: 'ERROR', message: 'Connection timeout to SMSC. Retrying in 10s...' },
  { level: 'INFO',  message: 'submit_sm batch flushed. Count: 250 messages in 1.2s' },
];

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

export default {
  name: 'SmsManagement',
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
      editMode: false,
      showPassword: false,
      serviceRunning: true,
      isLive: true,
      logLevel: 'all',
      lastSaved: '2025-03-07 09:14:22',
      uptime: '14h 32m',
      queueDepth: 342,
      currentTps: 87,
      showRuleModal: false,
      editingRule: null,

      smpp: {
        systemId: 'vas_client_01',
        password: 'P@ssw0rd!',
        ip: '192.168.1.100',
        port: 2775,
        windowSize: 10,
        bindType: 'transceiver',
        tps: 100,
        maxSessions: 5,
        systemType: 'VMA',
        enquireLinkTimer: 30,
        reconnectDelay: 10,
        activeSessions: 3
      },
      smppBackup: null,

      logs: [],
      logInterval: null,
      uptimeInterval: null,
      uptimeSeconds: 52320,

      ruleForm: {
        shortcode: '',
        keyword: '',
        routeTo: '',
        service: '',
        priority: 'High',
        active: true
      },

      routingRules: [
        { id: 1, shortcode: '20124', keyword: 'SCORE',   routeTo: 'http://svc/sports/score',   service: 'Sports Alerts',    priority: 'High',   active: true  },
        { id: 2, shortcode: '20124', keyword: 'LIVE',    routeTo: 'http://svc/sports/live',    service: 'Live Updates',     priority: 'High',   active: true  },
        { id: 3, shortcode: '20200', keyword: 'SUB',     routeTo: 'http://svc/subscriptions',  service: 'Subscription Mgr', priority: 'Medium', active: true  },
        { id: 4, shortcode: '20200', keyword: 'UNSUB',   routeTo: 'http://svc/subscriptions',  service: 'Subscription Mgr', priority: 'Medium', active: true  },
        { id: 5, shortcode: '21000', keyword: '*',       routeTo: 'http://svc/default',        service: 'Default Handler',  priority: 'Low',    active: true  },
        { id: 6, shortcode: '20300', keyword: 'FANTASY', routeTo: 'http://svc/fantasy',        service: 'Fantasy Football', priority: 'High',   active: false },
      ]
    };
  },
  computed: {
    filteredLogs() {
      if (this.logLevel === 'all') return this.logs;
      return this.logs.filter(l => l.level === this.logLevel);
    }
  },
  methods: {
    // ── Config ──
    saveConfig() {
      this.editMode = false;
      this.lastSaved = new Date().toLocaleString();
      this.$notify({ type: 'success', message: 'SMPP configuration saved successfully.' });
    },
    cancelEdit() {
      if (this.smppBackup) Object.assign(this.smpp, this.smppBackup);
      this.editMode = false;
    },

    // ── Service Controls ──
    startService() {
      this.serviceRunning = true;
      this.addLog('INFO', 'Service START requested by admin. Binding to SMSC...');
      this.addLog('INFO', `Session bound. System ID: ${this.smpp.systemId}`);
      this.$notify({ type: 'success', message: 'SMS Service started.' });
      this.startUptimeTick();
    },
    stopService() {
      this.serviceRunning = false;
      this.addLog('WARN', 'Service STOP requested by admin. Unbinding sessions...');
      this.addLog('INFO', 'All sessions unbound. Service stopped.');
      this.$notify({ type: 'danger', message: 'SMS Service stopped.' });
      clearInterval(this.uptimeInterval);
    },
    restartService() {
      this.serviceRunning = false;
      this.addLog('WARN', 'Service RESTART initiated. Graceful shutdown...');
      this.$notify({ type: 'warning', message: 'Restarting SMS Service...' });
      setTimeout(() => {
        this.serviceRunning = true;
        this.uptimeSeconds = 0;
        this.addLog('INFO', 'Service restarted successfully. Re-binding sessions...');
        this.addLog('INFO', `Session bound. Active sessions: ${this.smpp.activeSessions}`);
        this.$notify({ type: 'success', message: 'SMS Service restarted.' });
      }, 1500);
    },

    // ── Logs ──
    addLog(level, message) {
      this.logs.push({ time: timestamp(), level, message });
      if (this.logs.length > 200) this.logs.shift();
      this.$nextTick(() => {
        if (this.$refs.logViewer) {
          this.$refs.logViewer.scrollTop = this.$refs.logViewer.scrollHeight;
        }
      });
    },
    toggleLive() {
      this.isLive = !this.isLive;
      if (this.isLive) {
        this.startLogStream();
      } else {
        clearInterval(this.logInterval);
      }
    },
    clearLogs() {
      this.logs = [];
    },
    startLogStream() {
      clearInterval(this.logInterval);
      this.logInterval = setInterval(() => {
        if (!this.isLive) return;
        const entry = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
        this.addLog(entry.level, entry.message);
      }, 1200);
    },

    // ── Uptime ──
    startUptimeTick() {
      clearInterval(this.uptimeInterval);
      this.uptimeInterval = setInterval(() => {
        this.uptimeSeconds++;
        const h = Math.floor(this.uptimeSeconds / 3600);
        const m = Math.floor((this.uptimeSeconds % 3600) / 60);
        const s = this.uptimeSeconds % 60;
        this.uptime = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
        // Simulate TPS fluctuation
        this.currentTps = Math.floor(70 + Math.random() * 30);
        this.queueDepth = Math.max(0, this.queueDepth + Math.floor((Math.random() * 20) - 10));
      }, 1000);
    },

    // ── Routing Rules ──
    openRuleModal() {
      this.editingRule = null;
      this.ruleForm = { shortcode: '', keyword: '', routeTo: '', service: '', priority: 'High', active: true };
      this.showRuleModal = true;
    },
    editRule(row) {
      this.editingRule = row;
      this.ruleForm = { ...row };
      this.showRuleModal = true;
    },
    saveRule() {
      if (!this.ruleForm.shortcode || !this.ruleForm.keyword) {
        this.$notify({ type: 'warning', message: 'Shortcode and Keyword are required.' });
        return;
      }
      if (this.editingRule) {
        Object.assign(this.editingRule, this.ruleForm);
        this.$notify({ type: 'success', message: 'Routing rule updated.' });
      } else {
        this.routingRules.push({ id: Date.now(), ...this.ruleForm });
        this.$notify({ type: 'success', message: 'Routing rule added.' });
      }
      this.showRuleModal = false;
    },
    deleteRule(row) {
      this.routingRules = this.routingRules.filter(r => r.id !== row.id);
      this.$notify({ type: 'danger', message: `Rule for ${row.shortcode}/${row.keyword} deleted.` });
    }
  },
  mounted() {
    // Seed initial logs
    const seed = [
      { level: 'INFO',  message: `SMPP service started. Binding to ${this.smpp.ip}:${this.smpp.port}` },
      { level: 'INFO',  message: `Session bound. System ID: ${this.smpp.systemId} | Bind: ${this.smpp.bindType}` },
      { level: 'DEBUG', message: `Window size: ${this.smpp.windowSize} | Max TPS: ${this.smpp.tps}` },
      { level: 'INFO',  message: `Active sessions: ${this.smpp.activeSessions}/${this.smpp.maxSessions}` },
      { level: 'INFO',  message: 'Routing rules loaded. 6 rules active.' },
    ];
    seed.forEach(e => this.addLog(e.level, e.message));
    this.startLogStream();
    this.startUptimeTick();
  },
  beforeDestroy() {
    clearInterval(this.logInterval);
    clearInterval(this.uptimeInterval);
  }
};
</script>

<style scoped>
/* ── Page Title ── */
.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
}

/* ── Service Status Pill ── */
.service-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.pill-running {
  background: rgba(24, 206, 15, 0.12);
  color: #18ce0f;
  border: 1px solid rgba(24, 206, 15, 0.3);
}
.pill-stopped {
  background: rgba(253, 93, 147, 0.12);
  color: #fd5d93;
  border: 1px solid rgba(253, 93, 147, 0.3);
}
.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ── Section Headings ── */
.section-heading {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #9a9a9a;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 14px;
}

/* ── SMPP Config Card ── */
.smpp-config-card {
  border-left: 3px solid #e14eca;
}
.config-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #9a9a9a;
  margin-bottom: 4px;
  display: block;
}
.password-wrap {
  position: relative;
}
.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9a9a9a;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.eye-btn:hover { color: #fff; }
.smpp-meta {
  font-size: 0.78rem;
}

/* ── Service Control Card ── */
.service-control-card {
  border-left: 3px solid #1d8cf8;
}
.service-btn {
  min-width: 110px;
}
.gap-12 { gap: 12px; }
.service-stats-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.service-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sstat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9a9a9a;
}
.sstat-value {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.3;
}

/* ── Log Viewer ── */
.log-card {
  border-left: 3px solid #ff8d72;
}
.log-viewer {
  background: #0d0d1a;
  border-radius: 8px;
  padding: 14px 16px;
  height: 320px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  scroll-behavior: smooth;
}
.log-viewer::-webkit-scrollbar {
  width: 5px;
}
.log-viewer::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
}
.log-viewer::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
}
.log-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.log-line:last-child { border-bottom: none; }
.log-time {
  color: #555;
  flex-shrink: 0;
  min-width: 68px;
}
.log-level-tag {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  min-width: 48px;
  text-align: center;
}
.tag-info  { background: rgba(29, 140, 248, 0.2); color: #1d8cf8; }
.tag-warn  { background: rgba(255, 141, 114, 0.2); color: #ff8d72; }
.tag-error { background: rgba(253, 93, 147, 0.2);  color: #fd5d93; }
.tag-debug { background: rgba(154, 154, 154, 0.15); color: #9a9a9a; }

.log-msg { color: #ccc; word-break: break-all; }
.log-info  .log-msg { color: #ddd; }
.log-warn  .log-msg { color: #ff8d72; }
.log-error .log-msg { color: #fd5d93; }
.log-debug .log-msg { color: #666; }

.log-empty {
  color: #555;
  text-align: center;
  padding: 40px 0;
}

/* ── Live badge ── */
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
.badge-live {
  background: rgba(24, 206, 15, 0.1);
  color: #18ce0f;
  border-color: rgba(24, 206, 15, 0.25);
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1s infinite;
}

/* ── Log level select ── */
.log-level-select {
  width: 120px !important;
}
.log-level-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.15) !important;
  color: #fff !important;
  height: 32px;
  line-height: 32px;
}

/* ── Routing Rules ── */
.shortcode-tag {
  background: rgba(29, 140, 248, 0.15);
  color: #1d8cf8;
  border: 1px solid rgba(29, 140, 248, 0.3);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}
.keyword-tag {
  background: rgba(225, 78, 202, 0.12);
  color: #e14eca;
  border: 1px solid rgba(225, 78, 202, 0.25);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}
.priority-badge {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.priority-high   { background: rgba(253,93,147,0.15); color: #fd5d93; border: 1px solid rgba(253,93,147,0.3); }
.priority-medium { background: rgba(255,141,114,0.15); color: #ff8d72; border: 1px solid rgba(255,141,114,0.3); }
.priority-low    { background: rgba(154,154,154,0.1); color: #9a9a9a; border: 1px solid rgba(154,154,154,0.2); }

/* ── El-Select dark theme ── */
.el-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.15) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }

/* ── Table headers no-wrap ── */
.el-table th > .cell {
  white-space: nowrap;
}
</style>