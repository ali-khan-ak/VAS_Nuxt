<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">IVR Management</h2>
          <p class="text-muted mb-0">SIP account configuration, service lifecycle controls & real-time IVR logs</p>
        </div>
        <div class="d-flex align-items-center" style="gap: 12px;">
          <span class="service-status-pill" :class="serviceRunning ? 'pill-running' : 'pill-stopped'">
            <span class="pill-dot"></span>
            {{ serviceRunning ? 'Service Running' : 'Service Stopped' }}
          </span>
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
            <p class="stat-label">Active Calls</p>
            <h3 class="stat-value">{{ activeCalls }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Live count
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
            <p class="stat-label">Calls Answered Today</p>
            <h3 class="stat-value">{{ answeredCalls.toLocaleString() }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up"></i> +6.1% from yesterday
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
            <p class="stat-label">Calls Failed Today</p>
            <h3 class="stat-value">{{ failedCalls.toLocaleString() }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc"></i> {{ failRate }}% fail rate
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
            <i class="tim-icons icon-time-alarm"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg. Call Duration</p>
            <h3 class="stat-value">{{ avgCallDuration }}s</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Uptime: {{ uptime }}
        </div>
      </card>
    </div>

    <!-- ══ SECTION 1: SIP ACCOUNT CONFIGURATION ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-settings-gear-63 mr-2"></i> SIP Account Configuration
      </div>
    </div>

    <div class="col-12">
      <card class="accent-card accent-purple">
        <div class="row">

          <!-- Username -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">SIP Username</label>
            <base-input
              v-model="sip.username"
              placeholder="e.g. ivr_gateway_01"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Password -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">SIP Password</label>
            <div class="password-wrap">
              <base-input
                v-model="sip.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="!editMode"
              ></base-input>
              <button class="eye-btn" @click="showPassword = !showPassword" type="button">
                <i :class="showPassword ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
              </button>
            </div>
          </div>

          <!-- SIP Server IP -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">SIP Server IP</label>
            <base-input
              v-model="sip.ip"
              placeholder="e.g. 192.168.10.50"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Port -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Port</label>
            <base-input
              v-model="sip.port"
              type="number"
              placeholder="e.g. 5060"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Transport -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Transport Protocol</label>
            <el-select v-model="sip.transport" :disabled="!editMode" class="w-100">
              <el-option label="UDP" value="UDP"></el-option>
              <el-option label="TCP" value="TCP"></el-option>
              <el-option label="TLS" value="TLS"></el-option>
            </el-select>
          </div>

          <!-- Codec -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Preferred Codec</label>
            <el-select v-model="sip.codec" :disabled="!editMode" class="w-100">
              <el-option label="G.711 (PCMU)" value="PCMU"></el-option>
              <el-option label="G.711 (PCMA)" value="PCMA"></el-option>
              <el-option label="G.729" value="G729"></el-option>
              <el-option label="G.722" value="G722"></el-option>
            </el-select>
          </div>

          <!-- Max Channels -->
          <div class="col-md-3 col-sm-6 mb-3">
            <label class="config-label">Max Concurrent Channels</label>
            <base-input
              v-model="sip.maxChannels"
              type="number"
              placeholder="e.g. 50"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Realm -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">SIP Realm / Domain</label>
            <base-input
              v-model="sip.realm"
              placeholder="e.g. sip.vasplatform.com"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Registration Expiry -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Registration Expiry (s)</label>
            <base-input
              v-model="sip.registrationExpiry"
              type="number"
              placeholder="e.g. 3600"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- DTMF Mode -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">DTMF Mode</label>
            <el-select v-model="sip.dtmfMode" :disabled="!editMode" class="w-100">
              <el-option label="RFC 2833" value="rfc2833"></el-option>
              <el-option label="In-Band" value="inband"></el-option>
              <el-option label="SIP INFO" value="sipinfo"></el-option>
            </el-select>
          </div>

          <!-- Media Server -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Media Server IP</label>
            <base-input
              v-model="sip.mediaServer"
              placeholder="e.g. 192.168.10.51"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Call Timeout -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Call Timeout (s)</label>
            <base-input
              v-model="sip.callTimeout"
              type="number"
              placeholder="e.g. 60"
              :disabled="!editMode"
            ></base-input>
          </div>

          <!-- Record Calls -->
          <div class="col-md-4 col-sm-6 mb-3">
            <label class="config-label">Call Recording</label>
            <div class="d-flex align-items-center mt-2" style="gap: 10px;">
              <el-switch
                v-model="sip.recordCalls"
                :disabled="!editMode"
                active-color="#18ce0f"
                inactive-color="#444"
              ></el-switch>
              <span class="text-muted" style="font-size: 0.82rem;">
                {{ sip.recordCalls ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>

        </div>

        <!-- Config Actions -->
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="config-meta text-muted">
            <i class="tim-icons icon-refresh-02 mr-1"></i>
            Last saved: {{ lastSaved }}
            &nbsp;·&nbsp;
            Registration: <span :class="sip.registered ? 'text-success' : 'text-danger'">
              {{ sip.registered ? 'Registered ✓' : 'Not Registered' }}
            </span>
          </div>
          <div class="d-flex" style="gap: 10px;">
            <base-button v-if="!editMode" type="info" size="sm" @click="startEdit">
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

    <!-- ══ SECTION 2: SERVICE CONTROLS ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading">
        <i class="tim-icons icon-button-play mr-2"></i> Service Controls
      </div>
    </div>

    <div class="col-12">
      <card class="accent-card accent-blue">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center" style="gap: 16px; flex-wrap: wrap;">
              <base-button
                type="success"
                :disabled="serviceRunning"
                @click="startService"
                class="service-btn"
              >
                <i class="tim-icons icon-button-play mr-2"></i> Start
              </base-button>
              <base-button
                type="danger"
                :disabled="!serviceRunning"
                @click="stopService"
                class="service-btn"
              >
                <i class="tim-icons icon-simple-remove mr-2"></i> Stop
              </base-button>
              <base-button
                type="warning"
                @click="restartService"
                class="service-btn"
              >
                <i class="tim-icons icon-refresh-02 mr-2"></i> Restart
              </base-button>
            </div>
            <p class="service-meta mt-2 text-muted">
              <i class="tim-icons icon-refresh-02 mr-1"></i>
              Uptime: <strong class="text-success">{{ uptime }}</strong>
              &nbsp;·&nbsp;
              SIP Server: <strong class="text-info">{{ sip.ip }}:{{ sip.port }}</strong>
              &nbsp;·&nbsp;
              Channels: <strong class="text-warning">{{ activeCalls }}/{{ sip.maxChannels }}</strong>
            </p>
          </div>
          <div class="col-md-6">
            <div class="service-stats-row">
              <div class="service-stat">
                <span class="sstat-label">Uptime</span>
                <span class="sstat-value text-success">{{ uptime }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Active Calls</span>
                <span class="sstat-value text-info">{{ activeCalls }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Channels Used</span>
                <span class="sstat-value text-warning">{{ activeCalls }}/{{ sip.maxChannels }}</span>
              </div>
              <div class="service-stat">
                <span class="sstat-label">Calls/min</span>
                <span class="sstat-value text-primary">{{ callsPerMin }}</span>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SECTION 3: LIVE IVR LOG VIEWER ══ -->
    <div class="col-12 mb-2 mt-3">
      <div class="section-heading d-flex justify-content-between align-items-center">
        <span><i class="tim-icons icon-align-center mr-2"></i> Live IVR Log Viewer</span>
        <div class="d-flex align-items-center" style="gap: 10px;">
          <span class="log-live-badge" :class="{ 'badge-live': isLive }">
            <span class="live-dot"></span> {{ isLive ? 'LIVE' : 'PAUSED' }}
          </span>
          <el-select v-model="logLevel" class="log-level-select" size="mini">
            <el-option label="All Levels" value="all"></el-option>
            <el-option label="INFO"  value="INFO"></el-option>
            <el-option label="WARN"  value="WARN"></el-option>
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
            <span class="log-channel" v-if="log.channel">[ch{{ log.channel }}]</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
          <div v-if="filteredLogs.length === 0" class="log-empty">
            No log entries match the current filter.
          </div>
        </div>
      </card>
    </div>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import { Table, TableColumn } from 'element-ui';

const LOG_POOL = [
  { level: 'INFO',  channel: 1,  message: 'INVITE received from 254712345678. Call-ID: a3f8b21c@192.168.10.50' },
  { level: 'INFO',  channel: 1,  message: '100 Trying sent. Routing to IVR flow: sports_main_menu' },
  { level: 'INFO',  channel: 1,  message: '200 OK sent. RTP stream established. Codec: G.711 PCMU' },
  { level: 'DEBUG', channel: 1,  message: 'DTMF digit received: 1. Routing to scores sub-menu.' },
  { level: 'INFO',  channel: 2,  message: 'INVITE received from 254798001122. Call-ID: d7e2a44f@192.168.10.50' },
  { level: 'INFO',  channel: 2,  message: 'Playing prompt: welcome_en.wav (3.2s)' },
  { level: 'DEBUG', channel: 2,  message: 'DTMF digit received: 2. Routing to subscriptions menu.' },
  { level: 'WARN',  channel: 3,  message: 'No DTMF input received within 10s. Replaying prompt.' },
  { level: 'INFO',  channel: 3,  message: 'Playing prompt: timeout_retry.wav' },
  { level: 'ERROR', channel: 4,  message: 'RTP stream lost. Call-ID: f1c9d03b@192.168.10.50. Terminating call.' },
  { level: 'INFO',  channel: 4,  message: 'BYE received. Call terminated. Duration: 42s' },
  { level: 'WARN',  channel: null, message: 'SIP registration expiry in 120s. Refreshing...' },
  { level: 'INFO',  channel: null, message: 'SIP re-REGISTER sent. Expiry: 3600s' },
  { level: 'INFO',  channel: null, message: '200 OK received for REGISTER. Registration refreshed.' },
  { level: 'DEBUG', channel: 5,  message: 'Media server ACK received. SSRC: 0x4a2f8b1c' },
  { level: 'ERROR', channel: 6,  message: '503 Service Unavailable from SIP proxy. Retrying in 5s.' },
  { level: 'INFO',  channel: 5,  message: 'Call completed successfully. Disconnect cause: Normal clearing (16)' },
  { level: 'WARN',  channel: null, message: 'Channel capacity at 80%. Active: 40/50 channels.' },
  { level: 'INFO',  channel: 7,  message: 'INVITE received from 254733445566. Playing IVR greeting.' },
  { level: 'DEBUG', channel: 7,  message: 'AGI script executed: /opt/ivr/scripts/main.agi' },
];

function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

export default {
  name: 'IvrManagement',
  components: {
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
      lastSaved: '2025-03-06 14:22:10',
      uptime: '9h 48m',
      uptimeSeconds: 35280,
      activeCalls: 7,
      answeredCalls: 12840,
      failedCalls: 218,
      avgCallDuration: 38,
      callsPerMin: 14,

      sip: {
        username: 'ivr_gateway_01',
        password: 'S!p@P4ssw0rd',
        ip: '192.168.10.50',
        port: 5060,
        transport: 'UDP',
        codec: 'PCMU',
        maxChannels: 50,
        realm: 'sip.vasplatform.com',
        registrationExpiry: 3600,
        dtmfMode: 'rfc2833',
        mediaServer: '192.168.10.51',
        callTimeout: 60,
        recordCalls: false,
        registered: true
      },
      sipBackup: null,

      logs: [],
      logInterval: null,
      uptimeInterval: null
    };
  },
  computed: {
    filteredLogs() {
      if (this.logLevel === 'all') return this.logs;
      return this.logs.filter(l => l.level === this.logLevel);
    },
    failRate() {
      const total = this.answeredCalls + this.failedCalls;
      return total ? ((this.failedCalls / total) * 100).toFixed(1) : '0.0';
    }
  },
  methods: {
    // ── Config ──
    startEdit() {
      this.sipBackup = { ...this.sip };
      this.editMode = true;
    },
    cancelEdit() {
      if (this.sipBackup) Object.assign(this.sip, this.sipBackup);
      this.editMode = false;
    },
    saveConfig() {
      this.editMode = false;
      this.lastSaved = new Date().toLocaleString();
      this.$notify({ type: 'success', message: 'SIP configuration saved successfully.' });
      this.addLog('INFO', null, `SIP config updated by admin. Server: ${this.sip.ip}:${this.sip.port}`);
    },

    // ── Service Controls ──
    startService() {
      this.serviceRunning = true;
      this.sip.registered = true;
      this.addLog('INFO',  null, `IVR service START requested. Registering with ${this.sip.ip}:${this.sip.port}...`);
      this.addLog('INFO',  null, `200 OK received. SIP registration successful. Expiry: ${this.sip.registrationExpiry}s`);
      this.addLog('INFO',  null, `IVR engine ready. Max channels: ${this.sip.maxChannels}`);
      this.$notify({ type: 'success', message: 'IVR Service started.' });
      this.startUptimeTick();
    },
    stopService() {
      this.serviceRunning = false;
      this.sip.registered = false;
      this.activeCalls = 0;
      this.addLog('WARN',  null, 'IVR service STOP requested. Gracefully terminating active calls...');
      this.addLog('INFO',  null, 'All channels released. SIP UNREGISTER sent.');
      this.$notify({ type: 'danger', message: 'IVR Service stopped.' });
      clearInterval(this.uptimeInterval);
    },
    restartService() {
      this.serviceRunning = false;
      this.sip.registered = false;
      this.addLog('WARN',  null, 'IVR service RESTART initiated. Flushing call queues...');
      this.$notify({ type: 'warning', message: 'Restarting IVR Service...' });
      setTimeout(() => {
        this.serviceRunning = true;
        this.sip.registered = true;
        this.uptimeSeconds = 0;
        this.addLog('INFO', null, 'IVR service restarted. Re-registering with SIP proxy...');
        this.addLog('INFO', null, '200 OK — SIP registration successful. Engine ready.');
        this.$notify({ type: 'success', message: 'IVR Service restarted successfully.' });
      }, 1800);
    },

    // ── Logs ──
    addLog(level, channel, message) {
      this.logs.push({ time: timestamp(), level, channel, message });
      if (this.logs.length > 300) this.logs.shift();
      this.$nextTick(() => {
        if (this.$refs.logViewer) {
          this.$refs.logViewer.scrollTop = this.$refs.logViewer.scrollHeight;
        }
      });
    },
    toggleLive() {
      this.isLive = !this.isLive;
      if (this.isLive) this.startLogStream();
      else clearInterval(this.logInterval);
    },
    clearLogs() {
      this.logs = [];
    },
    startLogStream() {
      clearInterval(this.logInterval);
      this.logInterval = setInterval(() => {
        if (!this.isLive || !this.serviceRunning) return;
        const entry = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
        this.addLog(entry.level, entry.channel, entry.message);
        // Fluctuate live stats
        this.activeCalls = Math.max(0, Math.min(this.sip.maxChannels, this.activeCalls + Math.floor(Math.random() * 3) - 1));
        this.callsPerMin = Math.floor(10 + Math.random() * 12);
        if (Math.random() > 0.7) this.answeredCalls++;
        if (Math.random() > 0.95) this.failedCalls++;
      }, 1400);
    },
    startUptimeTick() {
      clearInterval(this.uptimeInterval);
      this.uptimeInterval = setInterval(() => {
        this.uptimeSeconds++;
        const h = Math.floor(this.uptimeSeconds / 3600);
        const m = Math.floor((this.uptimeSeconds % 3600) / 60);
        const s = this.uptimeSeconds % 60;
        this.uptime = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
      }, 1000);
    }
  },
  mounted() {
    // Seed initial logs
    const seed = [
      { level: 'INFO',  channel: null, message: `IVR service started. SIP server: ${this.sip.ip}:${this.sip.port}` },
      { level: 'INFO',  channel: null, message: `REGISTER sent. Username: ${this.sip.username} | Realm: ${this.sip.realm}` },
      { level: 'INFO',  channel: null, message: `200 OK — SIP registration successful. Expiry: ${this.sip.registrationExpiry}s` },
      { level: 'INFO',  channel: null, message: `Codec negotiated: ${this.sip.codec} | DTMF: ${this.sip.dtmfMode} | Transport: ${this.sip.transport}` },
      { level: 'INFO',  channel: null, message: `IVR engine ready. Max channels: ${this.sip.maxChannels} | Call timeout: ${this.sip.callTimeout}s` },
      { level: 'DEBUG', channel: null, message: `Media server connected: ${this.sip.mediaServer}` },
    ];
    seed.forEach(e => this.addLog(e.level, e.channel, e.message));
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
.accent-card  { border-radius: 10px; }
.accent-purple { border-left: 3px solid #e14eca; }
.accent-blue   { border-left: 3px solid #1d8cf8; }

/* ══ Config Labels ══ */
.config-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #9a9a9a;
  margin-bottom: 5px;
  display: block;
}
.config-meta { font-size: 0.78rem; }

/* ══ Password Toggle ══ */
.password-wrap { position: relative; }
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
  z-index: 2;
}
.eye-btn:hover { color: #fff; }

/* ══ Service Controls ══ */
.service-btn  { min-width: 110px; }
.service-meta { font-size: 0.78rem; }
.service-stats-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.service-stat { display: flex; flex-direction: column; align-items: center; }
.sstat-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9a9a9a;
}
.sstat-value { font-size: 1.3rem; font-weight: 700; line-height: 1.3; }

/* ══ Log Viewer ══ */
.log-card { border-left: 3px solid #ff8d72; }
.log-viewer {
  background: #0a0a14;
  border-radius: 8px;
  padding: 14px 16px;
  height: 380px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.78rem;
  line-height: 1.75;
  scroll-behavior: smooth;
}
.log-viewer::-webkit-scrollbar { width: 5px; }
.log-viewer::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
.log-viewer::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }

.log-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255,255,255,0.025);
}
.log-line:last-child { border-bottom: none; }
.log-time    { color: #444; flex-shrink: 0; min-width: 68px; }
.log-channel { color: #555; flex-shrink: 0; min-width: 44px; font-size: 0.72rem; }

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
.tag-info  { background: rgba(29,140,248,0.18);  color: #1d8cf8; }
.tag-warn  { background: rgba(255,141,114,0.18); color: #ff8d72; }
.tag-error { background: rgba(253,93,147,0.18);  color: #fd5d93; }
.tag-debug { background: rgba(154,154,154,0.12); color: #666; }

.log-msg          { color: #bbb; word-break: break-all; flex: 1; }
.log-info  .log-msg { color: #ddd; }
.log-warn  .log-msg { color: #ff8d72; }
.log-error .log-msg { color: #fd5d93; }
.log-debug .log-msg { color: #555; }

.log-empty { color: #444; text-align: center; padding: 50px 0; font-size: 0.85rem; }

/* ══ Live Badge ══ */
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

/* ══ Log Level Select ══ */
.log-level-select { width: 120px !important; }
.log-level-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important;
  height: 32px;
  line-height: 32px;
}

/* ══ El-Select dark theme ══ */
.el-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-select .el-input__inner::placeholder { color: #9a9a9a !important; }
.el-select .el-input .el-select__caret  { color: #9a9a9a !important; }
</style>