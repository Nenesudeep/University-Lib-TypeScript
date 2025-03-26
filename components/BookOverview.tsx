import Image from 'next/image';
import React from 'react';
import BookCover from './BookCover';

const BookOverview = ({
    title,
    author,
    genre,
    rating,
    total_copies,
    available_copies,
    description,
    color,
    cover,
    isLoanedBook = false,
}: Book) => {
    return (
        <section className="book-overview">
            <div className="flex flex-1 flex-col gap-5">
                <h1>{title}</h1>

                <div className="book-info">
                    <p>
                        By <span className="font-semibold text-light-200">{author}</span>
                    </p>
                    <p>
                        Category: <span className="font-semibold text-light-200">{genre}</span>
                    </p>
                    <div className="flex flex-row gap-1">
                        <Image src={'/icons/star.svg'} alt="starLogo" width={22} height={22} />
                        <p>{rating}</p>
                    </div>
                    <div className="book-copies">
                        <p>
                            Total Books : <span>{total_copies}</span>
                        </p>
                        <p>
                            Available Books : <span>{available_copies}</span>
                        </p>
                    </div>
                    <p className="book-description">{description}</p>
                    <button type="button" className="btn btn-">
                        <Image
                            src={'/icons/book.svg'}
                            alt="bookImage"
                            width={20}
                            height={20}
                        ></Image>
                        <p className="font-bebas-neue text-xl text-dark-100"> Borrow </p>
                    </button>
                </div>
            </div>
            <div className="relative flex flex-1 justify-center">
                <div className="relative">
                    <BookCover
                        variant="wide"
                        className="z-10"
                        coverColor={color}
                        coverImage={cover}
                    />
                    <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden"></div>
                </div>
            </div>
        </section>
    );
};

export default BookOverview;
