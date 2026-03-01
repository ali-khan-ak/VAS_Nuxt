<template>
  <base-table :data="tableData" thead-classes="text-primary">
    <template slot-scope="{ row }">
      <td><base-checkbox v-model="row.done"></base-checkbox></td>
      <td>
        <p class="title">{{ row.title }}</p>
        <p class="text-muted">{{ row.description }}</p>
      </td>
      <td class="td-actions text-right">
        <el-tooltip
          content="Edit task"
          effect="light"
          :open-delay="300"
          placement="top"
        >
          <base-button type="link">
            <i class="tim-icons icon-pencil"></i>
          </base-button>
        </el-tooltip>
      </td>
    </template>
  </base-table>
</template>

<script>
import { BaseTable } from '@/components';

export default {
  components: {
    BaseTable
  },
  data() {
    return {
      tableData: [
        {
          title: 'Upload Match Highlights – Man City vs Arsenal',
          description: 'Premier League matchday 28 highlights ready for processing. Upload to CDN by 11:00 PM.',
          done: true
        },
        {
          title: 'Send Goal Alert SMS Campaign',
          description:
            'Trigger bulk SMS to subscribers after full-time whistle. Template: "FT: {home} {score} {away} – Get highlights now!"',
          done: false
        },
        {
          title: 'Update Live Score USSD Menu',
          description:
            'Add Champions League fixtures to *444# menu. Update SUB/UNSUB flow for UCL score alerts service.',
          done: false
        },
        {
          title: 'Review OBD Voice Alert Campaign',
          description: 'Voice blast for El Clásico preview failed for 3,200 subscribers. Check audio file format and retry.',
          done: false
        },
        {
          title: 'Export Weekly Fantasy Football Report',
          description:
            'Pull GW28 subscriber activity — top scorers, most transferred players, and chip usage stats.',
          done: false
        },
        {
          title: 'Configure IVR for Match Prediction Line',
          description: 'Set up SIP account for the 1-900 match prediction IVR line ahead of the FA Cup quarter-finals.',
          done: false
        }
      ]
    };
  }
};
</script>

<style></style>