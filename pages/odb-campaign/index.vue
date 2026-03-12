<template>
  <div class="row">
    <!-- Page Header -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">OBD Campaign Management</h2>
          <p class="text-muted mb-0">Manage outbound dialer voice broadcast campaigns</p>
        </div>
        <base-button type="primary" @click="openCreateModal">
          <i class="tim-icons icon-simple-add mr-2"></i> New OBD Campaign
        </base-button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #e14eca, #ba54f5);">
            <i class="tim-icons icon-email-85"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Campaigns</p>
            <h3 class="stat-value">24</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Updated just now
        </div>
      </card>
    </div>

    <!-- FIX 1: "Calls In Progress" → "OBD Campaigns In Progress" -->
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #00bf9a, #00f2c3);">
            <i class="tim-icons icon-triangle-right-17"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">OBD Campaigns In Progress</p>
            <h3 class="stat-value">3</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Active right now
        </div>
      </card>
    </div>

    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
            <i class="tim-icons icon-headphones"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Calls Delivered Today</p>
            <h3 class="stat-value">97,430</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up"></i> +8.2% from yesterday
        </div>
      </card>
    </div>

    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #ff8d72, #ff6491);">
            <i class="tim-icons icon-chart-pie-36"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg. Answer Rate</p>
            <h3 class="stat-value">67%</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-sound-wave"></i> Across active campaigns
        </div>
      </card>
    </div>

    <!-- Filters -->
    <div class="col-12 mb-3 mt-3">
      <card>
        <div class="row align-items-center">
          <div class="col-md-6">
            <base-input
              v-model="search"
              placeholder="Search OBD campaigns..."
              addon-left-icon="tim-icons icon-zoom-split"
            ></base-input>
          </div>
          <div class="col-md-4">
            <el-select v-model="statusFilter" placeholder="Filter by status" class="w-100">
              <el-option label="All Statuses" value=""></el-option>
              <el-option label="Running"   value="Running"></el-option>
              <el-option label="Completed" value="Completed"></el-option>
              <el-option label="Failed"    value="Failed"></el-option>
              <el-option label="Draft"     value="Draft"></el-option>
            </el-select>
          </div>
          <div class="col-md-2 text-right">
            <base-button type="default" size="sm" @click="clearFilters">Clear Filters</base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- Campaign Table -->
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <div slot="header" class="d-flex justify-content-between align-items-center">
          <h4 class="card-title mb-0">OBD Campaigns ({{ filteredCampaigns.length }})</h4>
          <base-button size="sm" type="default" @click="refreshList">
            <i class="tim-icons icon-refresh-02"></i> Refresh
          </base-button>
        </div>

        <el-table :data="filteredCampaigns" style="width: 100%">

          <el-table-column min-width="200" sortable label="Campaign Name" prop="name">
            <template slot-scope="{ row }">
              <span class="font-weight-bold">{{ row.name }}</span><br>
              <small class="text-muted">
                <i class="tim-icons icon-headphones mr-1"></i>Pre-recorded
              </small>
            </template>
          </el-table-column>

          <el-table-column min-width="110" sortable label="Status" prop="status">
            <template slot-scope="{ row }">
              <span class="badge" :class="statusClass(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="150" sortable label="Total Numbers" prop="totalNumbers">
          </el-table-column>

          <el-table-column min-width="155" sortable label="Calls Delivered" prop="delivered">
          </el-table-column>

          <el-table-column min-width="170" sortable label="Answer Rate" prop="answerRate">
            <template slot-scope="{ row }">
              <div class="d-flex align-items-center">
                <div class="progress-bar-wrap mr-2">
                  <div :style="{
                    width: row.answerRate + '%',
                    background: row.answerRate >= 70 ? '#18ce0f' : row.answerRate >= 50 ? '#ff8d72' : '#fd5d93',
                    height: '6px', borderRadius: '4px'
                  }"></div>
                </div>
                <span :class="row.answerRate >= 70 ? 'text-success' : row.answerRate >= 50 ? 'text-warning' : 'text-danger'">
                  {{ row.answerRate }}%
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="130" sortable label="Avg Duration" prop="avgDuration">
            <template slot-scope="{ row }">{{ row.avgDuration }}s</template>
          </el-table-column>

          <!-- FIX 2: Start Time column -->
          <el-table-column min-width="165" sortable label="Start Time" prop="startTime">
            <template slot-scope="{ row }">
              <span v-if="row.startTime" class="time-text">{{ row.startTime }}</span>
              <span v-else class="text-muted">—</span>
            </template>
          </el-table-column>

          <!-- FIX 2: End Time column -->
          <el-table-column min-width="165" sortable label="End Time" prop="endTime">
            <template slot-scope="{ row }">
              <span v-if="row.endTime" class="time-text">{{ row.endTime }}</span>
              <span v-else-if="row.status === 'Running'" class="running-text">In progress...</span>
              <span v-else class="text-muted">—</span>
            </template>
          </el-table-column>

          <el-table-column min-width="190" label="Actions" align="right" header-align="right">
            <template slot-scope="{ row }">
              <base-button
                v-if="row.status === 'Running'"
                size="sm" type="warning" icon
                @click="stopCampaign(row)" title="Stop Campaign"
              >
                <i class="tim-icons icon-button-pause"></i>
              </base-button>
              <base-button
                v-if="row.status === 'Draft' || row.status === 'Completed'"
                size="sm" type="success" icon
                @click="startCampaign(row)" title="Start Campaign"
              >
                <i class="tim-icons icon-triangle-right-17"></i>
              </base-button>
              <base-button size="sm" type="info" icon @click="testPush(row)" title="Push to 1 User">
                <i class="tim-icons icon-chat-33"></i>
              </base-button>
              <base-button size="sm" type="danger" icon @click="deleteCampaign(row)" title="Delete">
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </template>
          </el-table-column>

        </el-table>
      </card>
    </div>

    <!-- ── Create Campaign Modal ── -->
    <modal :show.sync="showCreateModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Create OBD Campaign</h4>
      <div class="row">

        <div class="col-12 mb-3">
          <base-input label="Campaign Name" v-model="newCampaign.name" placeholder="e.g. El Clásico Preview Voice Blast"></base-input>
        </div>

        <!-- CHANGE 6: Voice Prompt — select from library or upload new -->
        <div class="col-12 mb-3">
          <label class="control-label d-block mb-2">Voice Prompt</label>
          <div class="send-timing-toggle mb-3">
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.promptSource === 'library' }"
              @click="newCampaign.promptSource = 'library'"
              type="button"
            >
              <i class="tim-icons icon-bullet-list-67 mr-2"></i> Select from Library
            </button>
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.promptSource === 'upload' }"
              @click="newCampaign.promptSource = 'upload'"
              type="button"
            >
              <i class="tim-icons icon-cloud-upload-94 mr-2"></i> Upload New Prompt
            </button>
          </div>

          <!-- Select from existing library -->
          <div v-if="newCampaign.promptSource === 'library'">
            <el-select v-model="newCampaign.selectedPrompt" placeholder="Choose a saved prompt..." class="w-100">
              <el-option
                v-for="p in promptLibrary"
                :key="p.id"
                :label="p.name"
                :value="p.id"
              >
                <div class="prompt-option">
                  <span class="prompt-option-name">{{ p.name }}</span>
                  <span class="prompt-option-meta">{{ p.duration }} · {{ p.format }} · {{ p.uploaded }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="prompt-preview-bar mt-2" v-if="selectedPromptObj">
              <i class="tim-icons icon-headphones mr-2" style="color:#e14eca;"></i>
              <span class="text-muted" style="font-size:0.8rem;">{{ selectedPromptObj.name }}</span>
              <span class="ml-auto text-muted" style="font-size:0.75rem;">{{ selectedPromptObj.duration }} · {{ selectedPromptObj.format }}</span>
            </div>
          </div>

          <!-- Upload new prompt -->
          <div v-if="newCampaign.promptSource === 'upload'">
            <div class="csv-upload-zone" @click="$refs.audioInput.click()">
              <i class="tim-icons icon-headphones mb-2" style="font-size:2rem"></i>
              <p class="mb-0">Click to upload audio file</p>
              <small class="text-muted">Supported: .mp3, .wav, .ogg (max 10MB)</small>
            </div>
            <input ref="audioInput" type="file" accept=".mp3,.wav,.ogg" class="d-none" @change="handleAudioUpload">
            <small v-if="newCampaign.audioFile" class="text-success mt-1 d-block">
              <i class="tim-icons icon-check-2"></i> {{ newCampaign.audioFile }}
            </small>
          </div>
        </div>

        <!-- CHANGE 5: Subscriber Target — single MSISDN or CSV upload -->
        <div class="col-12 mb-3">
          <label class="control-label d-block mb-2">Subscriber Target</label>
          <div class="send-timing-toggle mb-3">
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.targetMode === 'single' }"
              @click="newCampaign.targetMode = 'single'"
              type="button"
            >
              <i class="tim-icons icon-single-02 mr-2"></i> Single Number
            </button>
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.targetMode === 'csv' }"
              @click="newCampaign.targetMode = 'csv'"
              type="button"
            >
              <i class="tim-icons icon-cloud-upload-94 mr-2"></i> Upload CSV List
            </button>
          </div>

          <!-- Single MSISDN input -->
          <div v-if="newCampaign.targetMode === 'single'">
            <base-input
              v-model="newCampaign.singleMsisdn"
              placeholder="e.g. 254712345678"
              addon-left-icon="tim-icons icon-mobile"
            ></base-input>
            <small class="text-muted">Enter a single MSISDN to target one subscriber.</small>
          </div>

          <!-- CSV Upload -->
          <div v-if="newCampaign.targetMode === 'csv'">
            <div class="csv-upload-zone" @click="$refs.csvInput.click()">
              <i class="tim-icons icon-cloud-upload-94 mb-2" style="font-size:2rem"></i>
              <p class="mb-0">Upload subscriber list CSV</p>
              <small class="text-muted">Columns: msisdn (required)</small>
            </div>
            <input ref="csvInput" type="file" accept=".csv" class="d-none" @change="handleCsvUpload">
            <small v-if="newCampaign.csvFile" class="text-success mt-1 d-block">
              <i class="tim-icons icon-check-2"></i> {{ newCampaign.csvFile }}
            </small>
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <base-input label="Caller ID" v-model="newCampaign.callerId" placeholder="e.g. +254700000000"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <base-input label="Max Retries" v-model="newCampaign.maxRetries" placeholder="e.g. 3" type="number"></base-input>
        </div>

        <!-- FIX 4: Send Now vs Schedule toggle with conditional datetime picker -->
        <div class="col-12 mb-3">
          <label class="control-label d-block mb-2">Send Timing</label>
          <div class="send-timing-toggle">
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.sendTiming === 'now' }"
              @click="newCampaign.sendTiming = 'now'"
              type="button"
            >
              <i class="tim-icons icon-triangle-right-17 mr-2"></i> Send Now
            </button>
            <button
              class="timing-btn"
              :class="{ 'timing-active': newCampaign.sendTiming === 'schedule' }"
              @click="newCampaign.sendTiming = 'schedule'"
              type="button"
            >
              <i class="tim-icons icon-time-alarm mr-2"></i> Schedule
            </button>
          </div>
        </div>

        <div class="col-12 mb-3" v-if="newCampaign.sendTiming === 'schedule'">
          <label class="control-label d-block">Schedule Date &amp; Time</label>
          <el-date-picker
            v-model="newCampaign.scheduledAt"
            type="datetime"
            placeholder="Select date and time"
            class="w-100"
            :picker-options="{ disabledDate: d => d < new Date() }"
          ></el-date-picker>
          <small class="text-muted mt-1 d-block">
            <i class="tim-icons icon-alert-circle-exc mr-1"></i>
            Campaign will start automatically at the selected time.
          </small>
        </div>

      </div>
      <template slot="footer">
        <base-button type="default" @click="showCreateModal = false">Cancel</base-button>
        <base-button type="primary" @click="createCampaign">
          {{ newCampaign.sendTiming === 'now' ? 'Launch Campaign' : 'Schedule Campaign' }}
        </base-button>
      </template>
    </modal>

    <!-- Test Push Modal -->
    <modal :show.sync="showTestModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Test Call — Push to 1 User</h4>
      <div>
        <p class="text-muted">Trigger a single test OBD call from <strong>{{ selectedCampaign ? selectedCampaign.name : '' }}</strong>.</p>
        <base-input label="MSISDN (Phone Number)" v-model="testMsisdn" placeholder="e.g. 254712345678"></base-input>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showTestModal = false">Cancel</base-button>
        <base-button type="success" @click="sendTestPush">Initiate Test Call</base-button>
      </template>
    </modal>

    <!-- Audio Preview Modal -->
    <modal :show.sync="showAudioModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Audio Preview</h4>
      <div class="text-center py-4" v-if="selectedCampaign">
        <div class="audio-player-wrap mb-3">
          <i class="tim-icons icon-headphones" style="font-size: 3rem; color: #e14eca;"></i>
        </div>
        <h5>{{ selectedCampaign.name }}</h5>
        <p class="text-muted">Pre-recorded · {{ selectedCampaign.audioFile || 'voice_prompt.mp3' }}</p>
        <div class="audio-bar mt-3">
          <div class="audio-bar-fill" :style="{ width: audioProgress + '%' }"></div>
        </div>
        <p class="text-muted mt-2">{{ audioTime }} / 0:45</p>
        <base-button type="primary" round @click="toggleAudio">
          <i :class="isPlaying ? 'tim-icons icon-button-pause' : 'tim-icons icon-triangle-right-17'"></i>
          {{ isPlaying ? 'Pause' : 'Play' }}
        </base-button>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showAudioModal = false">Close</base-button>
      </template>
    </modal>

  </div>
</template>

<script>
import { Select, Option, DatePicker } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import Modal from '@/components/Modal';

export default {
  name: 'ObdCampaigns',
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      search: '',
      statusFilter: '',
      showCreateModal: false,
      showTestModal: false,
      showAudioModal: false,
      selectedCampaign: null,
      testMsisdn: '',
      isPlaying: false,
      audioProgress: 0,
      audioInterval: null,
      newCampaign: {
        name: '',
        promptSource: 'library',
        selectedPrompt: null,
        audioFile: null,
        targetMode: 'csv',
        singleMsisdn: '',
        csvFile: null,
        callerId: '',
        maxRetries: 3,
        sendTiming: 'now',
        scheduledAt: null
      },
      promptLibrary: [
        { id: 1, name: 'El Clásico Promo v2',          duration: '0:32', format: 'MP3', uploaded: '2025-02-28' },
        { id: 2, name: 'UCL Matchday Reminder',         duration: '0:45', format: 'WAV', uploaded: '2025-03-01' },
        { id: 3, name: 'Fantasy Football GW28',         duration: '0:28', format: 'MP3', uploaded: '2025-03-04' },
        { id: 4, name: 'Serie A Weekend Preview',       duration: '0:38', format: 'MP3', uploaded: '2025-02-20' },
        { id: 5, name: 'Subscription Renewal Reminder', duration: '0:22', format: 'WAV', uploaded: '2025-03-05' },
      ],
      campaigns: [
        { id:1, name:'El Clásico Preview Voice Blast',  status:'Failed',    totalNumbers:'15,000',  delivered:'12,540',  answerRate:83, avgDuration:28, startTime:'2025-03-01 07:00', endTime:'2025-03-01 09:14' },
        { id:2, name:'Fantasy Football GW28 Reminder',  status:'Completed', totalNumbers:'100,000', delivered:'97,200',  answerRate:97, avgDuration:35, startTime:'2025-02-27 09:00', endTime:'2025-02-27 14:22' },
        { id:3, name:'UCL Quarter Final Draw Alert',    status:'Running',   totalNumbers:'200,000', delivered:'143,000', answerRate:71, avgDuration:22, startTime:'2025-03-06 11:00', endTime:null },
        { id:4, name:'Bundesliga Top 4 Promo',          status:'Draft',     totalNumbers:'50,000',  delivered:'0',       answerRate:0,  avgDuration:0,  startTime:null,               endTime:null },
        { id:5, name:'Serie A Matchday Preview',        status:'Completed', totalNumbers:'80,000',  delivered:'72,400',  answerRate:90, avgDuration:31, startTime:'2025-02-23 14:00', endTime:'2025-02-23 18:45' },
        { id:6, name:'EPL Top 6 Rivalry Blast',         status:'Running',   totalNumbers:'130,000', delivered:'64,000',  answerRate:65, avgDuration:19, startTime:'2025-03-07 10:00', endTime:null },
      ]
    };
  },
  computed: {
    filteredCampaigns() {
      return this.campaigns.filter(c => {
        const matchSearch = !this.search || c.name.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = !this.statusFilter || c.status === this.statusFilter;
        return matchSearch && matchStatus;
      });
    },
    selectedPromptObj() {
      if (!this.newCampaign.selectedPrompt) return null;
      return this.promptLibrary.find(p => p.id === this.newCampaign.selectedPrompt) || null;
    },
    audioTime() {
      const secs = Math.round((this.audioProgress / 100) * 45);
      return `0:${secs < 10 ? '0' + secs : secs}`;
    }
  },
  methods: {
    statusClass(status) {
      return {
        'badge-success': status === 'Running',
        'badge-primary': status === 'Completed',
        'badge-danger':  status === 'Failed',
        'badge-default': status === 'Draft'
      };
    },
    openCreateModal() {
      this.newCampaign = { name: '', promptSource: 'library', selectedPrompt: null, audioFile: null, targetMode: 'csv', singleMsisdn: '', csvFile: null, callerId: '', maxRetries: 3, sendTiming: 'now', scheduledAt: null };
      this.showCreateModal = true;
    },
    createCampaign() {
      if (!this.newCampaign.name) {
        this.$notify({ type: 'warning', message: 'Please fill in the campaign name.' });
        return;
      }
      if (this.newCampaign.promptSource === 'library' && !this.newCampaign.selectedPrompt) {
        this.$notify({ type: 'warning', message: 'Please select a voice prompt from the library.' });
        return;
      }
      if (this.newCampaign.promptSource === 'upload' && !this.newCampaign.audioFile) {
        this.$notify({ type: 'warning', message: 'Please upload a voice prompt file.' });
        return;
      }
      if (this.newCampaign.targetMode === 'single' && !this.newCampaign.singleMsisdn) {
        this.$notify({ type: 'warning', message: 'Please enter a target MSISDN.' });
        return;
      }
      if (this.newCampaign.targetMode === 'csv' && !this.newCampaign.csvFile) {
        this.$notify({ type: 'warning', message: 'Please upload a subscriber CSV.' });
        return;
      }
      if (this.newCampaign.sendTiming === 'schedule' && !this.newCampaign.scheduledAt) {
        this.$notify({ type: 'warning', message: 'Please select a schedule date and time.' });
        return;
      }
      const isNow = this.newCampaign.sendTiming === 'now';
      const startTime = isNow
        ? new Date().toLocaleString()
        : new Date(this.newCampaign.scheduledAt).toLocaleString();
      const totalNumbers = this.newCampaign.targetMode === 'single' ? '1' : '0';
      this.campaigns.unshift({
        id: Date.now(),
        name: this.newCampaign.name,
        status: isNow ? 'Running' : 'Draft',
        totalNumbers, delivered: '0',
        answerRate: 0, avgDuration: 0,
        startTime, endTime: null
      });
      this.showCreateModal = false;
      this.$notify({
        type: 'success',
        message: isNow
          ? 'OBD Campaign launched successfully!'
          : `OBD Campaign scheduled for ${startTime}`
      });
    },
    startCampaign(row) {
      row.status    = 'Running';
      row.startTime = new Date().toLocaleString();
      row.endTime   = null;
      this.$notify({ type: 'success', message: `Campaign "${row.name}" started.` });
    },
    stopCampaign(row) {
      row.status  = 'Completed';
      row.endTime = new Date().toLocaleString();
      this.$notify({ type: 'warning', message: `Campaign "${row.name}" stopped.` });
    },
    deleteCampaign(row) {
      this.campaigns = this.campaigns.filter(c => c.id !== row.id);
      this.$notify({ type: 'danger', message: `Campaign "${row.name}" deleted.` });
    },
    testPush(row) {
      this.selectedCampaign = row;
      this.testMsisdn = '';
      this.showTestModal = true;
    },
    sendTestPush() {
      if (!this.testMsisdn) { this.$notify({ type: 'warning', message: 'Enter a valid MSISDN.' }); return; }
      this.showTestModal = false;
      this.$notify({ type: 'success', message: `Test OBD call initiated to ${this.testMsisdn}` });
    },
    previewAudio(row) {
      this.selectedCampaign = row;
      this.audioProgress = 0;
      this.isPlaying = false;
      this.showAudioModal = true;
    },
    toggleAudio() {
      if (this.isPlaying) {
        clearInterval(this.audioInterval);
        this.isPlaying = false;
      } else {
        this.isPlaying = true;
        this.audioInterval = setInterval(() => {
          this.audioProgress += 100 / 45;
          if (this.audioProgress >= 100) {
            this.audioProgress = 100;
            this.isPlaying = false;
            clearInterval(this.audioInterval);
          }
        }, 1000);
      }
    },
    clearFilters() { this.search = ''; this.statusFilter = ''; },
    refreshList()  { this.$notify({ type: 'info', message: 'OBD campaign list refreshed.' }); },
    handleCsvUpload(e)   { const f = e.target.files[0]; if (f) this.newCampaign.csvFile   = f.name; },
    handleAudioUpload(e) { const f = e.target.files[0]; if (f) this.newCampaign.audioFile = f.name; }
  },
  beforeDestroy() { clearInterval(this.audioInterval); }
};
</script>

<style scoped>
/* ── Stat Cards ── */
.stat-card { display:flex; flex-direction:column; height:100%; }
.stat-card .card-body { flex:1; padding: 20px 20px 10px !important; }
.stat-card-body { display: flex; align-items: flex-start; gap: 16px; }
.stat-icon-circle { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:3px; }
.stat-icon-circle i { font-size:1.2rem; color:#fff; }
.stat-content { flex:1; min-width:0; }
.stat-label {
  font-size:0.72rem; color:#9a9a9a; margin-bottom:4px;
  text-transform:uppercase; letter-spacing:0.5px;
  white-space:normal; line-height:1.4;
}
.stat-value { font-size:1.6rem; font-weight:700; color:#fff; margin:0; line-height:1.2; }
.stat-footer { font-size:0.78rem; color:#9a9a9a; padding-top:8px; }
.stat-footer i { margin-right:4px; }

/* ── Badges ── */
.badge { padding:5px 10px; border-radius:12px; font-size:0.72rem; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; }
.badge-success { background:rgba(24,206,15,0.15);  color:#18ce0f; border:1px solid rgba(24,206,15,0.3); }
.badge-primary { background:rgba(225,78,202,0.15); color:#e14eca; border:1px solid rgba(225,78,202,0.3); }
.badge-danger  { background:rgba(253,93,147,0.15); color:#fd5d93; border:1px solid rgba(253,93,147,0.3); }
.badge-default { background:rgba(255,255,255,0.1); color:#aaa;    border:1px solid rgba(255,255,255,0.2); }

/* ── Table ── */
.progress-bar-wrap { width:60px; background:rgba(255,255,255,0.1); border-radius:4px; height:6px; flex-shrink:0; }
.time-text    { font-size:0.82rem; color:#ccc; font-family:'Courier New',monospace; }
.running-text { font-size:0.78rem; color:#00f2c3; font-style:italic; }


/* ── Send Timing Toggle ── */
.send-timing-toggle { display:flex; gap:10px; }
.timing-btn {
  flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12);
  border-radius:8px; color:#9a9a9a; padding:12px 16px; font-size:0.85rem; font-weight:600;
  cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center;
}
.timing-btn:hover { border-color:rgba(225,78,202,0.4); color:#fff; }
.timing-active { background:rgba(225,78,202,0.12) !important; border-color:rgba(225,78,202,0.5) !important; color:#e14eca !important; }

/* ── Prompt Library ── */
.prompt-option { display: flex; flex-direction: column; }
.prompt-option-name { color: #fff; font-size: 0.85rem; font-weight: 600; }
.prompt-option-meta { color: #9a9a9a; font-size: 0.72rem; margin-top: 1px; }
.prompt-preview-bar {
  display: flex; align-items: center; gap: 8px;
  background: rgba(225,78,202,0.08); border: 1px solid rgba(225,78,202,0.2);
  border-radius: 6px; padding: 8px 12px;
}

/* ── Upload zones ── */
.csv-upload-zone { border:2px dashed rgba(255,255,255,0.25); border-radius:10px; padding:30px; text-align:center; cursor:pointer; color:#aaa; transition:all 0.2s ease; }
.csv-upload-zone:hover { border-color:#e14eca; background:rgba(225,78,202,0.05); color:#fff; }

/* ── Audio Player ── */
.audio-bar { height:6px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin:0 auto; max-width:300px; }
.audio-bar-fill { height:100%; background:linear-gradient(90deg,#e14eca,#1d8cf8); border-radius:4px; transition:width 0.5s linear; }

/* ── El-Select dark ── */
.el-select { width:100%; }
.el-select .el-input__inner { background-color:#1e1e2f !important; border-color:rgba(255,255,255,0.15) !important; color:#fff !important; border-radius:6px; }
.el-select .el-input__inner::placeholder { color:#9a9a9a !important; }
.el-select .el-input .el-select__caret { color:#9a9a9a !important; }
.el-table th > .cell { white-space:nowrap; word-break:keep-all; }
</style>