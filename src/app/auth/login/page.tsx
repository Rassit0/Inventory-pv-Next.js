//snnipet prc

import { LoginForm } from "@/modules/auth";

export default function LoginPage() {
    return (
        <section className="login__page">
            <div className="container">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Inicia Sesión</h1>
                    <p>Ingresa tus credenciales y comienza a gestionar tu restaurante</p>
                </div>

                {/* FORMULARIO */}
                <LoginForm/>
            </div>
        </section>
    );
}