import { ImageResponse } from 'next/og';
import {META} from "@/config/settings";


export const size = {
    width: 128,
    height: 128,
};

export const contentType = 'image/png';

export default function Icon() {
    const acronym = META.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    fontFamily: 'Roboto Mono, system-ui',
                }}
            >

                <div
                    style={{
                        height: 100,
                        width: 128,
                        overflow: 'hidden',
                        borderRadius: 12,
                        backgroundColor: '#4e598c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
          <span
              style={{
                  color: 'white',
                  fontSize: 52,
                  fontWeight: "bold",
              }}
          >
            {acronym}
          </span>
                    <span
                        style={{
                            backgroundColor: '#ABD2FA',
                            height: 12,
                            width: 12,
                            borderRadius: '50%',
                            marginLeft: 4,
                            marginTop: 28,
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}