"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import ScanQR from "../readqr";

interface ReadQRModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReadQRModal: React.FC<ReadQRModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Scan QR"
            description=""
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <ScanQR />
            </div>
        </Modal>
    );
};