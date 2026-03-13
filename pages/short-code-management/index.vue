<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">Shortcode Management</h2>
          <p class="text-muted mb-0">Configure IVR and SMS shortcodes for outbound services</p>
        </div>
        <div class="d-flex align-items-center" style="gap:10px;">
          <base-button type="primary" size="sm" @click="openAddServiceModal">
            <i class="tim-icons icon-simple-add mr-1"></i> Add Service
          </base-button>
        </div>
      </div>
    </div>

    <!-- ══ STAT CARDS ══ -->
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#e14eca,#ba54f5);">
            <i class="tim-icons icon-bullet-list-67"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Services</p>
            <h3 class="stat-value">{{ services.length }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-check-2 text-success"></i>&nbsp;{{ activeServiceCount }} active
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#1d8cf8,#3358f4);">
            <i class="tim-icons icon-chat-33"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">SMS Shortcodes</p>
            <h3 class="stat-value">{{ smsShortcodeCount }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-send"></i>&nbsp;Outbound configured
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#00bf9a,#00f2c3);">
            <i class="tim-icons icon-headphones"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">IVR Shortcodes</p>
            <h3 class="stat-value">{{ ivrShortcodeCount }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-button-play"></i>&nbsp;Outbound configured
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#fd5d93,#ec250d);">
            <i class="tim-icons icon-alert-circle-exc"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Misconfigured</p>
            <h3 class="stat-value">{{ misconfiguredCount }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc text-warning"></i>&nbsp;Needs attention
        </div>
      </card>
    </div>

    <!-- ══ SEARCH / FILTER BAR ══ -->
    <div class="col-12 mb-3 mt-3">
      <card class="sub-filter-card">
        <div class="row align-items-center">
          <div class="col-md-3 mb-2 mb-md-0">
            <base-input v-model="search" placeholder="Search service name…" addon-left-icon="tim-icons icon-zoom-split"></base-input>
          </div>
          <div class="col-md-3 mb-2 mb-md-0">
            <el-select v-model="typeFilter" placeholder="Filter by Type" class="w-100">
              <el-option label="All Types" value=""></el-option>
              <el-option label="SMS"  value="SMS"></el-option>
              <el-option label="IVR"  value="IVR"></el-option>
              <el-option label="Both" value="Both"></el-option>
            </el-select>
          </div>
          <div class="col-md-3 mb-2 mb-md-0">
            <el-select v-model="statusFilter" placeholder="Filter by Status" class="w-100">
              <el-option label="All Statuses" value=""></el-option>
              <el-option label="Active"       value="Active"></el-option>
              <el-option label="Inactive"     value="Inactive"></el-option>
            </el-select>
          </div>
          <div class="col-md-3 text-right">
            <span class="filter-result-count">{{ filteredServices.length }} services</span>
          </div>
        </div>
      </card>
    </div>

    <!-- ══ SERVICE CARDS ══ -->
    <div class="col-12" v-for="service in filteredServices" :key="service.id">
      <card class="service-card" :class="'sc-' + service.color">

        <!-- ── Service Header ── -->
        <div class="sc-header">
          <div class="sc-header-left">
            <div class="sc-icon" :class="'sci-' + service.color">
              <i :class="`tim-icons ${service.icon}`"></i>
            </div>
            <div>
              <div class="d-flex align-items-center" style="gap:10px; flex-wrap:wrap;">
                <h5 class="sc-name">{{ service.name }}</h5>
                <span class="sc-type-badge" :class="'stb-' + service.type.toLowerCase().replace(' ','')">{{ service.type }}</span>
                <span class="status-badge" :class="service.active ? 'badge-success' : 'badge-default'">
                  {{ service.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <p class="sc-desc text-muted">{{ service.description }}</p>
            </div>
          </div>
          <div class="sc-header-right">
            <el-switch v-model="service.active" active-color="#18ce0f" inactive-color="#444" class="mr-2"></el-switch>
            <base-button size="sm" type="danger" icon @click="deleteService(service)" title="Delete Service">
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </div>

        <!-- ── Three Configurations ── -->
        <div class="row mt-3">

          <!-- Config 1: SMS Outbound Shortcode -->
          <div class="col-lg-4 col-md-6 mb-3">
            <div class="config-block config-sms">
              <div class="cb-header">
                <div class="cb-icon-wrap cb-sms">
                  <i class="tim-icons icon-chat-33"></i>
                </div>
                <div>
                  <div class="cb-title">SMS Outbound Shortcode</div>
                  <div class="cb-subtitle">Shortcode used to send outbound SMS for this service</div>
                </div>
                <div class="cb-edit-btn" @click="toggleEdit(service, 'sms')" :class="{ 'cb-editing': service.editing.sms }">
                  <i :class="service.editing.sms ? 'tim-icons icon-check-2' : 'tim-icons icon-pencil'"></i>
                </div>
              </div>

              <div class="cb-body">
                <div class="cb-field">
                  <label class="cb-label">Shortcode / Sender ID</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.sms }">
                    <i class="tim-icons icon-chat-33 sc-input-icon"></i>
                    <input
                      v-model="service.sms.shortcode"
                      class="sc-input"
                      :disabled="!service.editing.sms"
                      placeholder="e.g. 20124"
                    />
                  </div>
                </div>
                <div class="cb-field">
                  <label class="cb-label">Display Name</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.sms }">
                    <i class="tim-icons icon-single-02 sc-input-icon"></i>
                    <input
                      v-model="service.sms.displayName"
                      class="sc-input"
                      :disabled="!service.editing.sms"
                      placeholder="e.g. VAS Alerts"
                    />
                  </div>
                </div>
                <div class="cb-field">
                  <label class="cb-label">Provider Route</label>
                  <el-select v-model="service.sms.route" :disabled="!service.editing.sms" class="w-100">
                    <el-option label="Primary Route"   value="primary"></el-option>
                    <el-option label="Secondary Route" value="secondary"></el-option>
                    <el-option label="Fallback Route"  value="fallback"></el-option>
                  </el-select>
                </div>
                <div class="cb-status-row">
                  <span class="cb-status-dot" :class="service.sms.shortcode ? 'dot-ok' : 'dot-warn'"></span>
                  <span class="cb-status-text" :class="service.sms.shortcode ? 'text-success' : 'text-warning'">
                    {{ service.sms.shortcode ? 'Configured — ' + service.sms.shortcode : 'Not configured' }}
                  </span>
                </div>
              </div>

              <div class="cb-footer" v-if="service.editing.sms">
                <base-button size="sm" type="default" @click="cancelEdit(service, 'sms')">Cancel</base-button>
                <base-button size="sm" type="success" @click="saveConfig(service, 'sms')">
                  <i class="tim-icons icon-check-2 mr-1"></i> Save
                </base-button>
              </div>
            </div>
          </div>

          <!-- Config 2: IVR Outbound Shortcode -->
          <div class="col-lg-4 col-md-6 mb-3">
            <div class="config-block config-ivr">
              <div class="cb-header">
                <div class="cb-icon-wrap cb-ivr">
                  <i class="tim-icons icon-headphones"></i>
                </div>
                <div>
                  <div class="cb-title">IVR Outbound Shortcode</div>
                  <div class="cb-subtitle">Caller ID / DID used for outbound IVR calls</div>
                </div>
                <div class="cb-edit-btn" @click="toggleEdit(service, 'ivr')" :class="{ 'cb-editing': service.editing.ivr }">
                  <i :class="service.editing.ivr ? 'tim-icons icon-check-2' : 'tim-icons icon-pencil'"></i>
                </div>
              </div>

              <div class="cb-body">
                <div class="cb-field">
                  <label class="cb-label">Caller ID / DID Number</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.ivr }">
                    <i class="tim-icons icon-headphones sc-input-icon"></i>
                    <input
                      v-model="service.ivr.callerId"
                      class="sc-input"
                      :disabled="!service.editing.ivr"
                      placeholder="e.g. +254711000001"
                    />
                  </div>
                </div>
                <div class="cb-field">
                  <label class="cb-label">Display Name</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.ivr }">
                    <i class="tim-icons icon-single-02 sc-input-icon"></i>
                    <input
                      v-model="service.ivr.displayName"
                      class="sc-input"
                      :disabled="!service.editing.ivr"
                      placeholder="e.g. Sports Alerts"
                    />
                  </div>
                </div>
                <div class="cb-field">
                  <label class="cb-label">SIP Trunk</label>
                  <el-select v-model="service.ivr.trunk" :disabled="!service.editing.ivr" class="w-100">
                    <el-option label="Primary SIP Trunk"   value="primary"></el-option>
                    <el-option label="Secondary SIP Trunk" value="secondary"></el-option>
                    <el-option label="PSTN Fallback"       value="pstn"></el-option>
                  </el-select>
                </div>
                <div class="cb-status-row">
                  <span class="cb-status-dot" :class="service.ivr.callerId ? 'dot-ok' : 'dot-warn'"></span>
                  <span class="cb-status-text" :class="service.ivr.callerId ? 'text-success' : 'text-warning'">
                    {{ service.ivr.callerId ? 'Configured — ' + service.ivr.callerId : 'Not configured' }}
                  </span>
                </div>
              </div>

              <div class="cb-footer" v-if="service.editing.ivr">
                <base-button size="sm" type="default" @click="cancelEdit(service, 'ivr')">Cancel</base-button>
                <base-button size="sm" type="success" @click="saveConfig(service, 'ivr')">
                  <i class="tim-icons icon-check-2 mr-1"></i> Save
                </base-button>
              </div>
            </div>
          </div>

          <!-- Config 3: Service Settings -->
          <div class="col-lg-4 col-md-12 mb-3">
            <div class="config-block config-settings">
              <div class="cb-header">
                <div class="cb-icon-wrap cb-settings">
                  <i class="tim-icons icon-settings-gear-63"></i>
                </div>
                <div>
                  <div class="cb-title">Service Settings</div>
                  <div class="cb-subtitle">Priority, retry logic and billing configuration</div>
                </div>
                <div class="cb-edit-btn" @click="toggleEdit(service, 'settings')" :class="{ 'cb-editing': service.editing.settings }">
                  <i :class="service.editing.settings ? 'tim-icons icon-check-2' : 'tim-icons icon-pencil'"></i>
                </div>
              </div>

              <div class="cb-body">
                <div class="cb-field">
                  <label class="cb-label">Service Priority</label>
                  <el-select v-model="service.settings.priority" :disabled="!service.editing.settings" class="w-100">
                    <el-option label="High"   value="high"></el-option>
                    <el-option label="Normal" value="normal"></el-option>
                    <el-option label="Low"    value="low"></el-option>
                  </el-select>
                </div>
                <div class="cb-field">
                  <label class="cb-label">Max Retries</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.settings }">
                    <i class="tim-icons icon-refresh-02 sc-input-icon"></i>
                    <input
                      v-model="service.settings.maxRetries"
                      class="sc-input"
                      type="number"
                      :disabled="!service.editing.settings"
                      placeholder="e.g. 3"
                    />
                  </div>
                </div>
                <div class="cb-field">
                  <label class="cb-label">Billing Code</label>
                  <div class="sc-input-wrap" :class="{ 'sc-input-active': service.editing.settings }">
                    <i class="tim-icons icon-coins sc-input-icon"></i>
                    <input
                      v-model="service.settings.billingCode"
                      class="sc-input"
                      :disabled="!service.editing.settings"
                      placeholder="e.g. BIL_SPORTS_01"
                    />
                  </div>
                </div>
                <!-- Priority indicator -->
                <div class="cb-status-row">
                  <span class="cb-status-dot"
                    :class="service.settings.priority === 'high' ? 'dot-high' : service.settings.priority === 'normal' ? 'dot-ok' : 'dot-low'">
                  </span>
                  <span class="cb-status-text"
                    :class="service.settings.priority === 'high' ? 'text-danger' : service.settings.priority === 'normal' ? 'text-success' : 'text-muted'">
                    {{ { high:'High priority', normal:'Normal priority', low:'Low priority' }[service.settings.priority] || 'Not set' }}
                    · {{ service.settings.maxRetries }} retr{{ service.settings.maxRetries == 1 ? 'y' : 'ies' }}
                  </span>
                </div>
              </div>

              <div class="cb-footer" v-if="service.editing.settings">
                <base-button size="sm" type="default" @click="cancelEdit(service, 'settings')">Cancel</base-button>
                <base-button size="sm" type="success" @click="saveConfig(service, 'settings')">
                  <i class="tim-icons icon-check-2 mr-1"></i> Save
                </base-button>
              </div>
            </div>
          </div>

        </div>
      </card>
    </div>

    <!-- Empty state -->
    <div class="col-12" v-if="filteredServices.length === 0">
      <card>
        <div class="empty-state">
          <i class="tim-icons icon-bullet-list-67 empty-icon"></i>
          <p class="empty-title">No services found</p>
          <p class="text-muted" style="font-size:0.85rem;">Try adjusting your filters or add a new service.</p>
          <base-button type="primary" size="sm" @click="openAddServiceModal">
            <i class="tim-icons icon-simple-add mr-1"></i> Add Service
          </base-button>
        </div>
      </card>
    </div>

    <!-- ══ ADD SERVICE MODAL ══ -->
    <modal :show.sync="showAddModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Add New Service</h4>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="config-label">Service Name</label>
          <base-input v-model="newService.name" placeholder="e.g. Sports Alerts"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Service Type</label>
          <el-select v-model="newService.type" class="w-100">
            <el-option label="SMS Only"  value="SMS"></el-option>
            <el-option label="IVR Only"  value="IVR"></el-option>
            <el-option label="SMS + IVR" value="Both"></el-option>
          </el-select>
        </div>
        <div class="col-12 mb-3">
          <label class="config-label">Description</label>
          <base-input v-model="newService.description" placeholder="Brief description of this service…"></base-input>
        </div>
        <div class="col-md-6 mb-3" v-if="newService.type === 'SMS' || newService.type === 'Both'">
          <label class="config-label">SMS Shortcode</label>
          <base-input v-model="newService.smsShortcode" placeholder="e.g. 20124"></base-input>
        </div>
        <div class="col-md-6 mb-3" v-if="newService.type === 'IVR' || newService.type === 'Both'">
          <label class="config-label">IVR Caller ID</label>
          <base-input v-model="newService.ivrCallerId" placeholder="e.g. +254711000001"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Service Priority</label>
          <el-select v-model="newService.priority" class="w-100">
            <el-option label="High"   value="high"></el-option>
            <el-option label="Normal" value="normal"></el-option>
            <el-option label="Low"    value="low"></el-option>
          </el-select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Billing Code</label>
          <base-input v-model="newService.billingCode" placeholder="e.g. BIL_SERVICE_01"></base-input>
        </div>
        <div class="col-12">
          <div class="d-flex align-items-center" style="gap:10px;">
            <el-switch v-model="newService.active" active-color="#18ce0f" inactive-color="#444"></el-switch>
            <span class="text-muted" style="font-size:0.82rem;">Activate service immediately after creation</span>
          </div>
        </div>
      </div>

      <template slot="footer">
        <base-button type="default" @click="showAddModal = false">Cancel</base-button>
        <base-button type="success" @click="addService">
          <i class="tim-icons icon-check-2 mr-1"></i> Add Service
        </base-button>
      </template>
    </modal>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import Modal from '@/components/Modal';

const COLOR_CYCLE = ['purple','blue','teal','orange','red','pink'];
const ICON_CYCLE  = ['icon-send','icon-headphones','icon-mobile','icon-chat-33','icon-bullet-list-67'];

function emptyEditing() { return { sms: false, ivr: false, settings: false }; }
function emptySnapshot(service) {
  return {
    sms:      { ...service.sms },
    ivr:      { ...service.ivr },
    settings: { ...service.settings },
  };
}

export default {
  name: 'ShortcodeManagement',
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Switch.name]: Switch,
  },
  data() {
    return {
      search: '', typeFilter: '', statusFilter: '',
      showAddModal: false,

      newService: {
        name:'', type:'Both', description:'',
        smsShortcode:'', ivrCallerId:'',
        priority:'normal', billingCode:'', active:true
      },

      services: [
        {
          id:1, name:'Sports Alerts', type:'Both', color:'purple',
          icon:'icon-send', active:true,
          description:'Daily sports score alerts — Premier League, UCL & La Liga outbound campaigns',
          sms:      { shortcode:'20124',         displayName:'SPORTS',       route:'primary' },
          ivr:      { callerId:'+254711000001',  displayName:'Sports Alerts', trunk:'primary' },
          settings: { priority:'high',   maxRetries:3, billingCode:'BIL_SPORTS_01' },
          editing: emptyEditing(), _snapshot: null
        },
        {
          id:2, name:'Fantasy Football', type:'SMS', color:'blue',
          icon:'icon-chat-33', active:true,
          description:'Weekly fantasy football tips and reminder SMS campaigns',
          sms:      { shortcode:'20200',  displayName:'FANTASY',      route:'primary' },
          ivr:      { callerId:'',        displayName:'',              trunk:'primary' },
          settings: { priority:'normal', maxRetries:2, billingCode:'BIL_FANTASY_01' },
          editing: emptyEditing(), _snapshot: null
        },
        {
          id:3, name:'Match Day OBD', type:'IVR', color:'teal',
          icon:'icon-headphones', active:true,
          description:'Outbound IVR calls for live match scores and pre-match alerts',
          sms:      { shortcode:'',        displayName:'',             route:'primary' },
          ivr:      { callerId:'+254722000002', displayName:'Match Day', trunk:'primary' },
          settings: { priority:'high',   maxRetries:3, billingCode:'BIL_OBD_MATCH_01' },
          editing: emptyEditing(), _snapshot: null
        },
        {
          id:4, name:'UCL Tournament Pack', type:'Both', color:'orange',
          icon:'icon-bullet-list-67', active:false,
          description:'Champions League tournament coverage — SMS alerts + IVR highlights',
          sms:      { shortcode:'21000',          displayName:'UCL PACK',   route:'secondary' },
          ivr:      { callerId:'+254733000003',   displayName:'UCL Alerts', trunk:'secondary' },
          settings: { priority:'normal', maxRetries:2, billingCode:'BIL_UCL_01' },
          editing: emptyEditing(), _snapshot: null
        },
        {
          id:5, name:'Subscription Renewals', type:'SMS', color:'red',
          icon:'icon-refresh-02', active:true,
          description:'Automated SMS reminders for subscription renewals and billing alerts',
          sms:      { shortcode:'',  displayName:'', route:'primary' },
          ivr:      { callerId:'',   displayName:'', trunk:'primary' },
          settings: { priority:'low', maxRetries:1, billingCode:'' },
          editing: emptyEditing(), _snapshot: null
        },
      ],
    };
  },
  computed: {
    activeServiceCount()  { return this.services.filter(s => s.active).length; },
    smsShortcodeCount()   { return this.services.filter(s => s.sms.shortcode).length; },
    ivrShortcodeCount()   { return this.services.filter(s => s.ivr.callerId).length; },
    misconfiguredCount() {
      return this.services.filter(s =>
        s.active && (
          (s.type === 'SMS'  && !s.sms.shortcode) ||
          (s.type === 'IVR'  && !s.ivr.callerId)  ||
          (s.type === 'Both' && (!s.sms.shortcode || !s.ivr.callerId))
        )
      ).length;
    },
    filteredServices() {
      const q = this.search.toLowerCase();
      return this.services.filter(s =>
        (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
        && (!this.typeFilter   || s.type   === this.typeFilter)
        && (!this.statusFilter || (this.statusFilter === 'Active' ? s.active : !s.active))
      );
    }
  },
  methods: {
    toggleEdit(service, key) {
      if (!service.editing[key]) {
        // entering edit — snapshot current values
        service._snapshot = service._snapshot || {};
        service._snapshot[key] = JSON.parse(JSON.stringify(service[key]));
        service.editing[key] = true;
      } else {
        // clicking the check icon = save
        this.saveConfig(service, key);
      }
    },
    cancelEdit(service, key) {
      if (service._snapshot && service._snapshot[key]) {
        Object.assign(service[key], service._snapshot[key]);
      }
      service.editing[key] = false;
    },
    saveConfig(service, key) {
      service.editing[key] = false;
      const label = { sms:'SMS Shortcode', ivr:'IVR Caller ID', settings:'Service Settings' }[key];
      this.$notify({ type:'success', message:`${label} saved for "${service.name}".` });
    },
    deleteService(service) {
      this.services = this.services.filter(s => s.id !== service.id);
      this.$notify({ type:'danger', message:`Service "${service.name}" deleted.` });
    },
    openAddServiceModal() {
      this.newService = { name:'', type:'Both', description:'', smsShortcode:'', ivrCallerId:'', priority:'normal', billingCode:'', active:true };
      this.showAddModal = true;
    },
    addService() {
      if (!this.newService.name) {
        this.$notify({ type:'warning', message:'Service name is required.' }); return;
      }
      const colorIdx = this.services.length % COLOR_CYCLE.length;
      const iconIdx  = this.services.length % ICON_CYCLE.length;
      this.services.push({
        id: Date.now(),
        name:        this.newService.name,
        type:        this.newService.type,
        description: this.newService.description,
        color:       COLOR_CYCLE[colorIdx],
        icon:        ICON_CYCLE[iconIdx],
        active:      this.newService.active,
        sms:      { shortcode: this.newService.smsShortcode, displayName:'', route:'primary' },
        ivr:      { callerId:  this.newService.ivrCallerId,  displayName:'', trunk:'primary' },
        settings: { priority: this.newService.priority, maxRetries:3, billingCode: this.newService.billingCode },
        editing: emptyEditing(), _snapshot: null
      });
      this.$notify({ type:'success', message:`Service "${this.newService.name}" created.` });
      this.showAddModal = false;
    }
  }
};
</script>

<style scoped>
/* ══ Base ══ */
.page-title { font-size:1.75rem; font-weight:600; color:#fff; }

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

/* ══ Filter Bar ══ */
.sub-filter-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:14px 18px; }
.filter-result-count { font-size:0.82rem; color:#9a9a9a; font-weight:600; }
.config-label { font-size:0.72rem; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:#9a9a9a; margin-bottom:5px; display:flex; align-items:center; gap:6px; }

/* ══ Service Card ══ */
.service-card { border-radius:10px; margin-bottom:4px; }
.sc-purple { border-left:4px solid #e14eca; }
.sc-blue   { border-left:4px solid #1d8cf8; }
.sc-teal   { border-left:4px solid #00f2c3; }
.sc-orange { border-left:4px solid #ff8d72; }
.sc-red    { border-left:4px solid #fd5d93; }
.sc-pink   { border-left:4px solid #ba54f5; }

.sc-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; }
.sc-header-left  { display:flex; align-items:flex-start; gap:14px; flex:1; min-width:0; }
.sc-header-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }

.sc-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sc-icon i { font-size:1.1rem; color:#fff; }
.sci-purple  { background:rgba(225,78,202,0.2); }
.sci-blue    { background:rgba(29,140,248,0.2); }
.sci-teal    { background:rgba(0,242,195,0.15); }
.sci-orange  { background:rgba(255,141,114,0.2); }
.sci-red     { background:rgba(253,93,147,0.2); }
.sci-pink    { background:rgba(186,84,245,0.2); }

.sc-name { font-size:1.05rem; font-weight:700; color:#fff; margin:0; }
.sc-desc { font-size:0.78rem; margin:3px 0 0; line-height:1.4; }

/* ══ Service Type Badge ══ */
.sc-type-badge { font-size:0.65rem; font-weight:700; letter-spacing:0.8px; padding:2px 9px; border-radius:8px; text-transform:uppercase; }
.stb-sms  { background:rgba(29,140,248,0.12);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.25); }
.stb-ivr  { background:rgba(0,242,195,0.1);    color:#00f2c3; border:1px solid rgba(0,242,195,0.2); }
.stb-both { background:rgba(225,78,202,0.12);  color:#e14eca; border:1px solid rgba(225,78,202,0.25); }

/* ══ Status Badge ══ */
.status-badge  { padding:3px 9px; border-radius:10px; font-size:0.66rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.badge-success { background:rgba(24,206,15,0.12);   color:#18ce0f; border:1px solid rgba(24,206,15,0.25); }
.badge-default { background:rgba(255,255,255,0.07); color:#9a9a9a; border:1px solid rgba(255,255,255,0.12); }

/* ══ Config Block ══ */
.config-block {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:10px;
  overflow:hidden;
  height:100%;
  display:flex;
  flex-direction:column;
  transition:border-color 0.2s;
}
.config-sms:hover      { border-color:rgba(29,140,248,0.3); }
.config-ivr:hover      { border-color:rgba(0,242,195,0.3); }
.config-settings:hover { border-color:rgba(225,78,202,0.3); }

.cb-header {
  display:flex;
  align-items:flex-start;
  gap:10px;
  padding:14px 14px 10px;
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.cb-icon-wrap {
  width:34px; height:34px; border-radius:8px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.cb-icon-wrap i { font-size:0.9rem; color:#fff; }
.cb-sms      { background:rgba(29,140,248,0.18); }
.cb-ivr      { background:rgba(0,242,195,0.15); }
.cb-settings { background:rgba(225,78,202,0.15); }

.cb-title    { font-size:0.82rem; font-weight:700; color:#fff; line-height:1.2; }
.cb-subtitle { font-size:0.7rem; color:#9a9a9a; margin-top:2px; line-height:1.3; }

.cb-edit-btn {
  margin-left:auto;
  width:28px; height:28px;
  border-radius:6px;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  color:#9a9a9a;
  font-size:0.75rem;
  flex-shrink:0;
  transition:all 0.2s;
}
.cb-edit-btn:hover { background:rgba(255,255,255,0.1); color:#fff; }
.cb-editing { background:rgba(24,206,15,0.15) !important; border-color:rgba(24,206,15,0.3) !important; color:#18ce0f !important; }

.cb-body { padding:14px; flex:1; display:flex; flex-direction:column; gap:10px; }
.cb-field { display:flex; flex-direction:column; gap:4px; }
.cb-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9a9a9a; }

/* ══ Shortcode Input ══ */
.sc-input-wrap {
  display:flex;
  align-items:center;
  gap:8px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:6px;
  padding:7px 10px;
  transition:border-color 0.2s;
}
.sc-input-active { border-color:rgba(225,78,202,0.4) !important; background:rgba(225,78,202,0.05) !important; }
.sc-input-icon { font-size:0.8rem; color:#9a9a9a; flex-shrink:0; }
.sc-input {
  background:transparent;
  border:none;
  color:#fff;
  font-size:0.85rem;
  font-family:'Courier New', monospace;
  width:100%;
  outline:none;
}
.sc-input::placeholder { color:#555; }
.sc-input:disabled { opacity:0.5; cursor:not-allowed; }

/* ══ Status Row ══ */
.cb-status-row { display:flex; align-items:center; gap:7px; margin-top:auto; padding-top:4px; }
.cb-status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.dot-ok   { background:#18ce0f; box-shadow:0 0 5px rgba(24,206,15,0.4); }
.dot-warn { background:#ff8d72; box-shadow:0 0 5px rgba(255,141,114,0.4); }
.dot-high { background:#fd5d93; box-shadow:0 0 5px rgba(253,93,147,0.4); }
.dot-low  { background:#9a9a9a; }
.cb-status-text { font-size:0.72rem; font-weight:600; }

/* ══ Config Footer ══ */
.cb-footer {
  display:flex;
  justify-content:flex-end;
  gap:6px;
  padding:10px 14px;
  border-top:1px solid rgba(255,255,255,0.06);
  background:rgba(255,255,255,0.02);
}

/* ══ Empty State ══ */
.empty-state { text-align:center; padding:48px 20px; }
.empty-icon  { font-size:2.5rem; color:#444; display:block; margin-bottom:16px; }
.empty-title { color:#9a9a9a; font-size:1rem; font-weight:600; margin-bottom:6px; }

/* ══ El-Select dark ══ */
.el-select .el-input__inner { background-color:#1e1e2f !important; border-color:rgba(255,255,255,0.12) !important; color:#fff !important; border-radius:6px; }
.el-select .el-input__inner::placeholder { color:#9a9a9a !important; }
.el-select .el-input .el-select__caret  { color:#9a9a9a !important; }
.el-table th > .cell { white-space:nowrap; }
</style>