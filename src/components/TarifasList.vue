<template>
  <div>
    <template v-if="tarifas.length">
      <q-list bordered separator>
        <q-item v-for="tarifa in tarifas" :key="tarifa.idTarifa">
          <q-item-section>
            <q-item-label header>
              {{ tarifa.tarifa }}
              <q-badge
                :color="tarifa.estatus.id === 1 ? 'positive' : 'negative'"
                class="q-ml-sm"
              >
                {{ tarifa.estatus.descripcion }}
              </q-badge>
            </q-item-label>
            <q-item-label caption>ID: {{ tarifa.idTarifa }}</q-item-label>
            <q-item-label>{{ tarifa.concepto }}</q-item-label>
            <q-item-label caption>
              Período: {{ tarifa.diaInicio }} - {{ tarifa.diaFin }} | Importe:
              ${{ tarifa.importe }}
            </q-item-label>

            <q-expansion-item
              v-if="tarifa.aplicativos.length"
              label="Aplicativos"
              dense
              dense-toggle
            >
              <q-list dense>
                <q-item
                  v-for="app in tarifa.aplicativos"
                  :key="app.idAplicativo"
                >
                  <q-item-section>
                    <q-item-label>{{ app.aplicativo }}</q-item-label>
                    <q-item-label caption
                      >Cuota: {{ app.cuotaAplicativo }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
    <template v-else>
      <q-banner class="bg-grey-3"> No hay tarifas para mostrar </q-banner>
    </template>
  </div>
</template>

<script setup>
defineProps({
  tarifas: {
    type: Array,
    required: true,
  },
});
</script>
