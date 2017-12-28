<template>
  <div>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Host</th>
          <th>Problemo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in alerts">
          <td>{{ a.hosts.map(x => x.host).join(', ') }}</td>
          <td>{{ a.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Zabbix from '@/zabbix';

const apiSuffix = 'api_jsonrpc.php';

let zabbix = null;

export default {
  data: () => ({
    alerts: [],

  }),
  mounted() {
    zabbix = new Zabbix(localStorage.getItem('zabbix-url'));
    zabbix.auth = localStorage.getItem('token');

    this.getAlerts();
  },
  methods: {
    getAlerts() {
      // Last 12 hours
      const from = Math.floor((new Date()) / 1000 - 3600 * 12);

      zabbix.call('trigger.get', {
        only_true: 1,
        skipDependent: 1,
        monitored: 1,
        active: 1,
        output: 'extend',
        expandDescription: 1,
        selectHosts: ['host'],
      })
      .then(res => {
        const problems = res.data.result;
        console.table(problems);
        this.alerts = problems;
      })
      // .then(triggerIDs => zabbix.call('trigger.get', { triggerids: triggerIDs }))
      // .then(res => {
      //   this.alerts = res.data.result;
      //   console.table(this.alerts);
      // })
      .catch(err => console.error(err));
    },
  },
};
</script>

<style>
  table {
    font-size: 0.75em;
  }
</style>
