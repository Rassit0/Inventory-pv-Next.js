import { getAuthUser, hasModuleAccess } from "@/lib";
import { getProductions, getSummaryMonthlyCounts, ProductionChart } from "@/modules/admin/production";
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ branchId: string }>
}) {
  const { branchId } = await params
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "HOME", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const monthlyCounts = await getSummaryMonthlyCounts({ token: authToken, branchId: branchId === 'all' ? undefined : branchId })
  // console.log(productionsResponse)
  return (
    <div>
      <ProductionChart
        token={authToken}
        monthlyCounts={monthlyCounts} />
    </div>
  );
}