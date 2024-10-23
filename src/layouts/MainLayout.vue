<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> Sistema de Tarifas </q-toolbar-title>
        <q-tabs v-model="tab">
          <q-route-tab name="consulta" to="/consulta" label="Consulta" />
          <q-route-tab name="alta" to="/alta" label="Alta" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tab = ref('consulta');
</script>
