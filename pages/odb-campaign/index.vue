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
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
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
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #00bf9a, #00f2c3);">
            <i class="tim-icons icon-button-play"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Calls In Progress</p>
            <h3 class="stat-value">3</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Active right now
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
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
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
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
    <div class="col-12 mb-3">
      <card>
        <div class="row align-items-center">
          <div class="col-md-4">
            <base-input
              v-model="search"
              placeholder="Search OBD campaigns..."
              addon-left-icon="tim-icons icon-zoom-split"
            ></base-input>
          </div>
          <div class="col-md-3">
            <el-select v-model="statusFilter" placeholder="Filter by status" class="w-100">
              <el-option label="All Statuses" value=""></el-option>
              <el-option label="Running" value="Running"></el-option>
              <el-option label="Completed" value="Completed"></el-option>
              <el-option label="Failed" value="Failed"></el-option>
              <el-option label="Draft" value="Draft"></el-option>
            </el-select>
          </div>
          <div class="col-md-3">
            <el-select v-model="promptFilter" placeholder="Filter by prompt type" class="w-100">
              <el-option label="All Prompt Types" value=""></el-option>
              <el-option label="Pre-recorded" value="Pre-recorded"></el-option>
              <el-option label="TTS" value="TTS"></el-option>
            </el-select>
          </div>
          <div class="col-md-2 text-right">
            <base-button type="default" size="sm" @click="clearFilters">
              Clear Filters
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- Campaign Table -->
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <div slot="header" class="d-flex justify-content-between align-items-center">
          <h4 class="card-title mb-0">OBD Campaigns ({{ filteredCampaigns.length }})</h4>
          <div>
            <base-button size="sm" type="default" @click="refreshList">
              <i class="tim-icons icon-refresh-02"></i> Refresh
            </base-button>
          </div>
        </div>

        <el-table :data="filteredCampaigns" style="width: 100%">
          <el-table-column min-width="200" sortable label="Campaign Name" prop="name">
            <template slot-scope="{ row }">
              <div>
                <span class="font-weight-bold">{{ row.name }}</span>
                <br>
                <small class="text-muted">
                  <i class="tim-icons icon-headphones mr-1"></i>{{ row.promptType }}
                </small>
              </div>
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

          <el-table-column min-width="180" sortable label="Answer Rate" prop="answerRate">
            <template slot-scope="{ row }">
              <div class="d-flex align-items-center">
                <div class="progress-bar-wrap mr-2" style="width:60px; background:rgba(255,255,255,0.1); border-radius:4px; height:6px;">
                  <div
                    :style="{ width: row.answerRate + '%', background: row.answerRate >= 70 ? '#18ce0f' : row.answerRate >= 50 ? '#ff8d72' : '#fd5d93', height: '6px', borderRadius: '4px' }"
                  ></div>
                </div>
                <span :class="row.answerRate >= 70 ? 'text-success' : row.answerRate >= 50 ? 'text-warning' : 'text-danger'">
                  {{ row.answerRate }}%
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="140" sortable label="Avg Duration" prop="avgDuration">
            <template slot-scope="{ row }">
              {{ row.avgDuration }}s
            </template>
          </el-table-column>

          <el-table-column min-width="160" sortable label="Scheduled At" prop="scheduledAt">
          </el-table-column>

          <el-table-column min-width="210" label="Actions" align="right" header-align="right">
            <template slot-scope="{ row }">
              <base-button
                v-if="row.status === 'Running'"
                size="sm"
                type="warning"
                icon
                @click="stopCampaign(row)"
                title="Stop Campaign"
              >
                <i class="tim-icons icon-button-pause"></i>
              </base-button>
              <base-button
                v-if="row.status === 'Draft' || row.status === 'Completed'"
                size="sm"
                type="success"
                icon
                @click="startCampaign(row)"
                title="Start Campaign"
              >
                <i class="tim-icons icon-triangle-right-17"></i>
              </base-button>
              <base-button
                size="sm"
                type="info"
                icon
                @click="testPush(row)"
                title="Push to 1 User"
              >
                <i class="tim-icons icon-chat-33"></i>
              </base-button>
              <!-- <base-button
                size="sm"
                type="default"
                icon
                @click="previewAudio(row)"
                title="Preview Audio"
              >
                <i class="tim-icons icon-triangle-right-17"></i>
              </base-button> -->
              <base-button
                size="sm"
                type="danger"
                icon
                @click="deleteCampaign(row)"
                title="Delete"
              >
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>

    <!-- Create Campaign Modal -->
    <modal :show.sync="showCreateModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Create OBD Campaign</h4>
      <div class="row">
        <div class="col-12 mb-3">
          <base-input label="Campaign Name" v-model="newCampaign.name" placeholder="e.g. El Clásico Preview Voice Blast"></base-input>
        </div>

        <div class="col-12 mb-3">
          <label class="control-label">Voice Prompt Type</label>
          <el-select v-model="newCampaign.promptType" class="w-100">
            <el-option label="Upload Pre-recorded Audio" value="Pre-recorded"></el-option>
            <el-option label="Text-to-Speech (TTS)" value="TTS"></el-option>
          </el-select>
        </div>

        <!-- Audio Upload -->
        <div class="col-12 mb-3" v-if="newCampaign.promptType === 'Pre-recorded'">
          <label class="control-label">Voice Prompt File</label>
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

        <!-- TTS Script -->
        <div class="col-12 mb-3" v-if="newCampaign.promptType === 'TTS'">
          <label class="control-label">TTS Script</label>
          <textarea
            v-model="newCampaign.ttsScript"
            class="form-control"
            rows="4"
            placeholder="Enter the script to be read aloud... Use {name} for personalization."
          ></textarea>
        </div>

        <!-- CSV Upload -->
        <div class="col-12 mb-3">
          <label class="control-label">Subscriber CSV</label>
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

        <div class="col-md-6 mb-3">
          <base-input label="Caller ID" v-model="newCampaign.callerId" placeholder="e.g. +254700000000"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <base-input label="Max Retries" v-model="newCampaign.maxRetries" placeholder="e.g. 3" type="number"></base-input>
        </div>
        <div class="col-12 mb-3">
          <label class="control-label d-block">Schedule Date & Time</label>
          <el-date-picker
            v-model="newCampaign.scheduledAt"
            type="datetime"
            placeholder="Select date and time"
            class="w-100"
          ></el-date-picker>
        </div>
      </div>

      <template slot="footer">
        <base-button type="default" @click="showCreateModal = false">Cancel</base-button>
        <base-button type="primary" @click="createCampaign">Create Campaign</base-button>
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
        <p class="text-muted">{{ selectedCampaign.promptType }} · {{ selectedCampaign.audioFile || 'voice_prompt.mp3' }}</p>
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
      promptFilter: '',
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
        promptType: 'Pre-recorded',
        audioFile: null,
        ttsScript: '',
        csvFile: null,
        callerId: '',
        maxRetries: 3,
        scheduledAt: null
      },
      campaigns: [
        { id: 1, name: 'El Clásico Preview Voice Blast', promptType: 'Pre-recorded', status: 'Failed',    totalNumbers: '15,000', delivered: '12,540', answerRate: 83, avgDuration: 28, scheduledAt: '2025-03-01 07:00' },
        { id: 2, name: 'Fantasy Football GW28 Reminder', promptType: 'TTS',           status: 'Completed', totalNumbers: '100,000', delivered: '97,200', answerRate: 97, avgDuration: 35, scheduledAt: '2025-02-27 09:00' },
        { id: 3, name: 'UCL Quarter Final Draw Alert',   promptType: 'Pre-recorded', status: 'Running',   totalNumbers: '200,000', delivered: '143,000', answerRate: 71, avgDuration: 22, scheduledAt: '2025-03-06 11:00' },
        { id: 4, name: 'Bundesliga Top 4 Promo',         promptType: 'TTS',           status: 'Draft',     totalNumbers: '50,000',  delivered: '0',       answerRate: 0,  avgDuration: 0,  scheduledAt: '2025-03-12 08:00' },
        { id: 5, name: 'Serie A Matchday Preview',        promptType: 'Pre-recorded', status: 'Completed', totalNumbers: '80,000',  delivered: '72,400', answerRate: 90, avgDuration: 31, scheduledAt: '2025-02-23 14:00' },
        { id: 6, name: 'EPL Top 6 Rivalry Blast',         promptType: 'TTS',           status: 'Running',   totalNumbers: '130,000', delivered: '64,000', answerRate: 65, avgDuration: 19, scheduledAt: '2025-03-07 10:00' },
      ]
    };
  },
  computed: {
    filteredCampaigns() {
      return this.campaigns.filter(c => {
        const matchSearch = !this.search || c.name.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = !this.statusFilter || c.status === this.statusFilter;
        const matchPrompt = !this.promptFilter || c.promptType === this.promptFilter;
        return matchSearch && matchStatus && matchPrompt;
      });
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
        'badge-danger': status === 'Failed',
        'badge-default': status === 'Draft'
      };
    },
    openCreateModal() {
      this.newCampaign = { name: '', promptType: 'Pre-recorded', audioFile: null, ttsScript: '', csvFile: null, callerId: '', maxRetries: 3, scheduledAt: null };
      this.showCreateModal = true;
    },
    createCampaign() {
      if (!this.newCampaign.name) {
        this.$notify({ type: 'warning', message: 'Please fill in the campaign name.' });
        return;
      }
      this.campaigns.unshift({
        id: Date.now(),
        name: this.newCampaign.name,
        promptType: this.newCampaign.promptType,
        status: 'Draft',
        totalNumbers: '0',
        delivered: '0',
        answerRate: 0,
        avgDuration: 0,
        scheduledAt: this.newCampaign.scheduledAt ? new Date(this.newCampaign.scheduledAt).toLocaleString() : '-'
      });
      this.showCreateModal = false;
      this.$notify({ type: 'success', message: 'OBD Campaign created successfully!' });
    },
    startCampaign(row) {
      row.status = 'Running';
      this.$notify({ type: 'success', message: `Campaign "${row.name}" started.` });
    },
    stopCampaign(row) {
      row.status = 'Completed';
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
      if (!this.testMsisdn) {
        this.$notify({ type: 'warning', message: 'Enter a valid MSISDN.' });
        return;
      }
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
    clearFilters() {
      this.search = '';
      this.statusFilter = '';
      this.promptFilter = '';
    },
    refreshList() {
      this.$notify({ type: 'info', message: 'OBD campaign list refreshed.' });
    },
    handleCsvUpload(e) {
      const file = e.target.files[0];
      if (file) this.newCampaign.csvFile = file.name;
    },
    handleAudioUpload(e) {
      const file = e.target.files[0];
      if (file) this.newCampaign.audioFile = file.name;
    }
  },
  beforeDestroy() {
    clearInterval(this.audioInterval);
  }
};
</script>

<style scoped>
/* ── Stat Cards ── */
.stat-card .card-body {
  padding: 20px 20px 10px !important;
}
.stat-card-body {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon-circle i {
  font-size: 1.2rem;
  color: #fff;
}
.stat-content {
  flex: 1;
}
.stat-label {
  font-size: 0.78rem;
  color: #9a9a9a;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}
.stat-footer {
  font-size: 0.78rem;
  color: #9a9a9a;
  padding-top: 8px;
}
.stat-footer i {
  margin-right: 4px;
}

/* ── Badges ── */
.badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.badge-success { background: rgba(24, 206, 15, 0.15); color: #18ce0f; border: 1px solid rgba(24, 206, 15, 0.3); }
.badge-primary { background: rgba(225, 78, 202, 0.15); color: #e14eca; border: 1px solid rgba(225, 78, 202, 0.3); }
.badge-danger  { background: rgba(253, 93, 147, 0.15); color: #fd5d93; border: 1px solid rgba(253, 93, 147, 0.3); }
.badge-default { background: rgba(255, 255, 255, 0.1); color: #aaa; border: 1px solid rgba(255,255,255,0.2); }

/* ── CSV / Audio Upload ── */
.csv-upload-zone {
  border: 2px dashed rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  color: #aaa;
  transition: all 0.2s ease;
}
.csv-upload-zone:hover {
  border-color: #e14eca;
  background: rgba(225, 78, 202, 0.05);
  color: #fff;
}

/* ── Audio Player ── */
.audio-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 300px;
}
.audio-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e14eca, #1d8cf8);
  border-radius: 4px;
  transition: width 0.5s linear;
}

/* ── El-Select themed dark ── */
.el-select {
  width: 100%;
}
.el-select .el-input__inner {
  background-color: #1e1e2f !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  border-radius: 6px;
}
.el-select .el-input__inner::placeholder {
  color: #9a9a9a !important;
}
.el-select .el-input .el-select__caret {
  color: #9a9a9a !important;
}

/* ── Table header no-wrap ── */
.el-table th > .cell {
  white-space: nowrap;
  word-break: keep-all;
}
</style>