import QRCode from "react-qr-code";

const GenerateQR = ({ serialNumber }: { serialNumber: string }) => {
    return (
        <div>
            {serialNumber != "" && <>
            <QRCode id="QRCode" value={serialNumber} size={128} viewBox="0 0 128 128" />
                <input
                    type="button"
                    value="Скачать QR"
                    className="cursor-pointer"
                    onClick={() => {
                        const svg = document.getElementById("QRCode") as HTMLElement;
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
                        const img = new Image();
                        img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            const pngFile = canvas.toDataURL("image/png");
                            const downloadLink = document.createElement("a");
                            downloadLink.download = "QRCode";
                            downloadLink.href = `${pngFile}`;
                            downloadLink.click();
                        };
                        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
                    }}
                    
                />
            </>}
        </div>
    );
}

export default GenerateQR;
