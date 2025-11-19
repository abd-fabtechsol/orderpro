import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [],
  selectedSupplier: null,
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSuppliers: (state, { payload }) => {
      state.suppliers = payload;
    },
    setSelectedSupplier: (state, { payload }) => {
      state.selectedSupplier = payload;
    },
    clearSelectedSupplier: (state) => {
      state.selectedSupplier = null;
    },
    addSupplier: (state, { payload }) => {
      state.suppliers.push(payload);
    },
  },
});

export const { setSuppliers, setSelectedSupplier, clearSelectedSupplier, addSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
