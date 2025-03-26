'use client';
import { cn, getInitials } from '@/lib/utils'; // we can use cn as className
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Session } from 'next-auth';

const Header = ({session}:{session:Session}) => {
    const pathname = usePathname();

    return (
        <header className="my-10 flex justify-between gap-5">
            <Link href={'/'}>
                <Image src={'icons/logo.svg'} alt="logo" width={40} height={40} />
            </Link>

            <ul className="">
                <li>
                    <Link
                        href={'/library'}
                        className={cn(
                            'text-base cursor-pointer capitalize',
                            pathname === '/library' ? 'text-light-200' : 'text-light-100',
                        )}
                    >
                        Library
                    </Link>
                </li>

                <li>
                    <Link href={'/my-profile'}>
                        <Avatar>
                            <AvatarFallback className='text-black bg-amber-100'>
                                {getInitials(session.user?.name || 'IN')}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;
