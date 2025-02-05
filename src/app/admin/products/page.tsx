//snipet prc
import { getCategories } from "@/modules/admin/categories";
import { getHandlingUnits } from "@/modules/admin/handling-units";
import { getProducts, ProductTable } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";

export default async function ProductsPage() {

  // OBTERNER PRODUCTOS
  const productsResponse = await getProducts({ limit: 5 }); // Limite de 10 items por pagina
  const allProductsResponse = await getProducts();
  const categories = await getCategories();
  const handlingUnits = await getHandlingUnits();


  return (
    <>
      {/*HEADER  */}
      <HeaderPage
        title="Productos"
        description="Listado de tus productos en el restaurante"
        linkProps={{
          linkText: "Nuevo Producto",
          url: "/admin/products/new"
        }}
      />

      {/* TABLA DE PRODUCTOS */}
      <ProductTable
        productsResponse={productsResponse}
        allProducts={allProductsResponse.products}
        categories={categories}
        handlingUnits={handlingUnits}
      />
    </>
  );
}