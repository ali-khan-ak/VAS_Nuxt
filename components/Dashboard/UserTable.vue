<template>
  <base-table :data="table" thead-classes="text-primary">
    <template slot="columns" slot-scope="{ columns }">
      <th>#</th>
      <th>Name</th>
      <th>Role</th>
      <th>Campaign Progress</th>
      <th class="text-right">Subscribers</th>
      <th class="text-right">Actions</th>
    </template>

    <template slot-scope="{ row, index }">
      <td class="text-center">
        <div class="photo"><img :src="row.img" alt="photo" /></div>
      </td>
      <td>{{ row.name }}</td>
      <td>{{ row.job }}</td>
      <td class="text-center"><base-progress :value="row.progress" /></td>
      <td class="text-right">{{ row.salary }}</td>
      <td class="text-right">
        <el-tooltip
          content="Refresh"
          effect="light"
          :open-delay="300"
          placement="top"
        >
          <base-button
            :type="index > 2 ? 'success' : 'neutral'"
            icon
            size="sm"
            class="btn-link"
          >
            <i class="tim-icons icon-refresh-01"></i>
          </base-button>
        </el-tooltip>
        <el-tooltip
          content="Delete"
          effect="light"
          :open-delay="300"
          placement="top"
        >
          <base-button
            :type="index > 2 ? 'danger' : 'neutral'"
            icon
            size="sm"
            class="btn-link"
          >
            <i class="tim-icons icon-simple-remove"></i>
          </base-button>
        </el-tooltip>
      </td>
    </template>
  </base-table>
</template>

<script>
import { BaseTable, BaseProgress } from '@/components';

export default {
  components: {
    BaseTable,
    BaseProgress
  },
  data() {
    return {
      table: [
        {
          id: 1,
          img: 'img/tania.jpg',
          name: 'Tania Mike',
          job: 'SMS Campaign Manager',
          progress: 72,
          salary: '84,320'
        },
        {
          id: 2,
          img: 'img/robi.jpg',
          name: 'John Doe',
          job: 'Platform Admin',
          progress: 95,
          salary: '210,540'
        },
        {
          id: 3,
          img: 'img/lora.jpg',
          name: 'Alexa Mike',
          job: 'OBD Campaign Manager',
          progress: 48,
          salary: '63,780'
        },
        {
          id: 4,
          img: 'img/jana.jpg',
          name: 'Jana Monday',
          job: 'USSD & IVR Specialist',
          progress: 61,
          salary: '97,450'
        },
        {
          id: 5,
          img: 'img/mike.jpg',
          name: 'Paul Dickens',
          job: 'Subscriber Analyst',
          progress: 100,
          salary: '150,900'
        },
        {
          id: 6,
          img: 'img/emilyz.jpg',
          name: 'Manuela Rico',
          job: 'Reporting & Analytics',
          progress: 33,
          salary: '42,670'
        }
      ]
    };
  }
};
</script>

<style></style>