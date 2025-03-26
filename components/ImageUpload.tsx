'use client';
import React, { useRef, useState } from 'react';
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from 'imagekitio-next';
import config from '@/lib/config';
import ImageKit from 'imagekit';
import Image from 'next/image';
import { toast } from 'sonner';

const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request Failed with status ${response.status}:${errorText}`);
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return { token, expire, signature };
    } catch (error: any) {
        throw new Error(`Authentication Failed ${error.message}`);
    }
};

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
    const IKUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string } | null>(null); // this will contain the file path which is of type string

    const onError = (error: any) => {
        console.log(error);
        toast('Image Upload Failed retry again');
    };
    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);

        toast(`Image Uploaded Successfully`);
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                className="hidden"
                ref={IKUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                fileName="test-upload.png"
            />
            <button
                className="upload-btn"
                onClick={(e) => {
                    e.preventDefault();
                    if (IKUploadRef.current) {
                        //@ts-ignore
                        IKUploadRef.current?.click();
                    }
                }}
            >
                <Image src={'/icons/upload.svg'} alt="upload Image" width={20} height={20} />
                <p className="text-base text-light-100">Upload a File</p>
                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>
            {file && <IKImage alt={file.filePath} path={file.filePath} width={500} height={300} />}
        </ImageKitProvider>
    );
};

export default ImageUpload;
