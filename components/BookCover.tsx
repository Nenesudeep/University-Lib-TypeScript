import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: 'w-[50px] h-[75px]',
    small: 'w-[100px] h-[150px]',
    medium: 'w-[150px] h-[225px]',
    regular: 'w-[200px] h-[300px]',
    wide: 'w-[300px] h-[450px]',
}; // this changes are done by gemini AI for the variant Styles

interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

const BookCover = ({
    className,
    variant = 'regular',
    coverColor = '#012B48',
    coverImage = 'https://placehold.co/400*600.png',
}: Props) => {
    return (
        <div
            className={cn(
                'relative transition-all duration-300',
                variantStyles[variant],
                className,
            )}
        >
            <BookCoverSvg coverColor={coverColor} />
            <div
                className="absolute z-10 rounded-sm"
                style={{ left: '12%', width: '75%', height: '88%' }}
            >
                <Image src={coverImage} alt="" fill className="object-fill" />
            </div>
        </div>
    );
};

export default BookCover;
