import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from "next-auth/react";
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { useRouter } from 'next/router'



const post =
{
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: '<p>Fake Post Content</p>',
    updatedAt: '31 de dezembro de 2019',
}

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Posts Preview page', () => {

    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "loading"
        })

        render(<Post post={post} />);

        expect(screen.getByText('Fake title 1')).toBeInTheDocument();
        expect(screen.getByText('Fake Post Content')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterhMocked = mocked(useRouter)

        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@example.com'
                },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            status: "authenticated"
        })

        useRouterhMocked.mockReturnValueOnce({
            push: pushMock
        } as any)


        render(<Post post={post} />);

        expect(pushMock).toHaveBeenCalledWith('/posts/fake-slug')
    });

    it('load initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockReturnValueOnce({
                data: {
                    title: [
                        { type: 'paragraph', text: 'Fake title 1' }
                    ],
                    content: [
                        {
                            type: 'paragraph',
                            text: 'Fake Post Content',
                        },
                    ],
                },
                last_publication_date: '2019-12-31'
            })
        } as any)


        const response = await getStaticProps({ params: { slug: 'fake-slug' } })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'fake-slug',
                        title: 'Fake title 1',
                        content: '<p>Fake Post Content</p>',
                        updatedAt: '30 de dezembro de 2019'
                    }
                }
            })
        )
    })
});