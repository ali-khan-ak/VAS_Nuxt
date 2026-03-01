<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <side-bar
      :background-color="sidebarBackground"
      :short-title="$t('sidebar.shortTitle')"
      :title="$t('sidebar.title')"
    >
      <template slot-scope="props" slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/dashboard'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{ name: 'Campaign Management', icon: 'tim-icons icon-send' }"
        >
          <sidebar-item
            :link="{ name: 'SMS Campaigns', path: '/campaigns/sms' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'OBD Campaigns', path: '/campaigns/obd' }"
          ></sidebar-item>
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Notification Management',
            icon: 'tim-icons icon-bell-55',
            path: '/notifications'
          }"
        ></sidebar-item>

        <sidebar-item
          :link="{ name: 'Service Management', icon: 'tim-icons icon-settings-gear-63' }"
        >
          <sidebar-item
            :link="{ name: 'SMS Management', path: '/management/sms' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'USSD Management', path: '/management/ussd' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'IVR Management', path: '/management/ivr' }"
          ></sidebar-item>
        </sidebar-item>

        <sidebar-item
          :link="{ name: 'Reporting', icon: 'tim-icons icon-chart-bar-32' }"
        >
          <sidebar-item
            :link="{ name: 'SMS & USSD Reporting', path: '/reporting/sms-ussd' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'IVR Reporting', path: '/reporting/ivr' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'Subscribers Reporting', path: '/reporting/subscribers' }"
          ></sidebar-item>
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Short Code Management',
            icon: 'tim-icons icon-mobile',
            path: '/shortcode'
          }"
        ></sidebar-item>

        <sidebar-item
          :link="{
            name: 'User Management',
            icon: 'tim-icons icon-single-02',
            path: '/users'
          }"
        ></sidebar-item>
      </template>
    </side-bar>

    <sidebar-share :background-color.sync="sidebarBackground"></sidebar-share>

    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import SidebarShare from './SidebarSharePlugin';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from './DashboardNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import DashboardContent from './Content.vue';
import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition,
    SidebarShare
  },
  data() {
    return {
      sidebarBackground: 'vue'
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        initScrollbar('sidebar');
        initScrollbar('main-panel');
        initScrollbar('sidebar-wrapper');
        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    }
  },
  mounted() {
    this.initScrollbar();
  }
};
</script>

<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}
.main-panel .zoomIn {
  animation-name: zoomIn95;
}
@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}
.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>