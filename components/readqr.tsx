"use client"

import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

const ScanQR = () => {
    const [data, setData] = useState("No result");

    useEffect(() => {

        const submitHandler = async () => {
            if (data.trim().length === 0) return;

            try {
                if (data.length > 0 && data !== 'No result') {
                    setData('No result');
                    window.location.assign(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        submitHandler();
    }, [data])

    return (
        <div className="w-full">
            <div>
                {
                    <QrReader
                        onResult={(result, error) => {
                            if (!!result && result?.getText() != 'No result') {
                                setData(result?.getText());
                            }
                            if (!!error) {
                                console.info(error);
                            }
                        }
                        }
                        constraints={{ facingMode: "environment" }}
                    />
                }
                <p>{data}</p>
            </div>
        </div>
    );
}

export default ScanQR;
