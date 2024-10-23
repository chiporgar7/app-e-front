import { defineStore } from 'pinia';

export const useTarifasStore = defineStore('tarifas', {
  state: () => ({
    tarifas: [],
    tarifasLocales: JSON.parse(localStorage.getItem('tarifasLocales')) || [],
  }),

  actions: {
    async consultarTarifa(idTarifa) {
      try {
        const response = await fetch(
          'https://ebind-dev.egl-cloud.com/dgs-api-bridge/tarifas/consulta',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idTarifa: idTarifa.toString() }),
          }
        );

        const data = await response.json();

        if (data.response?.tarifas && data.response.tarifas.length > 0) {
          this.tarifas = data.response.tarifas;
          return true;
        }

        this.tarifas = [];
        return false;
      } catch (error) {
        console.error('Error al consultar tarifa:', error);
        throw error;
      }
    },

    agregarTarifaLocal(tarifa) {
      const tarifaToSave = {
        ...tarifa,
        idTarifa: Number(tarifa.idTarifa),
      };

      const index = this.tarifasLocales.findIndex(
        (t) => t.idTarifa === tarifaToSave.idTarifa
      );
      if (index !== -1) {
        this.tarifasLocales[index] = tarifaToSave;
      } else {
        this.tarifasLocales.push(tarifaToSave);
      }
      localStorage.setItem(
        'tarifasLocales',
        JSON.stringify(this.tarifasLocales)
      );
    },

    obtenerTodasLasTarifas() {
      // Combinar tarifas del API con las locales
      const todasLasTarifas = [...this.tarifas];

      // Agregar tarifas locales, reemplazando las del API si tienen el mismo ID
      this.tarifasLocales.forEach((tarifaLocal) => {
        const index = todasLasTarifas.findIndex(
          (t) => t.idTarifa === tarifaLocal.idTarifa
        );
        if (index !== -1) {
          todasLasTarifas[index] = tarifaLocal;
        } else {
          todasLasTarifas.push(tarifaLocal);
        }
      });

      return todasLasTarifas;
    },

    obtenerTarifaPorId(idTarifa) {
      const idNumerico = Number(idTarifa);
      const tarifaLocal = this.tarifasLocales.find(
        (t) => t.idTarifa === idNumerico
      );
      if (tarifaLocal) {
        return tarifaLocal;
      }
      return this.tarifas.find((t) => t.idTarifa === idNumerico);
    },

    cargarTarifasLocales() {
      const tarifasGuardadas = localStorage.getItem('tarifasLocales');
      if (tarifasGuardadas) {
        this.tarifasLocales = JSON.parse(tarifasGuardadas);
      }
    },
  },
});
