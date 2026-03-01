<template>
  <div class="maintenance-wrapper">
    <div class="maintenance-container">
      <div class="gear-icons">
        <i class="tim-icons icon-settings-gear-63 gear gear-large"></i>
        <i class="tim-icons icon-settings-gear-63 gear gear-small"></i>
      </div>

      <h1 class="maintenance-title">Under Maintenance</h1>
      <p class="maintenance-subtitle">
        We're working hard to improve your experience. This page will be available soon.
      </p>

      <div class="maintenance-divider"></div>

      <p class="maintenance-note">
        Please check back later or navigate to another section using the sidebar.
      </p>

      <button class="btn btn-primary btn-round mt-4" @click="goBack">
        <i class="tim-icons icon-minimal-left mr-2"></i> Go Back
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnderMaintenance',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.maintenance-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
}

.maintenance-container {
  text-align: center;
  max-width: 520px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.gear-icons {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
  height: 80px;
  width: 120px;
}

.gear {
  position: absolute;
  color: #e14eca;
  animation: spin 4s linear infinite;
}

.gear-large {
  font-size: 64px;
  top: 0;
  left: 0;
}

.gear-small {
  font-size: 38px;
  bottom: 0;
  right: 0;
  animation-direction: reverse;
  animation-duration: 3s;
  color: #1d8cf8;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.maintenance-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.maintenance-subtitle {
  font-size: 1rem;
  color: #9a9a9a;
  line-height: 1.7;
  margin-bottom: 24px;
}

.maintenance-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #e14eca, #1d8cf8);
  border-radius: 2px;
  margin: 0 auto 24px;
}

.maintenance-note {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>