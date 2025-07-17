import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { ListDashboardCards } from "@/modules/admin/home";
import { InventoryMovementsChart } from "@/modules/admin/inventory";
import { getSummaryMonthlyCounts, ProductionChart } from "@/modules/admin/production";
import { getSummaryMonthlyCounts as getSummaryMonthlyCountsInventory } from "@/modules/admin/inventory"
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";
import { getCountRecipes } from "@/modules/admin/production-recipes";
import { getCookieBranchId } from "@/modules/admin/branches";

export default async function HomePage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();

  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "HOME", permissions: [RoleModulePermission.Read] })) redirect("/403");
  if (!hasModuleAccess({ user, moduleName: "BRANCHES", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const selectedBranchid = await getCookieBranchId();

  const accessToInventory = hasPermission(user, "INVENTORY", RoleModulePermission.Read)

  const monthlyCounts = await getSummaryMonthlyCounts({ token: authToken, year: new Date().getFullYear(), originBranchId: selectedBranchid });
  let monthlyCountsInventoryIncome = null;
  let monthlyCountsInventoryOutcome = null;
  let monthlyCountsInventoryTransfer = null;
  let monthlyCountsInventoryAdjustmentIncome = null;
  let monthlyCountsInventoryAdjustmentOutcome = null;
  if (accessToInventory) {
    monthlyCountsInventoryIncome = await getSummaryMonthlyCountsInventory({ token: authToken, year: new Date().getFullYear(), movementType: "INCOME", destinationBranchId: selectedBranchid });
    // monthlyCountsInventoryOutcome = await getSummaryMonthlyCountsInventory({ token: authToken, year: new Date().getFullYear(), movementType: "OUTCOME", originBranchId: selectedBranchid });
    monthlyCountsInventoryTransfer = await getSummaryMonthlyCountsInventory({ token: authToken, year: new Date().getFullYear(), movementType: "TRANSFER", originBranchId: selectedBranchid });
    monthlyCountsInventoryAdjustmentIncome = await getSummaryMonthlyCountsInventory({ token: authToken, year: new Date().getFullYear(), movementType: "ADJUSTMENT", destinationBranchId: selectedBranchid });
    monthlyCountsInventoryAdjustmentOutcome = await getSummaryMonthlyCountsInventory({ token: authToken, year: new Date().getFullYear(), movementType: "ADJUSTMENT", originBranchId: selectedBranchid });
  }
  const countRecipes = await getCountRecipes({ token: authToken, status: 'active' });


  return (
    <div className="flex flex-col gap-4 m-4">

      <ListDashboardCards
        token={authToken}
        monthlyOrdersCounts={monthlyCounts}
        branchesCount={{ totalItems: 0 }}
        recipesCount={countRecipes || { totalItems: 0 }}
        wasteReportsCount={{ totalItems: 0 }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 w-full">
        <div className="sm:col-span-2">
          <ProductionChart
            token={authToken}
            monthlyCounts={monthlyCounts}
            createdByUserId={user.id} // Pasar el ID del usuario autenticado
          />
        </div>
        {accessToInventory && (
          <>
            <InventoryMovementsChart
              token={authToken}
              title="Inventario - Ingresos"
              monthlyCounts={monthlyCountsInventoryIncome}
              // createdByUserId={user.id} // Pasar el ID del usuario autenticado
              movementType="INCOME"
            />
            {/* <InventoryMovementsChart
              token={authToken}
              title="Inventario - Egresos"
              monthlyCounts={monthlyCountsInventoryOutcome}
              // createdByUserId={user.id} // Pasar el ID del usuario autenticado
              movementType="OUTCOME"
            /> */}
            <InventoryMovementsChart
              token={authToken}
              title="Inventario - Transferencias"
              monthlyCounts={monthlyCountsInventoryTransfer}
              // createdByUserId={user.id} // Pasar el ID del usuario autenticado
              movementType="TRANSFER"
            />
            <InventoryMovementsChart
              token={authToken}
              title="Inventario - Ajustes - Ingresos"
              monthlyCounts={monthlyCountsInventoryAdjustmentIncome}
              // createdByUserId={user.id} // Pasar el ID del usuario autenticado
              movementType="ADJUSTMENT"
              adjustmentType="INCOME"
            />
            <InventoryMovementsChart
              token={authToken}
              title="Inventario - Ajustes - Egresos"
              monthlyCounts={monthlyCountsInventoryAdjustmentOutcome}
              // createdByUserId={user.id} // Pasar el ID del usuario autenticado
              movementType="ADJUSTMENT"
              adjustmentType="OUTCOME"
            />
          </>
        )}

      </div>
    </div>
  );
}