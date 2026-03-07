<template>
  <div class="row">
    <!-- Page Header -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">SMS Campaign Management</h2>
          <p class="text-muted mb-0">Manage and monitor your SMS broadcast campaigns</p>
        </div>
        <base-button type="primary" @click="openCreateModal">
          <i class="tim-icons icon-simple-add mr-2"></i> New Campaign
        </base-button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #e14eca, #ba54f5);">
            <i class="tim-icons icon-notes"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Campaigns</p>
            <h3 class="stat-value">48</h3>
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
            <p class="stat-label">Running</p>
            <h3 class="stat-value">5</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-refresh-02"></i> Active campaigns
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6">
      <card class="card-stats stat-card">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background: linear-gradient(135deg, #1d8cf8, #3358f4);">
            <i class="tim-icons icon-send"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">SMS Sent Today</p>
            <h3 class="stat-value">284,540</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-trend-up"></i> +12.4% from yesterday
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
            <p class="stat-label">Failed</p>
            <h3 class="stat-value">3</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc"></i> Needs attention
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
              placeholder="Search campaigns..."
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
            <el-select v-model="typeFilter" placeholder="Filter by type" class="w-100">
              <el-option label="All Types" value=""></el-option>
              <el-option label="Broadcast" value="Broadcast"></el-option>
              <el-option label="Attribute-Based" value="Attribute-Based"></el-option>
              <el-option label="Scheduled" value="Scheduled"></el-option>
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
          <h4 class="card-title mb-0">Campaigns ({{ filteredCampaigns.length }})</h4>
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
                <small class="text-muted">{{ row.type }}</small>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="100" sortable label="Status" prop="status">
            <template slot-scope="{ row }">
              <span class="badge" :class="statusClass(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="130" sortable label="Subscribers" prop="subscribers">
          </el-table-column>

          <el-table-column min-width="120" sortable label="Sent" prop="sent">
          </el-table-column>

          <el-table-column min-width="100" sortable label="Delivered %" prop="deliveryRate">
            <template slot-scope="{ row }">
              <span :class="row.deliveryRate >= 90 ? 'text-success' : row.deliveryRate >= 70 ? 'text-warning' : 'text-danger'">
                {{ row.deliveryRate }}%
              </span>
            </template>
          </el-table-column>

          <el-table-column min-width="160" sortable label="Scheduled At" prop="scheduledAt">
          </el-table-column>

          <el-table-column min-width="180" label="Actions" align="right" header-align="right">
            <template slot-scope="{ row }">
              <base-button
                v-if="row.status === 'Running'"
                size="sm"
                type="warning"
                icon
                @click="stopCampaign(row)"
                title="Stop"
              >
                <i class="tim-icons icon-button-pause"></i>
              </base-button>
              <base-button
                v-if="row.status === 'Draft' || row.status === 'Completed'"
                size="sm"
                type="success"
                icon
                @click="startCampaign(row)"
                title="Start"
              >
                <i class="tim-icons icon-button-play"></i>
              </base-button>
              <base-button
                size="sm"
                type="info"
                icon
                @click="testPush(row)"
                title="Push to 1 User"
              >
                <i class="tim-icons icon-send"></i>
              </base-button>
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
      <h4 slot="header" class="title title-up">Create SMS Campaign</h4>
      <div class="row">
        <div class="col-12 mb-3">
          <base-input label="Campaign Name" v-model="newCampaign.name" placeholder="e.g. Premier League GW29 Alerts"></base-input>
        </div>
        <div class="col-12 mb-3">
          <label class="control-label">Campaign Type</label>
          <el-select v-model="newCampaign.type" class="w-100">
            <el-option label="Broadcast (CSV Upload)" value="Broadcast"></el-option>
            <el-option label="Attribute-Based Filter" value="Attribute-Based"></el-option>
            <el-option label="Scheduled" value="Scheduled"></el-option>
          </el-select>
        </div>

        <!-- CSV Upload (for Broadcast) -->
        <div class="col-12 mb-3" v-if="newCampaign.type === 'Broadcast'">
          <label class="control-label">Subscriber CSV</label>
          <div class="csv-upload-zone" @click="$refs.csvInput.click()">
            <i class="tim-icons icon-cloud-upload-94 mb-2" style="font-size:2rem"></i>
            <p class="mb-0">Click to upload CSV or drag & drop</p>
            <small class="text-muted">Columns: msisdn (required)</small>
          </div>
          <input ref="csvInput" type="file" accept=".csv" class="d-none" @change="handleCsvUpload">
          <small v-if="newCampaign.csvFile" class="text-success mt-1 d-block">
            <i class="tim-icons icon-check-2"></i> {{ newCampaign.csvFile }}
          </small>
        </div>

        <!-- Attribute-Based Filters -->
        <template v-if="newCampaign.type === 'Attribute-Based'">
          <div class="col-12 mb-2">
            <label class="control-label d-block">Filter by Subscriber Date</label>
            <el-date-picker v-model="newCampaign.subscriberDateRange" type="daterange"
              range-separator="to" start-placeholder="Start" end-placeholder="End" class="w-100">
            </el-date-picker>
          </div>
          <div class="col-12 mb-2">
            <label class="control-label d-block">Filter by Last Charge Date</label>
            <el-date-picker v-model="newCampaign.lastChargeDateRange" type="daterange"
              range-separator="to" start-placeholder="Start" end-placeholder="End" class="w-100">
            </el-date-picker>
          </div>
          <div class="col-12 mb-3">
            <label class="control-label d-block">Filter by Last Activity Date</label>
            <el-date-picker v-model="newCampaign.lastActivityDateRange" type="daterange"
              range-separator="to" start-placeholder="Start" end-placeholder="End" class="w-100">
            </el-date-picker>
          </div>
        </template>

        <div class="col-12 mb-3">
          <label class="control-label">Message Template</label>
          <textarea
            v-model="newCampaign.message"
            class="form-control"
            rows="4"
            placeholder="Type your SMS message here... Use {name}, {msisdn} for personalization."
          ></textarea>
          <small class="text-muted">{{ newCampaign.message.length }}/160 characters</small>
        </div>

        <div class="col-12 mb-3">
          <base-input label="Sender ID" v-model="newCampaign.senderId" placeholder="e.g. SportAlerts"></base-input>
        </div>
      </div>

      <template slot="footer">
        <base-button type="default" @click="showCreateModal = false">Cancel</base-button>
        <base-button type="primary" @click="createCampaign">Create Campaign</base-button>
      </template>
    </modal>

    <!-- Test Push Modal -->
    <modal :show.sync="showTestModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Push to 1 User</h4>
      <div>
        <p class="text-muted">Send a test SMS from <strong>{{ selectedCampaign ? selectedCampaign.name : '' }}</strong> to a single number.</p>
        <base-input label="MSISDN (Phone Number)" v-model="testMsisdn" placeholder="e.g. 254712345678"></base-input>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showTestModal = false">Cancel</base-button>
        <base-button type="success" @click="sendTestPush">Send Test SMS</base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { Select, Option, DatePicker } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import Modal from '@/components/Modal';

export default {
  name: 'SmsCampaigns',
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
      typeFilter: '',
      showCreateModal: false,
      showTestModal: false,
      selectedCampaign: null,
      testMsisdn: '',
      newCampaign: {
        name: '',
        type: 'Broadcast',
        message: '',
        senderId: '',
        csvFile: null,
        subscriberDateRange: null,
        lastChargeDateRange: null,
        lastActivityDateRange: null
      },
      campaigns: [
        { id: 1, name: 'Premier League GW28 Alerts', type: 'Broadcast', status: 'Completed', subscribers: '120,000', sent: '119,420', deliveryRate: 99, scheduledAt: '2025-03-01 08:00' },
        { id: 2, name: 'Champions League Draw Alert', type: 'Broadcast', status: 'Running', subscribers: '250,000', sent: '210,780', deliveryRate: 84, scheduledAt: '2025-03-05 10:30' },
        { id: 3, name: 'FA Cup QF Score Update', type: 'Attribute-Based', status: 'Completed', subscribers: '65,000', sent: '63,450', deliveryRate: 97, scheduledAt: '2025-02-28 18:00' },
        { id: 4, name: 'Fantasy Football Reminder', type: 'Scheduled', status: 'Draft', subscribers: '98,000', sent: '0', deliveryRate: 0, scheduledAt: '2025-03-10 09:00' },
        { id: 5, name: 'Serie A Weekend Preview', type: 'Broadcast', status: 'Failed', subscribers: '45,000', sent: '12,100', deliveryRate: 26, scheduledAt: '2025-03-04 07:00' },
        { id: 6, name: 'UCL Matchday 6 Promo', type: 'Attribute-Based', status: 'Running', subscribers: '180,000', sent: '88,500', deliveryRate: 92, scheduledAt: '2025-03-06 11:00' },
        { id: 7, name: 'La Liga GW26 Results', type: 'Broadcast', status: 'Completed', subscribers: '75,000', sent: '74,100', deliveryRate: 98, scheduledAt: '2025-02-25 20:00' },
      ]
    };
  },
  computed: {
    filteredCampaigns() {
      return this.campaigns.filter(c => {
        const matchSearch = !this.search || c.name.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = !this.statusFilter || c.status === this.statusFilter;
        const matchType = !this.typeFilter || c.type === this.typeFilter;
        return matchSearch && matchStatus && matchType;
      });
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
      this.newCampaign = { name: '', type: 'Broadcast', message: '', senderId: '', csvFile: null, subscriberDateRange: null, lastChargeDateRange: null, lastActivityDateRange: null };
      this.showCreateModal = true;
    },
    createCampaign() {
      if (!this.newCampaign.name || !this.newCampaign.message) {
        this.$notify({ type: 'warning', message: 'Please fill in required fields.' });
        return;
      }
      this.campaigns.unshift({
        id: Date.now(),
        name: this.newCampaign.name,
        type: this.newCampaign.type,
        status: 'Draft',
        subscribers: '0',
        sent: '0',
        deliveryRate: 0,
        scheduledAt: new Date().toLocaleString()
      });
      this.showCreateModal = false;
      this.$notify({ type: 'success', message: 'Campaign created successfully!' });
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
      this.$notify({ type: 'success', message: `Test SMS sent to ${this.testMsisdn}` });
    },
    viewDetails(row) {
      this.$router.push(`/campaigns/${row.id}`);
    },
    clearFilters() {
      this.search = '';
      this.statusFilter = '';
      this.typeFilter = '';
    },
    refreshList() {
      this.$notify({ type: 'info', message: 'Campaign list refreshed.' });
    },
    handleCsvUpload(e) {
      const file = e.target.files[0];
      if (file) this.newCampaign.csvFile = file.name;
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
}

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

/* ── CSV Upload ── */
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
.el-date-editor .el-range-input {
  background: transparent;
  color: #fff;
}
</style>