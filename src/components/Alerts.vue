<template>
  <div>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Host</th>
          <th>Problem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in alerts">
          <td>{{ a.hosts.map(x => x.host).join(', ') }}</td>
          <td>{{ a.description }}</td>
          <td><button class="btn btn-sm btn-primary" v-if="a.unack" @click="ack(a)">Ack</button></td>
        </tr>
      </tbody>
    </table>
    <div class="alert alert-danger zabbix-error mx-0 mb-0 rounded-0" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import find from 'lodash';
import Zabbix from '@/zabbix';

const apiSuffix = 'api_jsonrpc.php';

let zabbix = null;

export default {
  data: () => ({
    alerts: [],
    error: null,
  }),
  mounted() {
    zabbix = new Zabbix(localStorage.getItem('zabbix-url'));
    zabbix.auth = localStorage.getItem('token');

    this.getAlerts();
  },
  methods: {
    getAlerts() {
      Promise.all([
        this.getAll(),
        this.getUnacked(),
      ])
      .then(([all, unacked]) => {
        all.forEach(a => {
          const unack = _.find(unacked, { triggerid: a.triggerid });
          if (unack) a.unack = true;
        });

        this.alerts = all;
      })
      .catch(err => console.error(err));
    },
    getAll() {
      // Last 12 hours
      const from = Math.floor((new Date()) / 1000 - 3600 * 12);

      return zabbix.call('trigger.get', {
        only_true: 1,
        skipDependent: 1,
        monitored: 1,
        active: 1,
        output: 'extend',
        expandDescription: 1,
        selectHosts: ['host'],
        selectLastEvent: ['lastEvent'],
      })
      .then(res => res.data.result);
    },
    getUnacked() {
      // Last 12 hours
      const from = Math.floor((new Date()) / 1000 - 3600 * 12);

      return zabbix.call('trigger.get', {
        only_true: 1,
        skipDependent: 1,
        monitored: 1,
        active: 1,
        output: 'extend',
        expandDescription: 1,
        selectHosts: ['host'],
        withLastEventUnacknowledged: 1,
        selectLastEvent: ['lastEvent'],
      })
      .then(res => res.data.result);
    },
    ack(alert) {
      return zabbix.call('event.acknowledge', {
        eventids: [alert.lastEvent.eventid],
        message: 'Event acknowledged from PWA app',
        action: 0,
      })
      .then((res) => {
        if (res.data.error) this.error = res.data.error.data;
        else this.error = null;

        this.getAlerts()
      });
    },
  },
};
</script>

<style>
  table {
    font-size: 0.75em;
  }

  .zabbix-error {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
