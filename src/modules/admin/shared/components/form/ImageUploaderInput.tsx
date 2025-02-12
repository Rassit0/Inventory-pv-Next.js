"use client"
import { Card, CardBody } from '@heroui/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';

interface Props {
    name: string;
    imageDefault?: string;
}
export const ImageUploaderInput = ({ name, imageDefault }: Props) => {
    const [image, setImage] = useState<string | null>(imageDefault || null);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input real

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            // ✅ Asignar el archivo al input oculto
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] }, // Acepta solo imágenes
        multiple: false, // Solo un archivo a la vez
    });
    return (
        <Card shadow='sm' className='h-full m-4 border-dashed border-2 border-gray-300 hover:border-primary cursor-pointer'>
            <CardBody>
                <div {...getRootProps()} className="h-full flex flex-col items-center justify-center text-center">
                    <input {...getInputProps()} />
                    <input type="file" name={name} ref={fileInputRef} hidden />
                    {image ? (
                        <div className='relative mt-4 w-full h-[200px] flex items-center justify-center'>
                            <Image
                                src={image}
                                alt='Vista previa'
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className='rounded-lg object-contain'
                                onError={() => setImageError(true)}
                            />
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-500">Haz clic o arrastra una imagen aquí</p>
                            <p className="text-sm text-gray-400">(Formatos permitidos: JPG, PNG, GIF)</p>
                        </>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}
