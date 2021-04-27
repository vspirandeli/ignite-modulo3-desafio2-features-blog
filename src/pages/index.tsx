// Modules
import { useState } from 'react';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Head from 'next/head';
import Link from 'next/link';

// CMS
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

// Components
import Header from '../components/Header';

// CSS
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

// Utils
import { capitalize } from '../utils/capitalize';
import { dateFormat } from '../utils/dateFormater';

// TS
interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPagePosts, setNextPagePosts] = useState<string>(
    postsPagination.next_page
  );

  const getNextPagePosts = async (): Promise<void> => {
    const postsResponse = await fetch(nextPagePosts);
    const postsJson = await postsResponse.json();

    // const postsResponse = await fetch(nextPagePosts).then(response =>
    //   response.json()
    // );

    const fetchetdPosts = postsJson.results.map((post: Post) => ({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }));

    setPosts([...posts, ...fetchetdPosts]);
    setNextPagePosts(postsJson.next_page);
  };

  return (
    <div className={styles.homeContainer}>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <Header />
      {posts.map(post => (
        <div className={styles.postContainer} key={post.uid}>
          <Link href={`/post/${post.uid}`}>
            <a>
              <h3>{post.data.title}</h3>
              <p>{post.data.subtitle}</p>
              <section className={commonStyles.iconsContainer}>
                <div className={commonStyles.calendarContainer}>
                  <FiCalendar />
                  <span>{dateFormat(post.first_publication_date)}</span>
                </div>

                <div className={commonStyles.userContainer}>
                  <FiUser />
                  <span>{capitalize(post.data.author)}</span>
                </div>
              </section>
            </a>
          </Link>
        </div>
      ))}

      {nextPagePosts && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={getNextPagePosts}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );

  const { next_page } = postsResponse;

  const results: Post[] = postsResponse.results.map((post: Post) => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
    revalidate: 60 * 60 * 3, // 12Horas (Total de 8 chamadas por dia).
  };
};
