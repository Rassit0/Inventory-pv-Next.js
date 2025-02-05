import { getCategories } from "@/modules/admin/categories";
import { getHandlingUnits } from "@/modules/admin/handling-units";
import { CategoryStatsticsTable, getHighDemand, getInventoryByCategory, getProducts, HighDemandTable, InventoryByCategoryTable, OutOfStockTable, ReportProductTable, ReportSelectorTabs } from "@/modules/admin/products";
import { getCategoryStatistics } from "@/modules/admin/products";
import { getOutOfStock } from "@/modules/admin/products/actions/reports/get-out-of-stock";
import { HeaderPage } from "@/modules/admin/shared";
import { ReactNode } from "react";


interface Iitem {
  id: string;
  label: string;
  content: string | ReactNode
  selected?: Boolean
}

export default async function ProductsReportsPage() {
  const outOfStockResponse = await getOutOfStock();
  const highDemandResponse = await getHighDemand();
  const inventoryByCategoryResponse = await getInventoryByCategory();

  const productsResponse = await getProducts({ limit: 5 }); // Limite de 10 items por pagina

  const categoryStatisticsResponse = await getCategoryStatistics();

  const tabs: Iitem[] = [
    {
      id: "out-of-stock",
      label: "Fuera de Stock",
      content: <OutOfStockTable response={outOfStockResponse} />,
      selected: true,
    },
    {
      id: "high-demand",
      label: "Con más Demanda",
      content: <HighDemandTable response={highDemandResponse} />,
      selected: false,
    },
    {
      id: "inventory-by-category",
      label: "Inventario por Categoría",
      content: <InventoryByCategoryTable response={inventoryByCategoryResponse} />,
      selected: false,
    },
    {
      id: "inventory-by-product",
      label: "Inventario por Producto",
      content: <ReportProductTable
        productsResponse={productsResponse}
      />,
      selected: false,
    },
    {
      id: "category-statistics",
      label: "Estadísticas por Categoría",
      content: <CategoryStatsticsTable response={categoryStatisticsResponse} />,
      selected: false,
    },
    {
      id: "products-in-transit",
      label: "Productos en Transito",
      content: "Products en transito",
      selected: false,
    }
  ]

  return (
    <>
      <HeaderPage
        title="Reportes del Modulo de Productos"
      // description="Verifica y descarga reportes del modulo productos"
      // linkProps={{
      //   linkText: "Productos",
      //   url: "/admin/products"
      // }}
      />
      <ReportSelectorTabs
        tabs={tabs}
      />
    </>
  );
}