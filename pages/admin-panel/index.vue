<template>
  <div class="row">

    <!-- ══ PAGE HEADER ══ -->
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="page-title mb-1">Admin Panel</h2>
          <p class="text-muted mb-0">User management, permissions, roles, activity audit, SMTP & branding</p>
        </div>
        <div class="d-flex align-items-center" style="gap:10px;">
          <base-button type="primary" size="sm" @click="openCreateUserModal">
            <i class="tim-icons icon-simple-add mr-1"></i> Create User
          </base-button>
        </div>
      </div>
    </div>

    <!-- ══ STAT CARDS ══ -->
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#e14eca,#ba54f5);">
            <i class="tim-icons icon-single-02"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Users</p>
            <h3 class="stat-value">{{ users.length }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-check-2 text-success"></i>&nbsp;{{ activeUserCount }} active
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#1d8cf8,#3358f4);">
            <i class="tim-icons icon-badge"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Roles Defined</p>
            <h3 class="stat-value">{{ roles.length }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-settings-gear-63"></i>&nbsp;RBAC enabled
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#00bf9a,#00f2c3);">
            <i class="tim-icons icon-notes"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Audit Events Today</p>
            <h3 class="stat-value">{{ auditLogs.length }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-time-alarm"></i>&nbsp;Last: {{ lastAuditTime }}
        </div>
      </card>
    </div>
    <div class="col-lg-3 col-sm-6 d-flex">
      <card class="card-stats stat-card w-100">
        <div class="stat-card-body">
          <div class="stat-icon-circle" style="background:linear-gradient(135deg,#fd5d93,#ec250d);">
            <i class="tim-icons icon-lock-circle"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Locked Accounts</p>
            <h3 class="stat-value">{{ lockedCount }}</h3>
          </div>
        </div>
        <div slot="footer" class="card-footer stat-footer">
          <i class="tim-icons icon-alert-circle-exc text-warning"></i>&nbsp;Requires review
        </div>
      </card>
    </div>

    <!-- ══ ADMIN SECTION TABS ══ -->
    <div class="col-12 mb-3 mt-3">
      <div class="admin-tabs">
        <button v-for="tab in adminTabs" :key="tab.key"
          class="admin-tab-btn" :class="{ 'admin-tab-active': activeTab === tab.key }"
          @click="activeTab = tab.key">
          <i :class="`tim-icons ${tab.icon} mr-2`"></i>{{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════
         TAB 1 — USER MANAGEMENT
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'users'">

      <!-- Search / filter bar -->
      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3 mb-2 mb-md-0">
              <base-input v-model="userSearch" placeholder="Search name or email…" addon-left-icon="tim-icons icon-zoom-split"></base-input>
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
              <el-select v-model="userRoleFilter" placeholder="Filter by Role" class="w-100">
                <el-option label="All Roles" value=""></el-option>
                <el-option v-for="r in roles" :key="r.key" :label="r.name" :value="r.key"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
              <el-select v-model="userStatusFilter" placeholder="Filter by Status" class="w-100">
                <el-option label="All"      value=""></el-option>
                <el-option label="Active"   value="Active"></el-option>
                <el-option label="Inactive" value="Inactive"></el-option>
                <el-option label="Locked"   value="Locked"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <span class="filter-result-count">{{ filteredUsers.length }} users</span>
            </div>
          </div>
        </card>
      </div>

      <!-- Users Table -->
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header" class="d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">All Users</h4>
            <base-button type="primary" size="sm" @click="openCreateUserModal">
              <i class="tim-icons icon-simple-add mr-1"></i> New User
            </base-button>
          </div>
          <el-table :data="filteredUsers" style="width:100%">

            <el-table-column min-width="200" label="User" prop="name">
              <template slot-scope="{ row }">
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: row.avatarColor }">{{ row.initials }}</div>
                  <div>
                    <div class="user-name">{{ row.name }}</div>
                    <div class="user-email">{{ row.email }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="130" sortable label="Role" prop="role">
              <template slot-scope="{ row }">
                <span class="role-badge" :class="'role-' + row.role">{{ row.role }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="110" sortable label="Status" prop="status">
              <template slot-scope="{ row }">
                <span class="status-badge"
                  :class="row.status === 'Active' ? 'badge-success' : row.status === 'Locked' ? 'badge-danger' : 'badge-default'">
                  {{ row.status }}
                </span>
              </template>
            </el-table-column>

            <el-table-column min-width="280" label="Permissions" prop="permissions">
              <template slot-scope="{ row }">
                <div class="perm-chips">
                  <span v-for="p in row.permissions" :key="p"
                    class="perm-chip" :class="'perm-' + p.toLowerCase()">
                    <i :class="permIcon(p)" class="mr-1"></i>{{ p }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="140" sortable label="Last Login" prop="lastLogin"></el-table-column>

            <el-table-column min-width="180" label="Actions" align="center">
              <template slot-scope="{ row }">
                <div class="action-btns">
                  <base-button size="sm" type="info"    icon title="Edit Permissions" @click="openEditModal(row)">
                    <i class="tim-icons icon-pencil"></i>
                  </base-button>
                  <base-button size="sm" type="warning" icon title="Change Password" @click="openPasswordModal(row)">
                    <i class="tim-icons icon-lock-circle"></i>
                  </base-button>
                  <base-button size="sm" :type="row.status === 'Locked' ? 'success' : 'default'" icon
                    :title="row.status === 'Locked' ? 'Unlock Account' : 'Lock Account'"
                    @click="toggleLock(row)">
                    <i :class="row.status === 'Locked' ? 'tim-icons icon-check-2' : 'tim-icons icon-lock-circle'"></i>
                  </base-button>
                  <base-button size="sm" type="danger" icon title="Delete User" @click="deleteUser(row)">
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 2 — ROLES & PERMISSIONS
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'roles'">

      <div class="col-12 mb-2">
        <div class="section-heading d-flex justify-content-between align-items-center">
          <span><i class="tim-icons icon-badge mr-2"></i> Role Definitions</span>
          <base-button size="sm" type="primary" @click="addRole">
            <i class="tim-icons icon-simple-add mr-1"></i> Add Role
          </base-button>
        </div>
      </div>

      <div class="col-lg-4 col-md-6 mb-4" v-for="role in roles" :key="role.key">
        <card class="role-card" :class="'rc-' + role.color">
          <div class="role-card-header">
            <div>
              <h5 class="role-name">{{ role.name }}</h5>
              <p class="text-muted" style="font-size:0.8rem; margin:0;">{{ role.description }}</p>
            </div>
            <div class="d-flex" style="gap:6px;">
              <base-button size="sm" type="info" icon @click="editRole(role)">
                <i class="tim-icons icon-pencil"></i>
              </base-button>
              <base-button size="sm" type="danger" icon @click="deleteRole(role)" :disabled="role.protected">
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </div>
          </div>

          <div class="role-users-count mt-2 mb-3">
            <i class="tim-icons icon-single-02 mr-1"></i>
            {{ usersInRole(role.key) }} user{{ usersInRole(role.key) !== 1 ? 's' : '' }} assigned
          </div>

          <!-- Permission matrix for this role -->
          <div class="perm-matrix">
            <div class="perm-matrix-header">
              <span class="pm-module">Module</span>
              <span class="pm-perm">View</span>
              <span class="pm-perm">Create</span>
              <span class="pm-perm">Delete</span>
            </div>
            <div v-for="mod in modules" :key="mod.key" class="perm-matrix-row">
              <span class="pm-module-label">
                <i :class="`tim-icons ${mod.icon} mr-1`"></i>{{ mod.label }}
              </span>
              <span class="pm-perm-cell">
                <el-switch v-model="role.perms[mod.key + '_view']"
                  active-color="#18ce0f" inactive-color="#333"
                  :disabled="role.protected && mod.key !== 'reporting'">
                </el-switch>
              </span>
              <span class="pm-perm-cell">
                <el-switch v-model="role.perms[mod.key + '_create']"
                  active-color="#e14eca" inactive-color="#333"
                  :disabled="role.protected && mod.key !== 'reporting'">
                </el-switch>
              </span>
              <span class="pm-perm-cell">
                <el-switch v-model="role.perms[mod.key + '_delete']"
                  active-color="#fd5d93" inactive-color="#333"
                  :disabled="role.protected && mod.key !== 'reporting'">
                </el-switch>
              </span>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-3" v-if="!role.protected">
            <base-button size="sm" type="success" @click="saveRole(role)">
              <i class="tim-icons icon-check-2 mr-1"></i> Save Permissions
            </base-button>
          </div>
          <div class="role-protected-note" v-else>
            <i class="tim-icons icon-lock-circle mr-1"></i> System role — partially protected
          </div>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 3 — AUDIT TRAIL
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'audit'">

      <div class="col-12 mb-3">
        <card class="sub-filter-card">
          <div class="row align-items-center">
            <div class="col-md-3 mb-2 mb-md-0">
              <base-input v-model="auditSearch" placeholder="Search user or action…" addon-left-icon="tim-icons icon-zoom-split"></base-input>
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
              <el-select v-model="auditActionFilter" placeholder="Filter by Action" class="w-100">
                <el-option label="All Actions"   value=""></el-option>
                <el-option label="Login"         value="Login"></el-option>
                <el-option label="Logout"        value="Logout"></el-option>
                <el-option label="Create"        value="Create"></el-option>
                <el-option label="Update"        value="Update"></el-option>
                <el-option label="Delete"        value="Delete"></el-option>
                <el-option label="Permission"    value="Permission"></el-option>
                <el-option label="Password"      value="Password"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
              <el-select v-model="auditSeverityFilter" placeholder="Severity" class="w-100">
                <el-option label="All"     value=""></el-option>
                <el-option label="Info"    value="info"></el-option>
                <el-option label="Warning" value="warning"></el-option>
                <el-option label="Critical" value="critical"></el-option>
              </el-select>
            </div>
            <div class="col-md-3 text-right">
              <base-button size="sm" type="default" @click="exportAudit">
                <i class="tim-icons icon-cloud-download-93 mr-1"></i> Export
              </base-button>
            </div>
          </div>
        </card>
      </div>

      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header" class="d-flex justify-content-between align-items-center">
            <h4 class="card-title mb-0">User Activity Audit Trail</h4>
            <span class="text-muted" style="font-size:0.78rem;">{{ filteredAudit.length }} events</span>
          </div>
          <el-table :data="filteredAudit" style="width:100%">

            <el-table-column min-width="55" label="" prop="severity">
              <template slot-scope="{ row }">
                <div class="sev-dot" :class="'sev-' + row.severity" :title="row.severity"></div>
              </template>
            </el-table-column>

            <el-table-column min-width="160" sortable label="Timestamp" prop="timestamp">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.timestamp }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="170" sortable label="User" prop="user">
              <template slot-scope="{ row }">
                <div class="audit-user">
                  <div class="user-avatar sm-avatar" :style="{ background: row.avatarColor }">{{ row.initials }}</div>
                  <span>{{ row.user }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="120" sortable label="Action" prop="action">
              <template slot-scope="{ row }">
                <span class="action-badge" :class="'action-' + row.action.toLowerCase()">{{ row.action }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="220" label="Description" prop="description"></el-table-column>

            <el-table-column min-width="130" sortable label="Module" prop="module">
              <template slot-scope="{ row }">
                <span class="text-muted" style="font-size:0.8rem;">{{ row.module }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="130" sortable label="IP Address" prop="ip">
              <template slot-scope="{ row }">
                <span class="mono-text">{{ row.ip }}</span>
              </template>
            </el-table-column>

          </el-table>
        </card>
      </div>
    </template>

    <!-- ══════════════════════════════════
         TAB 4 — SMTP CONFIGURATION
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'smtp'">

      <div class="col-12 mb-2">
        <div class="section-heading">
          <i class="tim-icons icon-email-85 mr-2"></i> SMTP Configuration
        </div>
      </div>

      <div class="col-lg-8 col-12">
        <card class="accent-card accent-blue">
          <div class="config-card-header mb-4">
            <div>
              <h5 class="config-card-title">Email / SMTP Settings</h5>
              <p class="config-card-sub text-muted">Used for sending password reset emails, account creation notifications and system alerts to users.</p>
            </div>
            <div class="d-flex" style="gap:8px;">
              <base-button v-if="!smtpEditMode" type="info" size="sm" @click="smtpEditMode = true">
                <i class="tim-icons icon-pencil mr-1"></i> Edit
              </base-button>
              <template v-else>
                <base-button type="default" size="sm" @click="smtpEditMode = false">Cancel</base-button>
                <base-button type="success" size="sm" @click="saveSmtp">
                  <i class="tim-icons icon-check-2 mr-1"></i> Save
                </base-button>
              </template>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="config-label">SMTP Host</label>
              <base-input v-model="smtp.host" placeholder="e.g. smtp.mailgun.org" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-3 mb-3">
              <label class="config-label">Port</label>
              <base-input v-model="smtp.port" type="number" placeholder="587" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-3 mb-3">
              <label class="config-label">Encryption</label>
              <el-select v-model="smtp.encryption" :disabled="!smtpEditMode" class="w-100">
                <el-option label="TLS"  value="tls"></el-option>
                <el-option label="SSL"  value="ssl"></el-option>
                <el-option label="None" value="none"></el-option>
              </el-select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">Username / Email</label>
              <base-input v-model="smtp.username" placeholder="no-reply@vasplatform.com" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">Password</label>
              <div class="password-wrap">
                <base-input v-model="smtp.password" :type="showSmtpPw ? 'text' : 'password'" placeholder="••••••••" :disabled="!smtpEditMode"></base-input>
                <button class="eye-btn" @click="showSmtpPw = !showSmtpPw" type="button">
                  <i :class="showSmtpPw ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">From Name</label>
              <base-input v-model="smtp.fromName" placeholder="VAS Platform" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">From Email</label>
              <base-input v-model="smtp.fromEmail" placeholder="no-reply@vasplatform.com" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">Admin Reply-To</label>
              <base-input v-model="smtp.replyTo" placeholder="admin@vasplatform.com" :disabled="!smtpEditMode"></base-input>
            </div>
            <div class="col-md-6 mb-3">
              <label class="config-label">Connection Timeout (s)</label>
              <base-input v-model="smtp.timeout" type="number" placeholder="30" :disabled="!smtpEditMode"></base-input>
            </div>
          </div>

          <!-- Test connection -->
          <div class="smtp-test-row">
            <div class="smtp-status-indicator" :class="'smtp-' + smtpTestStatus">
              <span class="smtp-status-dot"></span>
              <span class="smtp-status-label">{{ smtpStatusLabel }}</span>
            </div>
            <div class="d-flex" style="gap:8px;">
              <base-input v-model="smtpTestEmail" placeholder="test@example.com" style="margin:0; width:220px;"></base-input>
              <base-button type="info" size="sm" @click="testSmtp" :disabled="smtpTesting">
                <i class="tim-icons icon-send mr-1"></i> {{ smtpTesting ? 'Sending…' : 'Send Test Email' }}
              </base-button>
            </div>
          </div>
        </card>
      </div>

      <!-- Email Templates Info Panel -->
      <div class="col-lg-4 col-12">
        <card class="accent-card accent-purple">
          <h5 class="config-card-title mb-3">Email Triggers</h5>
          <div class="email-trigger-list">
            <div v-for="trigger in emailTriggers" :key="trigger.id" class="email-trigger-item">
              <div class="et-icon" :class="'et-' + trigger.color">
                <i :class="`tim-icons ${trigger.icon}`"></i>
              </div>
              <div class="et-body">
                <div class="et-label">{{ trigger.label }}</div>
                <div class="et-desc">{{ trigger.desc }}</div>
              </div>
              <el-switch v-model="trigger.enabled" active-color="#18ce0f" inactive-color="#333"></el-switch>
            </div>
          </div>
        </card>
      </div>

    </template>

    <!-- ══════════════════════════════════
         TAB 5 — BRANDING
    ══════════════════════════════════ -->
    <template v-if="activeTab === 'branding'">

      <div class="col-12 mb-2">
        <div class="section-heading d-flex justify-content-between align-items-center">
          <span><i class="tim-icons icon-image-02 mr-2"></i> Platform Branding</span>
          <div style="gap:8px;" class="d-flex">
            <base-button v-if="!brandEditMode" size="sm" type="info" @click="brandEditMode = true">
              <i class="tim-icons icon-pencil mr-1"></i> Edit Settings
            </base-button>
            <template v-else>
              <base-button size="sm" type="default" @click="cancelBrandEdit">Cancel</base-button>
              <base-button size="sm" type="success" @click="saveBranding">
                <i class="tim-icons icon-check-2 mr-1"></i> Save Branding
              </base-button>
            </template>
          </div>
        </div>
      </div>

      <!-- Logo Upload Card -->
      <div class="col-lg-7 col-12 mb-4">
        <card class="accent-card accent-purple">
          <h5 class="config-card-title mb-1">Platform Logo</h5>
          <p class="text-muted mb-4" style="font-size:0.8rem;">Upload your logo in PNG or SVG format. Recommended size: 200×60px. Max 2MB.</p>

          <!-- Current / Preview display -->
          <div class="logo-preview-row mb-4">
            <div class="logo-current-wrap">
              <div class="logo-current-label">Current Logo</div>
              <div class="logo-display logo-display-current">
                <img :src="currentLogoUrl" alt="Current Logo" class="logo-img" />
              </div>
            </div>
            <div class="logo-arrow">
              <i class="tim-icons icon-minimal-right"></i>
            </div>
            <div class="logo-current-wrap">
              <div class="logo-current-label">Preview</div>
              <div class="logo-display logo-display-preview" :class="{ 'logo-has-pending': pendingLogo }">
                <img v-if="pendingLogo" :src="pendingLogo" alt="Logo Preview" class="logo-img" />
                <div v-else class="logo-placeholder logo-placeholder-dim">
                  <i class="tim-icons icon-upload"></i>
                  <span>Upload to preview</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Drop zone -->
          <div
            class="logo-dropzone"
            :class="{ 'dz-active': logoDropActive }"
            @dragover.prevent="logoDropActive = true"
            @dragleave="logoDropActive = false"
            @drop.prevent="handleLogoDrop"
            @click="$refs.logoFileInput.click()"
          >
            <input ref="logoFileInput" type="file" accept="image/png,image/svg+xml,image/jpeg" style="display:none;" @change="handleLogoFile" />
            <div class="dz-icon">
              <i class="tim-icons icon-cloud-upload-94"></i>
            </div>
            <p class="dz-main">Drag & drop your logo here</p>
            <p class="dz-sub">or <span class="dz-link">browse files</span> — PNG, SVG, JPG · max 2MB</p>
          </div>

          <!-- File info + actions -->
          <div v-if="pendingLogoFile" class="logo-file-info mt-3">
            <div class="lfi-icon"><i class="tim-icons icon-paper"></i></div>
            <div class="lfi-body">
              <div class="lfi-name">{{ pendingLogoFile.name }} → <strong>brand_logo.{{ pendingLogoExt }}</strong></div>
              <div class="lfi-size">{{ formatFileSize(pendingLogoFile.size) }}</div>
            </div>
            <base-button size="sm" type="success" @click="uploadLogo" :disabled="logoUploading">
              <i class="tim-icons icon-cloud-upload-94 mr-1"></i>
              {{ logoUploading ? 'Uploading…' : 'Upload & Apply' }}
            </base-button>
            <base-button size="sm" type="default" @click="clearPendingLogo" :disabled="logoUploading">
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>

          <!-- Logo History -->
          <div class="logo-history mt-4" v-if="logoHistory.length">
            <div class="logo-history-title">Upload History</div>
            <div v-for="entry in logoHistory" :key="entry.id" class="logo-history-item">
              <div class="lhi-dot" :class="entry.active ? 'lhi-active' : 'lhi-old'"></div>
              <div class="lhi-body">
                <span class="lhi-label">{{ entry.label }}</span>
                <span class="lhi-date">{{ entry.date }}</span>
              </div>
              <span v-if="entry.active" class="lhi-badge">Current</span>
            </div>
          </div>
        </card>
      </div>


      <!-- <div class="col-lg-5 col-12 mb-4">
        <card class="accent-card accent-blue">
          <h5 class="config-card-title mb-1">Brand Settings</h5>
          <p class="text-muted mb-4" style="font-size:0.8rem;">Customise your platform's display name and accent colours.</p>

          <div class="mb-3">
            <label class="config-label">Platform / Site Name</label>
            <div class="brand-input-wrap" :class="{ 'brand-input-active': brandEditMode }">
              <i class="tim-icons icon-badge brand-input-icon"></i>
              <input v-model="brandSiteName" class="brand-input" :disabled="!brandEditMode" placeholder="e.g. VAS Platform" />
            </div>
          </div>

          <div class="mb-3">
            <label class="config-label">Primary Accent Colour</label>
            <div class="color-picker-row">
              <div class="color-swatch-wrap">
                <input type="color" v-model="brandPrimaryColor" :disabled="!brandEditMode" class="color-swatch-input" />
                <div class="color-swatch-preview" :style="{ background: brandPrimaryColor }"></div>
              </div>
              <div class="brand-input-wrap flex-1" :class="{ 'brand-input-active': brandEditMode }">
                <input v-model="brandPrimaryColor" class="brand-input mono-text" :disabled="!brandEditMode" placeholder="#e14eca" />
              </div>
              <div class="color-presets">
                <div v-for="c in colorPresets" :key="c" class="color-preset-dot" :style="{ background: c }"
                  @click="brandEditMode && (brandPrimaryColor = c)" :class="{ 'cp-selected': brandPrimaryColor === c }">
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="config-label">Secondary Accent Colour</label>
            <div class="color-picker-row">
              <div class="color-swatch-wrap">
                <input type="color" v-model="brandAccentColor" :disabled="!brandEditMode" class="color-swatch-input" />
                <div class="color-swatch-preview" :style="{ background: brandAccentColor }"></div>
              </div>
              <div class="brand-input-wrap flex-1" :class="{ 'brand-input-active': brandEditMode }">
                <input v-model="brandAccentColor" class="brand-input mono-text" :disabled="!brandEditMode" placeholder="#1d8cf8" />
              </div>
              <div class="color-presets">
                <div v-for="c in colorPresets" :key="c" class="color-preset-dot" :style="{ background: c }"
                  @click="brandEditMode && (brandAccentColor = c)" :class="{ 'cp-selected': brandAccentColor === c }">
                </div>
              </div>
            </div>
          </div>

          <div class="brand-live-preview">
            <div class="blp-label">Live Preview</div>
            <div class="blp-bar" :style="{ background: brandPrimaryColor }">
              <span class="blp-site-name">{{ brandSiteName || 'VAS Platform' }}</span>
              <div class="blp-dot" :style="{ background: brandAccentColor }"></div>
            </div>
            <div class="blp-content">
              <div class="blp-tag" :style="{ background: brandPrimaryColor + '22', color: brandPrimaryColor, borderColor: brandPrimaryColor + '55' }">Primary</div>
              <div class="blp-tag" :style="{ background: brandAccentColor  + '22', color: brandAccentColor,  borderColor: brandAccentColor  + '55' }">Accent</div>
              <div class="blp-btn" :style="{ background: brandPrimaryColor }">Button</div>
            </div>
          </div>

        </card>
      </div> -->

    </template>

    <!-- ══════════════════════════════════
         CREATE / EDIT USER MODAL
    ══════════════════════════════════ -->
    <modal :show.sync="showUserModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">{{ editingUser ? 'Edit User' : 'Create New User' }}</h4>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="config-label">Full Name</label>
          <base-input v-model="userForm.name" placeholder="e.g. John Doe"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Email Address</label>
          <base-input v-model="userForm.email" placeholder="john@vasplatform.com" type="email"></base-input>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Role</label>
          <el-select v-model="userForm.role" class="w-100">
            <el-option v-for="r in roles" :key="r.key" :label="r.name" :value="r.key"></el-option>
          </el-select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="config-label">Status</label>
          <el-select v-model="userForm.status" class="w-100">
            <el-option label="Active"   value="Active"></el-option>
            <el-option label="Inactive" value="Inactive"></el-option>
          </el-select>
        </div>
        <div class="col-12 mb-3" v-if="!editingUser">
          <label class="config-label">Temporary Password</label>
          <div class="password-wrap">
            <base-input v-model="userForm.password" :type="showNewPw ? 'text' : 'password'" placeholder="Min 8 characters"></base-input>
            <button class="eye-btn" @click="showNewPw = !showNewPw" type="button">
              <i :class="showNewPw ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
            </button>
          </div>
          <div class="d-flex justify-content-end mt-1">
            <small class="text-info" style="cursor:pointer;" @click="generatePassword">
              <i class="tim-icons icon-refresh-02 mr-1"></i> Generate password
            </small>
          </div>
        </div>

        <!-- Permissions override -->
        <div class="col-12 mb-2">
          <label class="config-label">Permissions Override
            <span class="text-muted" style="font-size:0.65rem; font-weight:400; text-transform:none; letter-spacing:0;">(overrides role defaults)</span>
          </label>
          <div class="perm-override-grid">
            <div v-for="p in allPermissions" :key="p.key" class="perm-override-item">
              <el-switch v-model="userForm.permOverrides[p.key]" active-color="#e14eca" inactive-color="#333"></el-switch>
              <span class="perm-override-label">{{ p.label }}</span>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex align-items-center" style="gap:10px;">
            <el-switch v-model="userForm.sendWelcomeEmail" active-color="#18ce0f" inactive-color="#333"></el-switch>
            <span class="text-muted" style="font-size:0.82rem;">Send welcome email with login credentials</span>
          </div>
        </div>
      </div>

      <template slot="footer">
        <base-button type="default" @click="showUserModal = false">Cancel</base-button>
        <base-button type="success" @click="saveUser">
          <i class="tim-icons icon-check-2 mr-1"></i> {{ editingUser ? 'Save Changes' : 'Create User' }}
        </base-button>
      </template>
    </modal>

    <!-- ══ CHANGE PASSWORD MODAL ══ -->
    <modal :show.sync="showPasswordModal" class="modal-black" :show-close="true" header-classes="justify-content-center">
      <h4 slot="header" class="title title-up">Change Password</h4>
      <div v-if="passwordTargetUser">
        <div class="pw-user-banner mb-4">
          <div class="user-avatar" :style="{ background: passwordTargetUser.avatarColor }">{{ passwordTargetUser.initials }}</div>
          <div>
            <div class="user-name">{{ passwordTargetUser.name }}</div>
            <div class="user-email">{{ passwordTargetUser.email }}</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="config-label">New Password</label>
          <div class="password-wrap">
            <base-input v-model="newPassword" :type="showPwModal ? 'text' : 'password'" placeholder="Min 8 characters"></base-input>
            <button class="eye-btn" @click="showPwModal = !showPwModal" type="button">
              <i :class="showPwModal ? 'tim-icons icon-simple-remove' : 'tim-icons icon-zoom-split'"></i>
            </button>
          </div>
        </div>
        <div class="mb-3">
          <label class="config-label">Confirm Password</label>
          <base-input v-model="confirmPassword" :type="showPwModal ? 'text' : 'password'" placeholder="Repeat password"></base-input>
        </div>
        <div class="pw-strength-bar mb-2">
          <div class="pw-strength-fill" :style="{ width: pwStrength + '%', background: pwStrengthColor }"></div>
        </div>
        <small :style="{ color: pwStrengthColor }">{{ pwStrengthLabel }}</small>
        <div class="mt-3 d-flex align-items-center" style="gap:10px;">
          <el-switch v-model="forceChangeOnLogin" active-color="#e14eca" inactive-color="#333"></el-switch>
          <span class="text-muted" style="font-size:0.82rem;">Force user to change password on next login</span>
        </div>
        <div class="mt-2 d-flex align-items-center" style="gap:10px;">
          <el-switch v-model="sendPasswordEmail" active-color="#18ce0f" inactive-color="#333"></el-switch>
          <span class="text-muted" style="font-size:0.82rem;">Email new password to user via SMTP</span>
        </div>
      </div>
      <template slot="footer">
        <base-button type="default" @click="showPasswordModal = false">Cancel</base-button>
        <base-button type="warning" @click="savePassword">
          <i class="tim-icons icon-lock-circle mr-1"></i> Update Password
        </base-button>
      </template>
    </modal>

  </div>
</template>

<script>
import { Select, Option, Switch } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import Modal from '@/components/Modal';

const AVATAR_COLORS = ['#e14eca','#1d8cf8','#00f2c3','#ff8d72','#ba54f5','#fd5d93','#18ce0f'];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export default {
  name: 'AdminPanel',
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Switch.name]: Switch,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      activeTab: 'users',

      adminTabs: [
        { key: 'users',  label: 'User Management',    icon: 'icon-single-02' },
        { key: 'roles',  label: 'Roles & Permissions', icon: 'icon-badge' },
        { key: 'audit',  label: 'Audit Trail',         icon: 'icon-notes' },
        { key: 'smtp',     label: 'SMTP Config',         icon: 'icon-email-85' },
        { key: 'branding', label: 'Branding',            icon: 'icon-image-02' },
      ],

      // ── Users ──
      userSearch: '', userRoleFilter: '', userStatusFilter: '',
      users: [
        { id:1, name:'Ahmed Hassan',   email:'ahmed@vasplatform.com',   role:'admin',    status:'Active',   permissions:['View','Create','Delete'], lastLogin:'2025-03-07 09:14', avatarColor:'#e14eca', initials:'AH' },
        { id:2, name:'Sara Kimani',    email:'sara@vasplatform.com',    role:'manager',  status:'Active',   permissions:['View','Create'],          lastLogin:'2025-03-07 08:55', avatarColor:'#1d8cf8', initials:'SK' },
        { id:3, name:'James Mwangi',   email:'james@vasplatform.com',   role:'operator', status:'Active',   permissions:['View'],                   lastLogin:'2025-03-06 17:32', avatarColor:'#00f2c3', initials:'JM' },
        { id:4, name:'Lydia Ochieng',  email:'lydia@vasplatform.com',   role:'analyst',  status:'Active',   permissions:['View'],                   lastLogin:'2025-03-07 07:10', avatarColor:'#ff8d72', initials:'LO' },
        { id:5, name:'Peter Otieno',   email:'peter@vasplatform.com',   role:'operator', status:'Inactive', permissions:['View'],                   lastLogin:'2025-02-28 14:22', avatarColor:'#ba54f5', initials:'PO' },
        { id:6, name:'Grace Njeri',    email:'grace@vasplatform.com',   role:'manager',  status:'Locked',   permissions:['View','Create'],          lastLogin:'2025-03-01 11:05', avatarColor:'#fd5d93', initials:'GN' },
        { id:7, name:'Kevin Omondi',   email:'kevin@vasplatform.com',   role:'analyst',  status:'Active',   permissions:['View'],                   lastLogin:'2025-03-07 06:48', avatarColor:'#18ce0f', initials:'KO' },
      ],

      // ── Roles ──
      roles: [
        {
          key:'admin', name:'Administrator', color:'purple', description:'Full system access. Can manage users, roles and all configs.', protected:true,
          perms:{ campaigns_view:true,  campaigns_create:true,  campaigns_delete:true,
                  sms_view:true,        sms_create:true,        sms_delete:true,
                  ussd_view:true,       ussd_create:true,       ussd_delete:true,
                  ivr_view:true,        ivr_create:true,        ivr_delete:true,
                  reporting_view:true,  reporting_create:true,  reporting_delete:false,
                  admin_view:true,      admin_create:true,      admin_delete:true }
        },
        {
          key:'manager', name:'Campaign Manager', color:'blue', description:'Can create and manage campaigns but cannot delete users or system config.', protected:false,
          perms:{ campaigns_view:true,  campaigns_create:true,  campaigns_delete:true,
                  sms_view:true,        sms_create:true,        sms_delete:false,
                  ussd_view:true,       ussd_create:false,      ussd_delete:false,
                  ivr_view:true,        ivr_create:true,        ivr_delete:false,
                  reporting_view:true,  reporting_create:false, reporting_delete:false,
                  admin_view:false,     admin_create:false,     admin_delete:false }
        },
        {
          key:'operator', name:'Operator', color:'teal', description:'Read-only access with ability to start/stop service controls.', protected:false,
          perms:{ campaigns_view:true,  campaigns_create:false, campaigns_delete:false,
                  sms_view:true,        sms_create:false,       sms_delete:false,
                  ussd_view:true,       ussd_create:false,      ussd_delete:false,
                  ivr_view:true,        ivr_create:false,       ivr_delete:false,
                  reporting_view:true,  reporting_create:false, reporting_delete:false,
                  admin_view:false,     admin_create:false,     admin_delete:false }
        },
        {
          key:'analyst', name:'Analyst', color:'orange', description:'Read-only access to reporting and dashboards.', protected:false,
          perms:{ campaigns_view:true,  campaigns_create:false, campaigns_delete:false,
                  sms_view:false,       sms_create:false,       sms_delete:false,
                  ussd_view:false,      ussd_create:false,      ussd_delete:false,
                  ivr_view:false,       ivr_create:false,       ivr_delete:false,
                  reporting_view:true,  reporting_create:false, reporting_delete:false,
                  admin_view:false,     admin_create:false,     admin_delete:false }
        },
      ],

      modules: [
        { key:'campaigns', label:'Campaigns', icon:'icon-send' },
        { key:'sms',       label:'SMS',       icon:'icon-chat-33' },
        { key:'ussd',      label:'USSD',      icon:'icon-mobile' },
        { key:'ivr',       label:'IVR',       icon:'icon-headphones' },
        { key:'reporting', label:'Reporting', icon:'icon-notes' },
        { key:'admin',     label:'Admin',     icon:'icon-settings-gear-63' },
      ],

      // ── Audit ──
      auditSearch: '', auditActionFilter: '', auditSeverityFilter: '',
      auditLogs: [
        { id:1,  timestamp:'2025-03-07 09:14:02', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Login',      module:'Auth',       description:'Successful login from IP 197.156.X.X',        ip:'197.156.12.4',  severity:'info' },
        { id:2,  timestamp:'2025-03-07 09:15:30', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Create',     module:'Campaigns',  description:'Created campaign "EPL GW29 Alerts"',            ip:'197.156.12.4',  severity:'info' },
        { id:3,  timestamp:'2025-03-07 09:18:44', user:'Sara Kimani',   initials:'SK', avatarColor:'#1d8cf8', action:'Login',      module:'Auth',       description:'Successful login from IP 41.90.X.X',           ip:'41.90.100.12',  severity:'info' },
        { id:4,  timestamp:'2025-03-07 09:22:10', user:'Sara Kimani',   initials:'SK', avatarColor:'#1d8cf8', action:'Update',     module:'SMS Config', description:'Updated SMPP bind type to Transceiver',         ip:'41.90.100.12',  severity:'warning' },
        { id:5,  timestamp:'2025-03-07 09:30:05', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Permission', module:'Admin',      description:'Changed role of "Grace Njeri" to Locked',       ip:'197.156.12.4',  severity:'warning' },
        { id:6,  timestamp:'2025-03-07 09:45:18', user:'James Mwangi',  initials:'JM', avatarColor:'#00f2c3', action:'Login',      module:'Auth',       description:'Failed login — incorrect password (attempt 3)', ip:'105.163.2.8',   severity:'critical' },
        { id:7,  timestamp:'2025-03-07 10:02:44', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Delete',     module:'Campaigns',  description:'Deleted campaign "Serie A Weekend Preview"',     ip:'197.156.12.4',  severity:'warning' },
        { id:8,  timestamp:'2025-03-07 10:15:00', user:'Lydia Ochieng', initials:'LO', avatarColor:'#ff8d72', action:'Login',      module:'Auth',       description:'Successful login from IP 154.120.X.X',          ip:'154.120.44.2',  severity:'info' },
        { id:9,  timestamp:'2025-03-07 10:22:33', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Password',   module:'Admin',      description:'Reset password for user "Peter Otieno"',         ip:'197.156.12.4',  severity:'warning' },
        { id:10, timestamp:'2025-03-07 10:35:12', user:'Sara Kimani',   initials:'SK', avatarColor:'#1d8cf8', action:'Create',     module:'Users',      description:'Created new user "Kevin Omondi" with role Analyst', ip:'41.90.100.12', severity:'info' },
        { id:11, timestamp:'2025-03-07 11:00:45', user:'Kevin Omondi',  initials:'KO', avatarColor:'#18ce0f', action:'Login',      module:'Auth',       description:'Successful first login',                         ip:'41.90.88.71',   severity:'info' },
        { id:12, timestamp:'2025-03-07 11:14:09', user:'Ahmed Hassan',  initials:'AH', avatarColor:'#e14eca', action:'Update',     module:'SMTP',       description:'Updated SMTP host to smtp.mailgun.org',          ip:'197.156.12.4',  severity:'warning' },
      ],

      // ── SMTP ──
      smtpEditMode: false,
      showSmtpPw: false,
      smtpTestStatus: 'idle',
      smtpTesting: false,
      smtpTestEmail: '',
      smtp: {
        host: 'smtp.mailgun.org', port: 587, encryption: 'tls',
        username: 'no-reply@vasplatform.com', password: 'smtp_secret_key',
        fromName: 'VAS Platform', fromEmail: 'no-reply@vasplatform.com',
        replyTo: 'admin@vasplatform.com', timeout: 30
      },
      emailTriggers: [
        { id:1, label:'Welcome Email',        desc:'Sent when a new user is created',           icon:'icon-single-02',    color:'teal',   enabled:true  },
        { id:2, label:'Password Reset',       desc:'Sent when admin resets a user password',    icon:'icon-lock-circle',  color:'orange', enabled:true  },
        { id:3, label:'Account Locked',       desc:'Alert sent when account is locked',         icon:'icon-alert-circle-exc', color:'red', enabled:true  },
        { id:4, label:'Login Failure Alert',  desc:'Alert after 3 consecutive failed logins',   icon:'icon-alert-circle-exc', color:'red', enabled:true  },
        { id:5, label:'Role Change Notice',   desc:'Notify user when their role is changed',    icon:'icon-badge',        color:'blue',   enabled:false },
        { id:6, label:'Service Alert',        desc:'Critical service stop/start notifications', icon:'icon-settings-gear-63', color:'purple', enabled:true },
      ],

      // ── Modals ──
      showUserModal: false,
      showPasswordModal: false,
      editingUser: null,
      passwordTargetUser: null,
      newPassword: '', confirmPassword: '',
      showPwModal: false, showNewPw: false,
      forceChangeOnLogin: true, sendPasswordEmail: true,
      userForm: {
        name:'', email:'', role:'operator', status:'Active',
        password:'', sendWelcomeEmail: true,
        permOverrides: {}
      },

      // ── Branding ──
      currentLogoUrl:  '/img/brand_logo.svg',
      pendingLogo:     null,
      pendingLogoFile: null,
      logoUploading:   false,
      logoHistory: [
        { id:1, date:'2025-03-01 10:22', label:'brand_logo.svg (current)', active:true },
      ],
      brandPrimaryColor: '#e14eca',
      brandAccentColor:  '#1d8cf8',
      brandSiteName:     'VAS Platform',
      brandEditMode:     false,
      logoDropActive:    false,

      allPermissions: [
        { key:'view_campaigns',   label:'View Campaigns'   },
        { key:'create_campaigns', label:'Create Campaigns' },
        { key:'delete_campaigns', label:'Delete Campaigns' },
        { key:'view_reports',     label:'View Reports'     },
        { key:'manage_sms',       label:'Manage SMS'       },
        { key:'manage_ussd',      label:'Manage USSD'      },
        { key:'manage_ivr',       label:'Manage IVR'       },
        { key:'view_admin',       label:'View Admin'       },
      ],
    };
  },
  computed: {
    activeUserCount() { return this.users.filter(u => u.status === 'Active').length; },
    lockedCount()     { return this.users.filter(u => u.status === 'Locked').length; },
    lastAuditTime()   { return this.auditLogs.length ? this.auditLogs[0].timestamp.slice(11) : '—'; },
    filteredUsers() {
      const s = this.userSearch.toLowerCase();
      return this.users.filter(u =>
        (!s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
        && (!this.userRoleFilter   || u.role   === this.userRoleFilter)
        && (!this.userStatusFilter || u.status === this.userStatusFilter)
      );
    },
    filteredAudit() {
      const s = this.auditSearch.toLowerCase();
      return this.auditLogs.filter(l =>
        (!s || l.user.toLowerCase().includes(s) || l.description.toLowerCase().includes(s))
        && (!this.auditActionFilter   || l.action   === this.auditActionFilter)
        && (!this.auditSeverityFilter || l.severity === this.auditSeverityFilter)
      );
    },
    pwStrength() {
      const pw = this.newPassword;
      if (!pw) return 0;
      let score = 0;
      if (pw.length >= 8)  score += 25;
      if (pw.length >= 12) score += 15;
      if (/[A-Z]/.test(pw)) score += 20;
      if (/[0-9]/.test(pw)) score += 20;
      if (/[^A-Za-z0-9]/.test(pw)) score += 20;
      return Math.min(score, 100);
    },
    pwStrengthColor() {
      if (this.pwStrength < 30) return '#fd5d93';
      if (this.pwStrength < 60) return '#ff8d72';
      if (this.pwStrength < 85) return '#1d8cf8';
      return '#18ce0f';
    },
    pwStrengthLabel() {
      if (!this.newPassword) return '';
      if (this.pwStrength < 30) return 'Weak';
      if (this.pwStrength < 60) return 'Fair';
      if (this.pwStrength < 85) return 'Good';
      return 'Strong';
    },
    colorPresets() {
      return ['#e14eca','#1d8cf8','#00f2c3','#ff8d72','#fd5d93','#ba54f5','#18ce0f','#ff5f6d'];
    },
    pendingLogoExt() {
      if (!this.pendingLogoFile) return '';
      const map = { 'image/png':'png', 'image/jpeg':'jpg', 'image/svg+xml':'svg' };
      return map[this.pendingLogoFile.type] || 'png';
    },
    smtpStatusLabel() {
      return { idle:'Not tested', success:'Connection OK', error:'Connection Failed', testing:'Testing…' }[this.smtpTestStatus] || '';
    }
  },
  methods: {
    usersInRole(key) { return this.users.filter(u => u.role === key).length; },
    permIcon(p) {
      return { View:'tim-icons icon-zoom-split', Create:'tim-icons icon-simple-add', Delete:'tim-icons icon-simple-remove' }[p] || '';
    },
    openCreateUserModal() {
      this.editingUser = null;
      this.userForm = { name:'', email:'', role:'operator', status:'Active', password:'', sendWelcomeEmail:true, permOverrides:{} };
      this.showNewPw = false;
      this.showUserModal = true;
    },
    openEditModal(user) {
      this.editingUser = user;
      this.userForm = { ...user, permOverrides:{} };
      this.showUserModal = true;
    },
    saveUser() {
      if (this.editingUser) {
        const idx = this.users.findIndex(u => u.id === this.editingUser.id);
        if (idx !== -1) Object.assign(this.users[idx], { name: this.userForm.name, email: this.userForm.email, role: this.userForm.role, status: this.userForm.status });
        this.$notify({ type:'success', message:`User "${this.userForm.name}" updated.` });
      } else {
        this.users.push({
          id: Date.now(), name: this.userForm.name, email: this.userForm.email,
          role: this.userForm.role, status: this.userForm.status,
          permissions: ['View'], lastLogin:'Never',
          avatarColor: randomColor(), initials: initials(this.userForm.name)
        });
        this.$notify({ type:'success', message:`User "${this.userForm.name}" created.` });
      }
      this.showUserModal = false;
    },
    deleteUser(user) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.$notify({ type:'danger', message:`User "${user.name}" deleted.` });
    },
    toggleLock(user) {
      user.status = user.status === 'Locked' ? 'Active' : 'Locked';
      this.$notify({ type: user.status === 'Locked' ? 'warning' : 'success', message:`Account "${user.name}" ${user.status === 'Locked' ? 'locked' : 'unlocked'}.` });
    },
    openPasswordModal(user) {
      this.passwordTargetUser = user;
      this.newPassword = '';
      this.confirmPassword = '';
      this.showPwModal = false;
      this.forceChangeOnLogin = true;
      this.sendPasswordEmail = true;
      this.showPasswordModal = true;
    },
    savePassword() {
      if (!this.newPassword || this.newPassword !== this.confirmPassword) {
        this.$notify({ type:'danger', message:'Passwords do not match.' }); return;
      }
      this.$notify({ type:'success', message:`Password updated for "${this.passwordTargetUser.name}".` });
      this.showPasswordModal = false;
    },
    generatePassword() {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
      this.userForm.password = Array.from({length:12}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
    },
    saveRole(role) { this.$notify({ type:'success', message:`Permissions for "${role.name}" saved.` }); },
    addRole() { this.$notify({ type:'info', message:'Role builder coming soon.' }); },
    editRole(role) { this.$notify({ type:'info', message:`Editing role "${role.name}"…` }); },
    deleteRole(role) {
      if (role.protected) { this.$notify({ type:'warning', message:'System roles cannot be deleted.' }); return; }
      this.roles = this.roles.filter(r => r.key !== role.key);
      this.$notify({ type:'danger', message:`Role "${role.name}" deleted.` });
    },
    exportAudit() { this.$notify({ type:'success', message:'Audit log exported as CSV.' }); },
    saveSmtp() {
      this.smtpEditMode = false;
      this.$notify({ type:'success', message:'SMTP configuration saved.' });
    },
    testSmtp() {
      if (!this.smtpTestEmail) { this.$notify({ type:'warning', message:'Enter a test email address.' }); return; }
      this.smtpTesting = true;
      this.smtpTestStatus = 'testing';
      setTimeout(() => {
        this.smtpTesting = false;
        this.smtpTestStatus = 'success';
        this.$notify({ type:'success', message:`Test email sent to ${this.smtpTestEmail}.` });
      }, 2000);
    },
    // ── Branding ──
    handleLogoFile(e) {
      const file = e.target.files[0];
      if (file) this.loadLogoFile(file);
    },
    handleLogoDrop(e) {
      this.logoDropActive = false;
      const file = e.dataTransfer.files[0];
      if (file) this.loadLogoFile(file);
    },
    loadLogoFile(file) {
      const ALLOWED = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!ALLOWED.includes(file.type)) {
        this.$notify({ type:'danger', message:'Only PNG, JPG and SVG files are allowed.' }); return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$notify({ type:'danger', message:'File exceeds 2MB limit.' }); return;
      }
      this.pendingLogoFile = file;
      const reader = new FileReader();
      reader.onload = e => { this.pendingLogo = e.target.result; };
      reader.readAsDataURL(file);
    },
    async uploadLogo() {
      if (!this.pendingLogoFile) return;
      this.logoUploading = true;
      try {
        const formData = new FormData();
        formData.append('logo', this.pendingLogoFile);

        const response = await fetch('/api/upload-logo', {
          method: 'POST',
          body: formData,
        });

        const res = await response.json();

        if (res.success) {
          this.currentLogoUrl = res.url;
          this.logoHistory.forEach(h => h.active = false);
          this.logoHistory.unshift({
            id:     Date.now(),
            date:   new Date().toISOString().slice(0,16).replace('T',' '),
            label:  `${this.pendingLogoFile.name} → ${res.filename}`,
            active: true,
          });
          this.clearPendingLogo();
          this.$notify({ type:'success', message:`Logo saved as "${res.filename}".` });
        } else {
          this.$notify({ type:'danger', message: res.message || 'Upload failed.' });
        }
      } catch (err) {
        console.error('[uploadLogo frontend]', err);
        this.$notify({ type:'danger', message: 'Upload error: ' + err.message });
      } finally {
        this.logoUploading = false;
      }
    },
    clearPendingLogo() {
      this.pendingLogo = null;
      this.pendingLogoFile = null;
      if (this.$refs.logoFileInput) this.$refs.logoFileInput.value = '';
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    cancelBrandEdit() { this.brandEditMode = false; },
    saveBranding() {
      this.brandEditMode = false;
      this.$notify({ type:'success', message:'Brand settings saved.' });
    },
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

/* ══ Admin Tabs ══ */
.admin-tabs { display:flex; gap:6px; border-bottom:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; }
.admin-tab-btn { background:transparent; border:1px solid transparent; border-bottom:none; border-radius:8px 8px 0 0; color:#9a9a9a; font-size:0.82rem; font-weight:600; padding:10px 22px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; white-space:nowrap; }
.admin-tab-btn:hover { color:#fff; background:rgba(255,255,255,0.04); }
.admin-tab-active { background:rgba(225,78,202,0.1) !important; border-color:rgba(255,255,255,0.1) !important; color:#e14eca !important; }

/* ══ Section Heading ══ */
.section-heading { font-size:0.8rem; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#9a9a9a; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:14px; }

/* ══ Sub filter card ══ */
.sub-filter-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:14px 18px; }
.filter-result-count { font-size:0.82rem; color:#9a9a9a; font-weight:600; }
.config-label { font-size:0.72rem; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:#9a9a9a; margin-bottom:5px; display:flex; align-items:center; gap:6px; }

/* ══ User Cell ══ */
.user-cell { display:flex; align-items:center; gap:10px; }
.user-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; color:#fff; flex-shrink:0; }
.sm-avatar   { width:26px; height:26px; font-size:0.62rem; }
.user-name   { font-weight:600; color:#fff; font-size:0.88rem; line-height:1.2; }
.user-email  { font-size:0.74rem; color:#9a9a9a; }

/* ══ Role Badges ══ */
.role-badge { padding:3px 10px; border-radius:8px; font-size:0.68rem; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; }
.role-admin    { background:rgba(225,78,202,0.15); color:#e14eca; border:1px solid rgba(225,78,202,0.3); }
.role-manager  { background:rgba(29,140,248,0.15);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.3); }
.role-operator { background:rgba(0,242,195,0.12);   color:#00f2c3; border:1px solid rgba(0,242,195,0.25); }
.role-analyst  { background:rgba(255,141,114,0.12); color:#ff8d72; border:1px solid rgba(255,141,114,0.25); }

/* ══ Status Badges ══ */
.status-badge  { padding:4px 10px; border-radius:10px; font-size:0.7rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.badge-success { background:rgba(24,206,15,0.12);   color:#18ce0f; border:1px solid rgba(24,206,15,0.25); }
.badge-danger  { background:rgba(253,93,147,0.12);  color:#fd5d93; border:1px solid rgba(253,93,147,0.25); }
.badge-default { background:rgba(255,255,255,0.07); color:#9a9a9a; border:1px solid rgba(255,255,255,0.12); }

/* ══ Permission Chips ══ */
.perm-chips    { display:flex; gap:5px; flex-wrap:wrap; }
.perm-chip     { display:inline-flex; align-items:center; padding:3px 8px; border-radius:8px; font-size:0.66rem; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; }
.perm-view     { background:rgba(29,140,248,0.12);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.2); }
.perm-create   { background:rgba(225,78,202,0.12);  color:#e14eca; border:1px solid rgba(225,78,202,0.2); }
.perm-delete   { background:rgba(253,93,147,0.12);  color:#fd5d93; border:1px solid rgba(253,93,147,0.2); }

/* ══ Action Buttons ══ */
.action-btns { display:flex; gap:5px; justify-content:center; }

/* ══ Role Cards ══ */
.role-card { border-radius:10px; }
.rc-purple { border-left:3px solid #e14eca; }
.rc-blue   { border-left:3px solid #1d8cf8; }
.rc-teal   { border-left:3px solid #00f2c3; }
.rc-orange { border-left:3px solid #ff8d72; }
.role-card-header { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; }
.role-name { font-size:1rem; font-weight:700; color:#fff; margin:0 0 3px; }
.role-users-count { font-size:0.75rem; color:#9a9a9a; }
.role-protected-note { font-size:0.72rem; color:#ff8d72; margin-top:10px; display:flex; align-items:center; }

/* ══ Permission Matrix ══ */
.perm-matrix { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:8px; overflow:hidden; }
.perm-matrix-header { display:flex; align-items:center; padding:7px 12px; background:rgba(255,255,255,0.04); font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#9a9a9a; }
.perm-matrix-row    { display:flex; align-items:center; padding:7px 12px; border-top:1px solid rgba(255,255,255,0.04); }
.pm-module       { flex:1.4; }
.pm-perm         { width:72px; text-align:center; flex-shrink:0; }
.pm-module-label { flex:1.4; font-size:0.78rem; color:#ccc; display:flex; align-items:center; }
.pm-perm-cell    { width:72px; display:flex; justify-content:center; flex-shrink:0; }

/* ══ Audit Severity Dot ══ */
.sev-dot      { width:8px; height:8px; border-radius:50%; margin:auto; }
.sev-info     { background:#1d8cf8; }
.sev-warning  { background:#ff8d72; box-shadow:0 0 6px rgba(255,141,114,0.5); }
.sev-critical { background:#fd5d93; box-shadow:0 0 8px rgba(253,93,147,0.6); animation:blink 1.2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ══ Audit user ══ */
.audit-user { display:flex; align-items:center; gap:8px; }

/* ══ Action Badge ══ */
.action-badge { padding:3px 9px; border-radius:8px; font-size:0.66rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.action-login      { background:rgba(24,206,15,0.1);   color:#18ce0f; border:1px solid rgba(24,206,15,0.2); }
.action-logout     { background:rgba(255,255,255,0.06); color:#9a9a9a; border:1px solid rgba(255,255,255,0.1); }
.action-create     { background:rgba(225,78,202,0.1);  color:#e14eca; border:1px solid rgba(225,78,202,0.2); }
.action-update     { background:rgba(29,140,248,0.1);  color:#1d8cf8; border:1px solid rgba(29,140,248,0.2); }
.action-delete     { background:rgba(253,93,147,0.1);  color:#fd5d93; border:1px solid rgba(253,93,147,0.2); }
.action-permission { background:rgba(255,141,114,0.1); color:#ff8d72; border:1px solid rgba(255,141,114,0.2); }
.action-password   { background:rgba(186,84,245,0.1);  color:#ba54f5; border:1px solid rgba(186,84,245,0.2); }

/* ══ SMTP ══ */
.accent-card   { border-radius:10px; }
.accent-blue   { border-left:3px solid #1d8cf8; }
.accent-purple { border-left:3px solid #e14eca; }
.config-card-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; }
.config-card-title  { font-size:1rem; font-weight:700; color:#fff; margin:0; }
.config-card-sub    { font-size:0.82rem; margin:0; }

.smtp-test-row { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.07); margin-top:8px; }
.smtp-status-indicator { display:flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; }
.smtp-status-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.smtp-idle    .smtp-status-dot { background:#555; }
.smtp-idle    .smtp-status-label { color:#9a9a9a; }
.smtp-success .smtp-status-dot { background:#18ce0f; box-shadow:0 0 6px rgba(24,206,15,0.5); }
.smtp-success .smtp-status-label { color:#18ce0f; }
.smtp-error   .smtp-status-dot { background:#fd5d93; }
.smtp-error   .smtp-status-label { color:#fd5d93; }
.smtp-testing .smtp-status-dot { background:#1d8cf8; animation:blink 0.8s infinite; }
.smtp-testing .smtp-status-label { color:#1d8cf8; }

/* ══ Email Triggers ══ */
.email-trigger-list { display:flex; flex-direction:column; gap:12px; }
.email-trigger-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
.email-trigger-item:last-child { border-bottom:none; }
.et-icon { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.et-icon i { font-size:0.9rem; color:#fff; }
.et-teal   { background:rgba(0,242,195,0.15); }
.et-orange { background:rgba(255,141,114,0.15); }
.et-red    { background:rgba(253,93,147,0.15); }
.et-blue   { background:rgba(29,140,248,0.15); }
.et-purple { background:rgba(225,78,202,0.15); }
.et-body   { flex:1; min-width:0; }
.et-label  { font-size:0.82rem; font-weight:600; color:#fff; }
.et-desc   { font-size:0.72rem; color:#9a9a9a; }

/* ══ Password modal ══ */
.pw-user-banner { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px 16px; }
.pw-strength-bar { height:5px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden; }
.pw-strength-fill { height:100%; border-radius:4px; transition:width 0.3s, background 0.3s; }

/* ══ Perm override grid ══ */
.perm-override-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:12px; }
.perm-override-item { display:flex; align-items:center; gap:8px; }
.perm-override-label { font-size:0.78rem; color:#ccc; }

/* ══ Password wrap ══ */
.password-wrap { position:relative; }
.eye-btn { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#9a9a9a; cursor:pointer; z-index:1; padding:0; }
.eye-btn:hover { color:#fff; }

/* ══ Mono ══ */
.mono-text { font-family:'Courier New',monospace; font-size:0.82rem; color:#ccc; }

/* ══ El-Select dark ══ */
.el-select .el-input__inner { background-color:#1e1e2f !important; border-color:rgba(255,255,255,0.12) !important; color:#fff !important; border-radius:6px; }
.el-select .el-input__inner::placeholder { color:#9a9a9a !important; }
.el-select .el-input .el-select__caret  { color:#9a9a9a !important; }
.el-table th > .cell { white-space:nowrap; }

/* Revert row */
.revert-row { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; background:rgba(255,141,114,0.06); border:1px solid rgba(255,141,114,0.15); border-radius:8px; padding:10px 14px; }
.revert-info { font-size:0.78rem; color:#9a9a9a; }
.revert-info strong { color:#fff; }

/* ══ Branding — Logo ══ */
.logo-preview-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.logo-current-wrap { flex:1; min-width:160px; }
.logo-current-label { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9a9a9a; margin-bottom:8px; }
.logo-arrow { color:#444; font-size:1.2rem; flex-shrink:0; }
.logo-display {
  height:80px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  border:2px dashed rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.03);
  overflow:hidden; transition:border-color 0.2s;
}
.logo-display-preview { border-color:rgba(225,78,202,0.25); }
.logo-has-pending { border-style:solid; border-color:rgba(225,78,202,0.5); background:rgba(225,78,202,0.04); }
.logo-img { max-height:60px; max-width:100%; object-fit:contain; padding:6px; }
.logo-placeholder { display:flex; flex-direction:column; align-items:center; gap:5px; color:#555; font-size:0.72rem; }
.logo-placeholder i { font-size:1.4rem; }
.logo-placeholder-dim { color:#333; }

/* Drop zone */
.logo-dropzone {
  border:2px dashed rgba(255,255,255,0.12);
  border-radius:12px;
  padding:32px 20px;
  text-align:center;
  cursor:pointer;
  transition:all 0.2s;
  background:rgba(255,255,255,0.02);
}
.logo-dropzone:hover, .dz-active { border-color:rgba(225,78,202,0.5); background:rgba(225,78,202,0.04); }
.dz-icon { font-size:2rem; color:#555; margin-bottom:10px; }
.dz-active .dz-icon { color:#e14eca; }
.dz-main { font-size:0.88rem; color:#ccc; font-weight:600; margin:0 0 4px; }
.dz-sub  { font-size:0.76rem; color:#666; margin:0; }
.dz-link { color:#e14eca; cursor:pointer; text-decoration:underline; }

/* File info strip */
.logo-file-info { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px 14px; }
.lfi-icon { color:#9a9a9a; font-size:1.1rem; }
.lfi-body { flex:1; min-width:0; }
.lfi-name { font-size:0.82rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lfi-size { font-size:0.7rem; color:#9a9a9a; }

/* Logo history */
.logo-history { border-top:1px solid rgba(255,255,255,0.07); padding-top:14px; }
.logo-history-title { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9a9a9a; margin-bottom:10px; }
.logo-history-item  { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.logo-history-item:last-child { border-bottom:none; }
.lhi-dot     { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.lhi-active  { background:#18ce0f; box-shadow:0 0 5px rgba(24,206,15,0.5); }
.lhi-old     { background:#444; }
.lhi-body    { flex:1; min-width:0; display:flex; flex-direction:column; }
.lhi-label   { font-size:0.8rem; font-weight:600; color:#fff; }
.lhi-date    { font-size:0.7rem; color:#9a9a9a; }
.lhi-badge   { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; background:rgba(24,206,15,0.12); color:#18ce0f; border:1px solid rgba(24,206,15,0.25); padding:2px 8px; border-radius:8px; }

/* ══ Branding — Settings ══ */
.brand-input-wrap {
  display:flex; align-items:center; gap:8px;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
  border-radius:6px; padding:8px 10px; transition:border-color 0.2s;
}
.brand-input-active { border-color:rgba(29,140,248,0.5) !important; background:rgba(29,140,248,0.05) !important; }
.brand-input-icon { font-size:0.82rem; color:#9a9a9a; flex-shrink:0; }
.brand-input { background:transparent; border:none; color:#fff; font-size:0.88rem; width:100%; outline:none; }
.brand-input:disabled { opacity:0.5; cursor:not-allowed; }
.flex-1 { flex:1; }

/* Color picker row */
.color-picker-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.color-swatch-wrap { position:relative; width:36px; height:36px; border-radius:8px; overflow:hidden; flex-shrink:0; border:2px solid rgba(255,255,255,0.1); }
.color-swatch-input { position:absolute; inset:0; width:100%; height:100%; border:none; cursor:pointer; padding:0; opacity:0; }
.color-swatch-preview { position:absolute; inset:0; border-radius:6px; pointer-events:none; }
.color-presets { display:flex; gap:5px; flex-wrap:wrap; }
.color-preset-dot { width:18px; height:18px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:transform 0.15s, border-color 0.15s; }
.color-preset-dot:hover { transform:scale(1.2); }
.cp-selected { border-color:#fff !important; transform:scale(1.15); }

/* Live preview */
.brand-live-preview { background:rgba(0,0,0,0.25); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); }
.blp-label   { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9a9a9a; padding:8px 12px 0; }
.blp-bar     { display:flex; align-items:center; justify-content:space-between; padding:8px 14px; }
.blp-site-name { font-size:0.85rem; font-weight:700; color:#fff; }
.blp-dot     { width:10px; height:10px; border-radius:50%; }
.blp-content { display:flex; align-items:center; gap:8px; padding:10px 14px; flex-wrap:wrap; }
.blp-tag     { font-size:0.65rem; font-weight:700; text-transform:uppercase; padding:3px 8px; border-radius:6px; border:1px solid; }
.blp-btn     { font-size:0.72rem; font-weight:700; color:#fff; padding:4px 14px; border-radius:6px; margin-left:auto; }
</style>
