<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card class="search-card">
          <q-card-section>
            <div class="text-h6">Buscar Tarifa</div>
            <q-input
              v-model.number="idTarifaBusqueda"
              type="number"
              label="ID Tarifa"
              :rules="[(val) => !!val || 'El ID es requerido']"
              class="q-mt-md"
            />
            <q-btn
              color="primary"
              label="Buscar"
              class="q-mt-sm full-width"
              @click="buscarTarifa"
              :loading="loading"
            />
            <q-btn
              color="secondary"
              label="Mostrar Todas"
              class="q-mt-sm full-width"
              @click="mostrarTodasTarifas"
              flat
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <TarifasList :tarifas="tarifasFiltradas" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useTarifasStore } from '../stores/tarifas';
import TarifasList from './TarifasList.vue';

const $q = useQuasar();
const store = useTarifasStore();
const idTarifaBusqueda = ref(null);
const loading = ref(false);
const mostrarTodas = ref(true);

const tarifasFiltradas = computed(() => {
  if (mostrarTodas.value) {
    return store.obtenerTodasLasTarifas();
  }

  const todasLasTarifas = store.obtenerTodasLasTarifas();
  return todasLasTarifas.filter((t) => t.idTarifa === idTarifaBusqueda.value);
});

async function buscarTarifa() {
  if (!idTarifaBusqueda.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, ingrese un ID de tarifa',
    });
    return;
  }

  loading.value = true;
  mostrarTodas.value = false;

  try {
    const encontrado = await store.consultarTarifa(idTarifaBusqueda.value);
    const tarifaLocal = store.tarifasLocales.find(
      (t) => t.idTarifa === idTarifaBusqueda.value
    );

    if (!encontrado && !tarifaLocal) {
      $q.notify({
        type: 'warning',
        message: 'No se encontró la tarifa especificada',
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al buscar la tarifa',
    });
  } finally {
    loading.value = false;
  }
}

function mostrarTodasTarifas() {
  mostrarTodas.value = true;
  idTarifaBusqueda.value = null;
}
</script>

<style scoped>
.search-card {
  position: sticky;
  top: 20px;
}
</style>
