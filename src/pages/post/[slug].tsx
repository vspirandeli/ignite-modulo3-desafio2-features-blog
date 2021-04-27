// Modules
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

// CMS
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

// Components
import Header from '../../components/Header';

// CSS
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

// Utils
import { dateFormat } from '../../utils/dateFormater';
import { capitalize } from '../../utils/capitalize';

// TS
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface ContentData {
  heading: string;
  body: {
    text: string;
  }[];
}

// APP
export default function Post({ post }: PostProps): JSX.Element {
  const [readingTime, setReadingTime] = useState<number>(0);

  const router = useRouter();
  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  useEffect(() => {
    const wordsCounter = post?.data?.content.reduce((acc, context) => {
      const wordsInBody = RichText.asText(context.body).split(/\W/gim).length;
      // const wordsInTitle = RichText.asText(context.heading).split(/\W/gim)
      //   .length;

      // return acc + (wordsInBody + wordsInTitle);
      return acc + wordsInBody;
    }, 0);

    const totalTimeToRead = Math.ceil(Number(wordsCounter) / 200);

    setReadingTime(Number(totalTimeToRead));
  }, [post]);

  return (
    <div>
      <Head>
        <title>spacetraveling | {post?.data.title}</title>
      </Head>

      <main className={styles.pageContainer}>
        <div className={styles.globalHeader}>
          <Header />
        </div>
        <div className={styles.imageContainer}>
          <img src={post?.data?.banner?.url} alt="Eat Sleep Code Repeat" />
        </div>

        <section className={styles.postContainer}>
          <header>
            <h1>{post?.data.title}</h1>
            <section className={commonStyles.iconsContainer}>
              <div className={commonStyles.calendarContainer}>
                <FiCalendar />
                <span>{dateFormat(post?.first_publication_date)}</span>
              </div>

              <div className={commonStyles.userContainer}>
                <FiUser />
                <span>{capitalize(post?.data?.author)}</span>
              </div>

              <div className={commonStyles.timeContainer}>
                <FiClock />
                <span>{readingTime} min</span>
              </div>
            </section>
          </header>

          <article className={styles.post}>
            {post?.data?.content.map(content => (
              <div className={styles.postHeader} key={content.heading}>
                <h2>{content.heading}</h2>
                {content.body.map(bodyContent => (
                  <p key={bodyContent.text}>{bodyContent.text}</p>
                ))}
              </div>
            ))}
          </article>
        </section>
      </main>
    </div>
  );
}

// SSG
export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    // redirect: 60 * 60 * 0.5, // meia em meia hora
  };
};
