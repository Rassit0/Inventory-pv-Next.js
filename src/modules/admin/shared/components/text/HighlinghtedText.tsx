import React from 'react'

interface Props {
    text: string;
    highlight: string;
    highlightClassName?: string; // Clase CSS opcional
}

export const HighlinghtedText = ({ text, highlight, highlightClassName = "bg-yellow-200"  }: Props) => {
    if (!highlight) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={index} className={highlightClassName}>{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
}
