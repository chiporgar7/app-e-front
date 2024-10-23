<template>
  <div class="q-pa-md">
    <q-form
      ref="formRef"
      @submit="onSubmit"
      class="row q-col-gutter-md"
      @keydown.enter.prevent="handleEnter"
    >
      <div class="col-12">
        <div class="text-h6">Nueva Tarifa</div>
      </div>

      <div class="col-12 col-md-6">
        <q-input
          ref="idTarifaRef"
          v-model="formData.idTarifa"
          type="number"
          label="ID Tarifa *"
          :rules="[
            (val) => (val !== null && val !== '') || 'ID Tarifa es requerido',
            (val) => val > 0 || 'ID Tarifa debe ser mayor a 0',
          ]"
          lazy-rules
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.tarifa"
          label="Tarifa *"
          :rules="[
            (val) => (val && val.length > 0) || 'Tarifa es requerida',
            (val) =>
              val.length <= 100 || 'Tarifa debe tener máximo 100 caracteres',
          ]"
          lazy-rules
        />
      </div>

      <div class="col-12">
        <q-input
          v-model="formData.concepto"
          type="textarea"
          label="Concepto *"
          :rules="[
            (val) => (val && val.length > 0) || 'Concepto es requerido',
            (val) =>
              val.length <= 500 || 'Concepto debe tener máximo 500 caracteres',
          ]"
          lazy-rules
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.estatus"
          :options="estatusOptions"
          label="Estatus *"
          option-label="descripcion"
          :rules="[(val) => val !== null || 'Estatus es requerido']"
          emit-value
          map-options
          lazy-rules
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.tipoDocumento"
          :options="tipoDocumentoOptions"
          label="Tipo Documento *"
          option-label="descripcion"
          :rules="[(val) => val !== null || 'Tipo Documento es requerido']"
          emit-value
          map-options
          lazy-rules
        />
      </div>

      <div class="col-6 col-md-3">
        <q-input
          v-model="formData.diaInicio"
          type="date"
          label="Día Inicio *"
          :rules="[
            (val) => (val !== null && val !== '') || 'Día Inicio es requerido',
            validateFechaInicio,
          ]"
          lazy-rules
        />
      </div>

      <div class="col-6 col-md-3">
        <q-input
          v-model="formData.diaFin"
          type="date"
          label="Día Fin *"
          :rules="[
            (val) => (val !== null && val !== '') || 'Día Fin es requerido',
            validateFechaFin,
          ]"
          lazy-rules
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.importe"
          type="number"
          label="Importe *"
          prefix="$"
          :rules="[
            (val) => (val !== null && val !== '') || 'Importe es requerido',
            (val) => val >= 0 || 'El importe debe ser mayor o igual a 0',
            (val) =>
              !isNaN(parseFloat(val)) || 'El importe debe ser un número válido',
          ]"
          step="0.01"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon name="attach_money" />
          </template>
        </q-input>
      </div>

      <div class="col-12">
        <q-btn
          label="Guardar"
          type="submit"
          color="primary"
          :loading="loading"
        />
        <q-btn
          label="Limpiar"
          type="reset"
          flat
          class="q-ml-sm"
          @click="resetForm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useTarifasStore } from '../stores/tarifas';

const $q = useQuasar();
const store = useTarifasStore();
const loading = ref(false);
const formRef = ref(null);
const idTarifaRef = ref(null);

const estatusOptions = [
  { id: 1, descripcion: 'Activa', value: { id: 1, descripcion: 'Activa' } },
  { id: 2, descripcion: 'Inactiva', value: { id: 2, descripcion: 'Inactiva' } },
];

const tipoDocumentoOptions = [
  { id: 1, descripcion: 'Original', value: { id: 1, descripcion: 'Original' } },
  { id: 2, descripcion: 'Copia', value: { id: 2, descripcion: 'Copia' } },
];

const formData = ref({
  idTarifa: null,
  tarifa: '',
  concepto: '',
  estatus: null,
  tipoProducto: null,
  tipoDocumento: null,
  diaInicio: null,
  diaFin: null,
  importe: null,
  fh_ultima_modificacion: new Date().toISOString(),
  aplicativos: [],
});

function validateFechaInicio(date) {
  if (!formData.value.diaFin) return true;
  return (
    date <= formData.value.diaFin ||
    'La fecha de inicio debe ser menor o igual a la fecha fin'
  );
}

function validateFechaFin(date) {
  if (!formData.value.diaInicio) return true;
  return (
    date >= formData.value.diaInicio ||
    'La fecha fin debe ser mayor o igual a la fecha inicio'
  );
}

function resetForm() {
  if (formRef.value) {
    formRef.value.reset();
  }
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] =
      key === 'fh_ultima_modificacion' ? new Date().toISOString() : null;
  });
  formData.value.aplicativos = [];
}

async function handleEnter(e) {
  if (e.target.type === 'textarea') return;
  e.preventDefault();
  await onSubmit();
}

async function onSubmit() {
  if (formRef.value) {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      $q.notify({
        type: 'warning',
        message:
          'Por favor, complete todos los campos requeridos correctamente',
      });
      return;
    }
  }

  loading.value = true;
  try {
    // Formatear los datos antes de guardar
    const tarifaToSave = {
      ...formData.value,
      importe: parseFloat(formData.value.importe).toFixed(2),
      diaInicio: formData.value.diaInicio,
      diaFin: formData.value.diaFin,
      fh_ultima_modificacion: new Date().toISOString(),
      aplicativos: [],
    };

    store.agregarTarifaLocal(tarifaToSave);

    $q.notify({
      type: 'positive',
      message: 'Tarifa guardada exitosamente',
    });

    resetForm();
    // Enfocar el primer campo después de limpiar
    if (idTarifaRef.value) {
      idTarifaRef.value.focus();
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la tarifa',
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.q-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
