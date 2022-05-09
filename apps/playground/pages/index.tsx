import {
  Layout,
  PageTitle,
  BlogTitle,
  P,
  Intro,
  BrandLink,
  ArticlesHeadline,
  ArticleList,
  Article,
  Title,
  Description,
  DevTo,
  Medium,
  Fin,
} from "components";

export default function HomePage() {
  return (
    <Layout>
      <header>
        <BlogTitle>Unfinished thought</BlogTitle>
        <P>
          Hi, my name is Lukas Bombach, I work as a front end developer for{" "}
          <BrandLink brand="tonline" href="https://www.t-online.de/">
            t-online.de
          </BrandLink>{" "}
          in Berlin.
          <br />
          <span className="hidden sm:inline">
            This is my blog where I post experimental code and thoughts on software development.
            <br />
          </span>
          You can find me elsewhere on{" "}
          <BrandLink brand="twitter" href="https://twitter.com/luke_schmuke">
            Twitter
          </BrandLink>
          ,{" "}
          <BrandLink brand="github" href="https://github.com/LukasBombach/">
            GitHub
          </BrandLink>{" "}
          and{" "}
          <BrandLink brand="dribbble" href="https://dribbble.com/luke_schmuke">
            Dribbble
          </BrandLink>
          .
        </P>
      </header>
      <main>
        <ArticlesHeadline>Articles</ArticlesHeadline>
        <ArticleList>
          <Article href="/exploring-reactive-jsx">
            <Title>Exploring compile time reactive JSX</Title>
            <Description>Writing simpler components by transpiling away the hard parts</Description>
          </Article>
          <Article href="https://dev.to/lukasbombach/how-to-write-a-tree-shakable-component-library-4ied">
            <Title>
              How to write a tree-shakable component library <DevTo />
            </Title>
            <Description>
              You don't need all components on all pages. A walkthrough on making tree-shaking happen
            </Description>
          </Article>
          <Article href="https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5">
            <Title>
              The case of partial hydration (with Next and Preact) <Medium />
            </Title>
            <Description>
              Less JavaScript means better performance. Better performance means a better user experience
            </Description>
          </Article>
        </ArticleList>
      </main>
      <footer>
        <Fin />
      </footer>
    </Layout>
  );
}
