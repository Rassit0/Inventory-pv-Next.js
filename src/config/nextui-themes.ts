import { ConfigTheme } from "@heroui/react";

export const valeryLight: ConfigTheme = {
    extend: 'light',
    // layout: {
    //     radius: {
    //         small: '5px',
    //         medium: '8px',
    //         large: '12px',
    //     }
    // },
    layout: {
        boxShadow: {
            small: '0px 8px 25px rgba(0,0,0,0.02)',
            medium: '0px 8px 25px rgba(0,0,0,0.08)'
        }
    },
    colors: {
        background: '#f8f8f8',
        // foreground: '#0e0e11',
        // foreground: '#333333',

        primary: {
            foreground: '#fff',
            DEFAULT: '#035AA6',
            '50': '#f0f7ff',
            '100': '#e0effe',
            '200': '#badffd',
            '300': '#7dc5fc',
            '400': '#38a8f8',
            '500': '#0e8de9',
            '600': '#026ec7',
            '700': '#074b85',
            '800': '#0c3f6e',
            '900': '#082849',
        },
        secondary: {
            DEFAULT: '#F49401',
            '50': '#fffbea',
            '100': '#fff3c5',
            '200': '#ffe686',
            '300': '#ffd346',
            '400': '#ffbe1c',
            '500': '#e17300',
            '600': '#bb4e02',
            '700': '#973c09',
            '800': '#7c310b',
            '900': '#481700',
        }
    }
}