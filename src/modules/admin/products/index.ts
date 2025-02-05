
// COMPONENTS
export { ProductTable } from './components/product-table/ProductTable';
export { CreateProductForm } from './components/CreateProductForm';
export { UpdateProductFormModal } from './components/UpdateProductFormModal';
export { DeleteProductModal } from './components/DeleteProductModal';

// COMPONENTS REPORTS
export { OutOfStockTable } from './components/reports/OutOfStockTable';
export { HighDemandTable } from './components/reports/HighDemandTable';
export { InventoryByCategoryTable } from './components/reports/InventoryByCategoryTable';
export { ProductModalTable } from './components/reports/ProductModalTable';
export { ReportProductTable } from './components/reports/ReportProductTable';
export { ReportSelectorTabs } from './components/reports/ReportSelectorTabs';
export { CategoryStatsticsTable } from './components/reports/CategoryStatisticsTable';

// ACTIONS
export { createProduct } from './actions/create-product';
export { getProducts } from './actions/get-products';
export { getHighDemand } from './actions/reports/get-high-demand';
export { updateProduct } from './actions/update-product';
export { deleteProduct } from './actions/delete-product';
export { getInventoryByCategory } from './actions/reports/get-inventory-by-catregory';
export { getCategoryStatistics } from './actions/reports/get-category-statistics';

// INTERFACES
export type { IProductResponse, IProduct, IBranchProductInventory } from './interfaces/products-response';
// export type { ISimpleProduct } from './interfaces/simple-product';
export type { IOutOfStock } from './interfaces/reports/out-of-stock-response';
export type { IHighDemand } from './interfaces/reports/high-demand-reesponse';
export type { IHighDemandProduct } from './interfaces/reports/high-demand-reesponse';
export type { IInventoryByCategory, IInventoryByCategoryProduct, InventoryByCategory } from './interfaces/reports/inventory-by-category-response';
export type { ICategoryStatisticsResponse, ICategoryStatistics } from './interfaces/reports/category-statistics-response';