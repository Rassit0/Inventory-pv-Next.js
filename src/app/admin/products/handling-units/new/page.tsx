import { CreateHanldinfUnitForm } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";

export default function NewHandlingUnitsPage() {
  return (
    <>
      <HeaderPage
        title="Agregar Unidad de Manejo"
        description="Agrega una nueva unidad de manejo"
        linkProps={{
          linkText: "Volver",
          url: "/admin/handling-units"
        }}
      />
      <section className="container pt-8">
        <CreateHanldinfUnitForm />
      </section>
    </>
  );
}