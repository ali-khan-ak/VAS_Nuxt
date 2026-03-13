<template>
  <div class="sidebar" :data="backgroundColor">
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <div class="logo">
        <a href="" class="simple-text logo-mini">
          <img :src="logo" alt="app-logo" class="sidebar-logo-img" />
        </a>
        <a href="" class="simple-text logo-normal">
          {{ title }}
        </a>
      </div>
      <slot></slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :link="link"
          >
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  props: {
    title: {
      type: String,
      default: 'VAS',
      description: 'Sidebar title'
    },
    shortTitle: {
      type: String,
      default: 'CT',
      description: 'Sidebar short title'
    },
    logo: {
      type: String,
      default: '/img/brand_logo.svg',
      description: 'Sidebar app logo'
    },
    backgroundColor: {
      type: String,
      default: 'vue',
      validator: value => {
        let acceptedValues = ['', 'vue', 'blue', 'green', 'primary'];
        return acceptedValues.indexOf(value) !== -1;
      },
      description: 'Sidebar background color (vue|blue|green|orange|red|primary)'
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description: "List of sidebar links as an array if you don't want to use components for these."
    },
    autoClose: {
      type: Boolean,
      default: true,
      description: 'Whether sidebar should autoclose on mobile when clicking an item'
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  }
};
</script>

<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}

/* ── Remove white circle background from logo container ── */
.sidebar .logo a.logo-mini {
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ── Logo image: larger and transparent ── */
.sidebar-logo-img {
  width: 44px !important;
  height: 44px !important;
  max-width: 44px !important;
  object-fit: contain !important;
  background: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}
</style>