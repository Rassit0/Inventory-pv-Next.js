import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranchesResponse } from "@/modules/admin/branches";
import { getParallelGroups } from "@/modules/admin/production";
import { NavMenu, SideMenu } from "@/modules/admin/shared";
import { findUser } from "@/modules/admin/users";
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";
import { use } from "react";

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { authToken, user } = await getAuthUser();
    if (!authToken) {
        redirect("/auth/login"); // Redirige si no hay token
    }
    const branchesResponse = await getBranchesResponse({ token: authToken });
    const userInfo = await findUser({ token: authToken, id: user.id });
    if (!userInfo) {
        redirect("/auth/login"); // Redirige si no hay token
    }
    const roleName = userInfo.role.name;

    let parallelGroups = undefined;
    if (hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) {
        parallelGroups = await getParallelGroups({ token: authToken })
    };
    return (
        <div className="admin__layout">
            <SideMenu user={user} />
            <main className="admin__layout--main">
                <NavMenu
                    token={authToken}
                    branchesResponse={branchesResponse || { branches: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
                    userBranchIds={userInfo.userBranches.map(b => (b.branchId))}
                    // hiddeBranches={userInfo.hasGlobalBranchesAccess}
                    parallelGroups={parallelGroups}
                    hasGlobalBranchesAccess={userInfo.hasGlobalBranchesAccess}
                />
                {children}
            </main>
        </div>
    );
}