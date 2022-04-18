import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';


const post =
{
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: '<p>Fake Post Content</p>',
    updatedAt: '31 de dezembro de 2019',
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Posts page', () => {

    it('renders correctly', () => {
        render(<Post post={post} />);

        expect(screen.getByText('Fake title 1')).toBeInTheDocument();
        expect(screen.getByText('Fake Post Content')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: { slug: 'fake-slug' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    });

    it('load initial data', async () => {
        const getSessionMocked = mocked(getSession)
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


        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

        const response = await getServerSideProps({
            params: { slug: 'fake-slug' }
        } as any)

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