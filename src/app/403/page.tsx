"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <Card className="max-w-md text-center shadow-lg">
                <CardBody className="p-8">
                    <h1 className="text-5xl font-bold text-red-500">403</h1>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                        Acceso Denegado
                    </h2>
                    <p className="mt-2 text-gray-600">
                        No tienes permisos para ver esta página.
                    </p>
                    <Button
                        color="primary"
                        variant="shadow"
                        className="mt-6"
                        onPress={() => {
                            router.back(); // Primer retroceso
                            setTimeout(() => {
                                router.push('/admin/home'); // Segundo retroceso después de un pequeño retraso
                            }, 5);
                        }}
                    >
                        Ir a Inicio
                    </Button>
                    <Button
                        color="primary"
                        variant="shadow"
                        className="mt-6"
                        onPress={() => router.push('/auth/login')}
                    >
                       Iniciar Sesión
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}
