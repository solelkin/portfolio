import { useRef } from 'react';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import Footer from 'components/Footer';
import Divider from 'components/Divider';
import { numToMs, msToNum } from 'utils/style';
import { useWindowSize, useScrollRestore } from 'hooks';
import Image from 'components/Image';
import SEO from 'components/SEO';
import { MDXProvider } from '@mdx-js/react';
import Link from 'components/Link';
import Code from 'components/Code';
import Section from 'components/Section';
import Heading from 'components/Heading';
import Text from 'components/Text';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import { media } from 'utils/style';
import ArrowDown from 'assets/arrow-down.svg';
import { tokens } from 'components/ThemeProvider/theme';
import './index.css';

const PostWrapper = ({
  children,
  title,
  description,
  date,
  banner,
  bannerPlaceholder,
  bannerAlt = '',
  readTime,
}) => {
  const { width } = useWindowSize();
  const scrollRef = useRef();
  useScrollRestore();

  const handleScrollIndicatorClick = event => {
    event.preventDefault();

    window.scrollTo({
      top: scrollRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <article className="post">
      <SEO
        title={`Articles | ${title}`}
        description={description}
        socialImage={banner ? require(`posts/assets/${banner}`) : undefined}
      />
      <header className="post__header">
        <div className="post__header-text">
          <Transition
            appear
            in={!prerender}
            timeout={msToNum(tokens.base.durationM)}
            onEnter={reflow}
          >
            {status => (
              <div className="post__date">
                <Divider
                  notchWidth={width > media.mobile ? '90px' : '60px'}
                  notchHeight={width > media.mobile ? '10px' : '8px'}
                  collapsed={status !== 'entered'}
                />
                <span
                  className={classNames('post__date-text', `post__date-text--${status}`)}
                >
                  {new Date(date).toLocaleDateString('default', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            )}
          </Transition>
          <Heading level={1} weight="bold" className="post__title" aria-label={title}>
            {title.split(' ').map((word, index) => (
              <span className="post__title-word-wrapper" key={`${word}-${index}`}>
                <span
                  className="post__title-word"
                  style={{ '--delay': numToMs(index * 120 + 200) }}
                  index={index}
                >
                  {word}
                  {index !== title.split(' ').length - 1 ? '\u00a0' : ''}
                </span>
              </span>
            ))}
          </Heading>
          <a
            className="post__banner-arrow"
            href="#postContent"
            aria-label="Scroll to post content"
            onClick={handleScrollIndicatorClick}
          >
            <ArrowDown aria-hidden />
          </a>
          <div className="post__banner-read-time">{readTime}</div>
        </div>
        <div className="post__banner">
          <Image
            reveal
            delay={600}
            className="post__banner-image"
            src={banner ? require(`posts/assets/${banner}`) : undefined}
            placeholder={
              bannerPlaceholder ? require(`posts/assets/${bannerPlaceholder}`) : undefined
            }
            alt={bannerAlt}
          />
        </div>
      </header>
      <Section className="post__content-wrapper" id="postContent" ref={scrollRef}>
        <div className="post__content">{children}</div>
      </Section>
      <Footer />
    </article>
  );
};

const PostHeadingTwo = ({ children, ...rest }) => (
  <Heading className="post__heading-two" level={3} {...rest}>
    {children}
  </Heading>
);

const PostParagraph = ({ children, ...rest }) => (
  <Text className="post__paragraph" size="l" {...rest}>
    {children}
  </Text>
);

const PostList = ({ children, ...rest }) => (
  <PostParagraph {...rest}>
    <ul>{children}</ul>
  </PostParagraph>
);

const PostImage = ({ src, alt, ...rest }) => {
  const imgSrc = src.startsWith('http') ? src : require(`posts/assets/${src}`);

  return <Image className="post__image" src={imgSrc} alt={alt} {...rest} />;
};

const PostCode = ({ children, ...rest }) => (
  <code className="post__code" {...rest}>
    {children}
  </code>
);

const PostLink = ({ ...props }) => <Link {...props} />;

const Post = ({ slug, content: PostContent, ...rest }) => (
  <MDXProvider
    components={{
      wrapper: PostWrapper,
      h2: PostHeadingTwo,
      p: PostParagraph,
      ul: PostList,
      img: PostImage,
      a: PostLink,
      pre: Code,
      inlineCode: PostCode,
    }}
  >
    <PostContent slug={slug} {...rest} />
  </MDXProvider>
);

export default Post;
