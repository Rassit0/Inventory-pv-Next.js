
// COMPONENTS
export { CreateProductForm } from './components/CreateProductForm';
export { DetailsStockModal } from './components/DetailsStockModal';
export { DeleteProductModal } from './components/DeleteProductModal';
export { InventoryByBranchForm } from './components/InventoryByBranchForm';
export { ProductTable } from './components/product-table/ProductTable';
export { SelectProductTable } from './components/table-inventory/SelectProductTable';
export { UpdateProductFormModal } from './components/UpdateProductFormModal';
export { ViewProduct } from './components/ViewProduct';

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
export { findProduct } from './actions/find-product';
export { updateProduct } from './actions/update-product';
export { deleteProduct } from './actions/delete-product';
export { getInventoryByCategory } from './actions/reports/get-inventory-by-catregory';
export { getCategoryStatistics } from './actions/reports/get-category-statistics';
// INTERFACES
export type { IProductsResponse, IProduct, IProductCategory, IBranchProductStock, IProductTypes, IWarehouseProductStock, Meta, Unit } from './interfaces/products-response';
// export type { ISimpleProduct } from './interfaces/simple-product';
export type { IOutOfStock } from './interfaces/reports/out-of-stock-response';
export type { IHighDemand } from './interfaces/reports/high-demand-reesponse';
export type { IHighDemandProduct } from './interfaces/reports/high-demand-reesponse';
export type { IInventoryByCategory, IInventoryByCategoryProduct, InventoryByCategory } from './interfaces/reports/inventory-by-category-response';
export type { ICategoryStatisticsResponse, ICategoryStatistics } from './interfaces/reports/category-statistics-response';