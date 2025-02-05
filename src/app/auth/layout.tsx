// snnipet lrc

import Image from "next/image";
import AuthImage from '@/assets/logo_valery.png'

export default function AuthLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="auth__layout">
            <section className="flex items-center justify-center w-full">
                <Image
                    src={AuthImage}
                    width={800}
                    height={800}
                    priority={true}
                    alt="Auth Layout"
                />
            </section>
            {children}
        </main>
    );
}