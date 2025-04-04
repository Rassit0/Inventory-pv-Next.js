import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
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
    const branchesResponse = await getBranches({ token: authToken });
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
                    branches={branchesResponse?.branches || []}
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